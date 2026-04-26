from typing import Optional
from app.repositories.runbook_repository import RunbookRepository
from app.models.runbook import RunbookListResponse, Runbook

class RunbookService:
    """
    Business Logic Layer for Runbooks.
    """
    def __init__(self, repository: RunbookRepository):
        self.repository = repository

    def list_runbooks(self, status: Optional[str] = None) -> RunbookListResponse:
        db_runbooks = self.repository.get_all(status=status)
        return RunbookListResponse(
            data=[Runbook.model_validate(rb) for rb in db_runbooks]
        )
