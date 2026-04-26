from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.issue import IssueDB, ActivityEventDB
from datetime import datetime

class IssueRepository:
    """
    Data Access Layer for Issues.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, status: Optional[str] = None, assignee: Optional[str] = None, requester: Optional[str] = None, limit: int = 50, offset: int = 0) -> Tuple[List[IssueDB], int]:
        query = self.db.query(IssueDB)

        if status:
            # Handle comma separated statuses like 'Open,Auto-Escalated'
            statuses = [s.strip() for s in status.split(',')]
            query = query.filter(IssueDB.status.in_(statuses))

        if assignee:
            if assignee == "null":
                query = query.filter(IssueDB.assignee.is_(None))
            else:
                query = query.filter(IssueDB.assignee == assignee)

        if requester:
            query = query.filter(IssueDB.requester == requester)

        total = query.count()
        issues = query.order_by(IssueDB.created_at.desc()).offset(offset).limit(limit).all()
        return issues, total

    def get_by_id(self, issue_id: int) -> Optional[IssueDB]:
        # IssueDB has eager/lazy loading config for activity_events in model or we can rely on standard relationships
        return self.db.query(IssueDB).filter(IssueDB.id == issue_id).first()

    def create(self, title: str, priority: str, status: str = "Open", assignee: Optional[str] = None, requester: Optional[str] = None, description: Optional[str] = None) -> IssueDB:
        db_issue = IssueDB(
            title=title,
            priority=priority,
            status=status,
            assignee=assignee,
            requester=requester,
            description=description,
            created_at=datetime.utcnow()
        )
        self.db.add(db_issue)
        self.db.commit()
        self.db.refresh(db_issue)
        return db_issue

    def update_status(self, issue_id: int, new_status: str) -> Optional[IssueDB]:
        db_issue = self.get_by_id(issue_id)
        if not db_issue:
            return None
            
        db_issue.status = new_status
        self.db.commit()
        self.db.refresh(db_issue)
        return db_issue

    def update_issue(self, issue_id: int, update_data: dict) -> Optional[IssueDB]:
        db_issue = self.get_by_id(issue_id)
        if not db_issue:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(db_issue, key, value)

        self.db.commit()
        self.db.refresh(db_issue)
        return db_issue

    def bulk_update(self, issue_ids: list[int], update_data: dict) -> list[IssueDB]:
        db_issues = self.db.query(IssueDB).filter(IssueDB.id.in_(issue_ids)).all()
        for db_issue in db_issues:
            for key, value in update_data.items():
                if value is not None:
                    setattr(db_issue, key, value)
        self.db.commit()
        for db_issue in db_issues:
            self.db.refresh(db_issue)
        return db_issues

    def add_comment(self, issue_id: int, event_type: str, author: str, message: str, metadata_json: Optional[str] = None) -> ActivityEventDB:
        db_event = ActivityEventDB(
            issue_id=issue_id,
            type=event_type,
            author=author,
            message=message,
            metadata_json=metadata_json,
            timestamp=datetime.utcnow()
        )
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event
