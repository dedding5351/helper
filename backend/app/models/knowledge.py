from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base
from datetime import datetime

# --- SQLAlchemy DB Models ---

class KnowledgeDocumentDB(Base):
    __tablename__ = "knowledge_documents"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    runbook_id = Column(Integer, ForeignKey("runbooks.id"), nullable=False)
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)   # "application/pdf", "text/plain", "text/markdown"
    raw_text = Column(Text, nullable=True)           # Full extracted text for reference
    chunk_count = Column(Integer, default=0)
    status = Column(String, default="processing")    # processing | ready | failed
    created_at = Column(DateTime, server_default=func.now())

# --- Pydantic Models ---

class KnowledgeDocument(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    runbookId: str
    filename: str
    contentType: str
    chunkCount: int
    status: str
    createdAt: datetime

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        if isinstance(obj, KnowledgeDocumentDB):
            return cls(
                id=f"DOC-{obj.id:03d}",
                runbookId=f"RB-{obj.runbook_id:03d}",
                filename=obj.filename,
                contentType=obj.content_type,
                chunkCount=obj.chunk_count,
                status=obj.status,
                createdAt=obj.created_at
            )
        return super().model_validate(obj, *args, **kwargs)

class KnowledgeDocumentListResponse(BaseModel):
    data: List[KnowledgeDocument]
