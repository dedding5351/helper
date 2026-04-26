from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.models.issue import (
    IssueListResponse, IssueDetailResponse, Issue, 
    ActivityEvent, IssueStatusUpdate, CommentCreate, IssueCreate, IssueUpdate,
    BulkIssueUpdate, BulkUpdateResponse
)
from app.services.issue_service import IssueService
from app.core.dependencies import get_issue_service, get_current_user_id

router = APIRouter(tags=["issues"])

@router.patch("/bulk", response_model=BulkUpdateResponse)
def bulk_update_issues(body: BulkIssueUpdate, service: IssueService = Depends(get_issue_service)):
    """Bulk update multiple issues."""
    try:
        if body.update.assignee == "":
            body.update.assignee = None
        return service.bulk_update_issues(body)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=IssueListResponse)
def list_issues(
    status: Optional[str] = Query(None, description="Comma-separated list of statuses, e.g. Open,Auto-Escalated"),
    assignee: Optional[str] = Query(None, description="Assignee filter"),
    requester: Optional[str] = Query(None, description="Requester filter (user who submitted the ticket)"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: IssueService = Depends(get_issue_service)
):
    """Retrieve a list of issues."""
    return service.list_issues(status=status, assignee=assignee, requester=requester, limit=limit, offset=offset)

@router.post("/", response_model=Issue, status_code=201)
def create_issue(body: IssueCreate, service: IssueService = Depends(get_issue_service)):
    """Create a new issue."""
    return service.create_issue(body)

@router.get("/{issue_id}", response_model=IssueDetailResponse)
def get_issue(issue_id: str, service: IssueService = Depends(get_issue_service)):
    """Retrieve the detailed view of a single issue."""
    try:
        return service.get_issue(issue_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/{issue_id}/status", response_model=Issue)
def update_issue_status(issue_id: str, body: IssueStatusUpdate, service: IssueService = Depends(get_issue_service)):
    """Update the status of an issue."""
    try:
        return service.update_issue_status(issue_id, body)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{issue_id}", response_model=Issue)
def update_issue(issue_id: str, body: IssueUpdate, service: IssueService = Depends(get_issue_service)):
    """General update for an issue."""
    try:
        # Map "" assignee to None to properly clear the column
        if body.assignee == "":
            body.assignee = None
        return service.update_issue(issue_id, body)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{issue_id}/comments", response_model=ActivityEvent, status_code=201)
def add_comment(
    issue_id: str, 
    body: CommentCreate, 
    service: IssueService = Depends(get_issue_service),
    current_user: str = Depends(get_current_user_id)
):
    """Adds a new comment or action to the issue's activity feed."""
    try:
        return service.add_comment(issue_id, body, author=current_user)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
