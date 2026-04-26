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

    def get_by_id(self, runbook_id: int) -> Optional[RunbookDB]:
        return self.db.query(RunbookDB).filter(RunbookDB.id == runbook_id).first()

    def create(self, title: str, author: str, tags_json: str, status: str, description: Optional[str] = None, source_filename: Optional[str] = None) -> RunbookDB:
        db_runbook = RunbookDB(
            title=title,
            author=author,
            tags_json=tags_json,
            status=status,
            description=description,
            source_filename=source_filename
        )
        self.db.add(db_runbook)
        self.db.commit()
        self.db.refresh(db_runbook)
        return db_runbook
