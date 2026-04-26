from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.runbook import RunbookDB

class RunbookRepository:
    """
    Data Access Layer for Runbooks.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, status: Optional[str] = None) -> List[RunbookDB]:
        query = self.db.query(RunbookDB)
        if status:
            query = query.filter(RunbookDB.status == status)
        return query.all()
