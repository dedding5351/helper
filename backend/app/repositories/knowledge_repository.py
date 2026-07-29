from typing import List, Optional
from sqlalchemy.orm import Session
from models.knowledge import KnowledgeDocumentDB

class KnowledgeRepository:
    """
    Data Access Layer for Knowledge Documents in SQLite.
    """
    def __init__(self, db: Session):
        self.db = db

    def create(self, runbook_id: int, filename: str, content_type: str, raw_text: str = None) -> KnowledgeDocumentDB:
        db_doc = KnowledgeDocumentDB(
            runbook_id=runbook_id,
            filename=filename,
            content_type=content_type,
            raw_text=raw_text
        )
        self.db.add(db_doc)
        self.db.commit()
        self.db.refresh(db_doc)
        return db_doc

    def get_by_runbook(self, runbook_id: int) -> List[KnowledgeDocumentDB]:
        return self.db.query(KnowledgeDocumentDB).filter(KnowledgeDocumentDB.runbook_id == runbook_id).all()

    def update_status(self, doc_id: int, status: str, chunk_count: int) -> Optional[KnowledgeDocumentDB]:
        db_doc = self.db.query(KnowledgeDocumentDB).filter(KnowledgeDocumentDB.id == doc_id).first()
        if db_doc:
            db_doc.status = status
            db_doc.chunk_count = chunk_count
            self.db.commit()
            self.db.refresh(db_doc)
        return db_doc

    def delete(self, doc_id: int) -> None:
        db_doc = self.db.query(KnowledgeDocumentDB).filter(KnowledgeDocumentDB.id == doc_id).first()
        if db_doc:
            self.db.delete(db_doc)
            self.db.commit()
