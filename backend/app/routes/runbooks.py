from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.models.runbook import RunbookListResponse
from app.services.runbook_service import RunbookService
from app.core.dependencies import get_runbook_service

router = APIRouter(tags=["runbooks"])

@router.get("/", response_model=RunbookListResponse)
def list_runbooks(
    status: Optional[str] = Query(None, description="Filter by status (e.g., Active)"),
    service: RunbookService = Depends(get_runbook_service)
):
    """Retrieve all available runbooks."""
    return service.list_runbooks(status=status)

@router.get("/{runbook_id}")
def get_runbook(
    runbook_id: str,
    service: RunbookService = Depends(get_runbook_service)
):
    """Retrieve a single runbook by its ID."""
    from fastapi import HTTPException
    runbook = service.get_runbook(runbook_id)
    if not runbook:
        raise HTTPException(status_code=404, detail="Runbook not found")
    return runbook
