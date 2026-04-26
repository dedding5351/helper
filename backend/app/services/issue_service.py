from typing import Optional
from app.repositories.issue_repository import IssueRepository
from app.models.issue import (
    IssueListResponse, IssueDetailResponse, IssueMeta, 
    Issue, IssueDetail, ActivityEvent, IssueStatusUpdate, CommentCreate, IssueCreate, IssueUpdate,
    BulkIssueUpdate, BulkUpdateResponse
)

class IssueService:
    """
    Business Logic Layer for Issues.
    """
    def __init__(self, repository: IssueRepository):
        self.repository = repository

    def _parse_id(self, prefixed_id: str) -> int:
        if not prefixed_id.startswith("IT-"):
            raise ValueError(f"Invalid issue ID format: {prefixed_id}. Expected 'IT-XXX'")
        try:
            return int(prefixed_id[3:])
        except ValueError:
            raise ValueError(f"Invalid issue ID format: {prefixed_id}. Must contain integer after prefix.")

    def list_issues(self, status: Optional[str] = None, assignee: Optional[str] = None, requester: Optional[str] = None, limit: int = 50, offset: int = 0) -> IssueListResponse:
        db_issues, total = self.repository.get_all(status=status, assignee=assignee, requester=requester, limit=limit, offset=offset)

        return IssueListResponse(
            data=[Issue.model_validate(issue) for issue in db_issues],
            meta=IssueMeta(total=total, limit=limit, offset=offset)
        )

    def get_issue(self, issue_id: str) -> IssueDetailResponse:
        internal_id = self._parse_id(issue_id)
        db_issue = self.repository.get_by_id(internal_id)
        
        if not db_issue:
            raise ValueError("Issue not found")
            
        return IssueDetailResponse(data=IssueDetail.model_validate(db_issue))

    def create_issue(self, issue_data: IssueCreate) -> Issue:
        allowed_statuses = {"Open", "In Progress", "Auto-Escalated", "Resolved"}
        status = issue_data.status or "Open"
        if status not in allowed_statuses:
            raise ValueError(f"Invalid status. Allowed values are: {', '.join(allowed_statuses)}")

        db_issue = self.repository.create(
            title=issue_data.title,
            priority=issue_data.priority,
            assignee=issue_data.assignee,
            requester=issue_data.requester,
            description=issue_data.description,
            status=status,
        )

        creation_message = (
            "Ticket manually escalated by requester."
            if status == "Auto-Escalated"
            else "Ticket created."
        )
        self.repository.add_comment(
            issue_id=db_issue.id,
            event_type="System",
            author="System",
            message=creation_message,
        )
        return Issue.model_validate(db_issue)

    def update_issue_status(self, issue_id: str, status_update: IssueStatusUpdate) -> Issue:
        internal_id = self._parse_id(issue_id)
        
        allowed_statuses = {"Open", "In Progress", "Auto-Escalated", "Resolved"}
        if status_update.status not in allowed_statuses:
            raise ValueError(f"Invalid status. Allowed values are: {', '.join(allowed_statuses)}")

        db_issue = self.repository.update_status(internal_id, status_update.status)
        
        if not db_issue:
            raise ValueError("Issue not found")
            
        return Issue.model_validate(db_issue)

    def update_issue(self, issue_id: str, update_data: IssueUpdate) -> Issue:
        numeric_id = issue_id.replace("IT-", "")
        if not numeric_id.isdigit():
            raise ValueError(f"Invalid issue ID format: {issue_id}")

        allowed_statuses = {"Open", "In Progress", "Auto-Escalated", "Resolved"}
        if update_data.status and update_data.status not in allowed_statuses:
            raise ValueError(f"Invalid status: {update_data.status}")

        db_issue = self.repository.update_issue(int(numeric_id), update_data.model_dump(exclude_unset=True))
        if not db_issue:
            raise ValueError(f"Issue {issue_id} not found")
        
        changes = []
        if update_data.status:
            changes.append(f"status to {update_data.status}")
        if update_data.priority:
            changes.append(f"priority to {update_data.priority}")
        if update_data.assignee:
            changes.append(f"assignee to {update_data.assignee}")
        elif update_data.assignee == "":
            changes.append("assignee to Unassigned")
            
        if changes:
            message = "Updated " + ", ".join(changes)
            self.repository.add_comment(
                issue_id=int(numeric_id),
                event_type="System",
                author="System",
                message=message
            )

        return Issue.model_validate(db_issue)

    def bulk_update_issues(self, data: BulkIssueUpdate) -> BulkUpdateResponse:
        numeric_ids = []
        for prefixed_id in data.issue_ids:
            try:
                numeric_ids.append(self._parse_id(prefixed_id))
            except ValueError:
                continue
        
        allowed_statuses = {"Open", "In Progress", "Auto-Escalated", "Resolved"}
        if data.update.status and data.update.status not in allowed_statuses:
            raise ValueError(f"Invalid status: {data.update.status}")

        db_issues = self.repository.bulk_update(numeric_ids, data.update.model_dump(exclude_unset=True))
        
        changes = []
        if data.update.status:
            changes.append(f"status to {data.update.status}")
        if data.update.priority:
            changes.append(f"priority to {data.update.priority}")
        if data.update.assignee:
            changes.append(f"assignee to {data.update.assignee}")
        elif data.update.assignee == "":
            changes.append("assignee to Unassigned")
            
        if changes:
            message = "Bulk updated " + ", ".join(changes)
            for db_issue in db_issues:
                self.repository.add_comment(
                    issue_id=db_issue.id,
                    event_type="System",
                    author="System",
                    message=message
                )

        return BulkUpdateResponse(
            updated=len(db_issues),
            issues=[Issue.model_validate(issue) for issue in db_issues]
        )

    def add_comment(self, issue_id: str, comment: CommentCreate, author: str) -> ActivityEvent:
        internal_id = self._parse_id(issue_id)
        
        # Verify issue exists first
        db_issue = self.repository.get_by_id(internal_id)
        if not db_issue:
            raise ValueError("Issue not found")
            
        db_event = self.repository.add_comment(
            issue_id=internal_id,
            event_type="Human", # Default for comments
            author=author,
            message=comment.message
        )
        
        return ActivityEvent.model_validate(db_event)
