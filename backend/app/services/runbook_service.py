from typing import Optional
from repositories.runbook_repository import RunbookRepository
from models.runbook import RunbookListResponse, Runbook

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

    def get_runbook(self, runbook_id: str) -> Optional[Runbook]:
        internal_id = int(runbook_id.replace("RB-", ""))
        db_runbook = self.repository.get_by_id(internal_id)
        if db_runbook:
            return Runbook.model_validate(db_runbook)
        return None
