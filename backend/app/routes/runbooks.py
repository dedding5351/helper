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
