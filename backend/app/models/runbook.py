from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base
import json

# --- SQLAlchemy DB Models ---

class RunbookDB(Base):
    __tablename__ = "runbooks"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    tags_json = Column(Text, nullable=True) # Stores JSON list of tags
    status = Column(String, nullable=False, index=True)


# --- Pydantic Models ---

class Runbook(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    author: str
    tags: List[str] = []
    status: str

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        if isinstance(obj, RunbookDB):
            tags = []
            if obj.tags_json:
                try:
                    tags = json.loads(obj.tags_json)
                except json.JSONDecodeError:
                    pass
            
            return cls(
                id=f"RB-{obj.id:03d}",
                title=obj.title,
                author=obj.author,
                tags=tags,
                status=obj.status
            )
        return super().model_validate(obj, *args, **kwargs)


class RunbookListResponse(BaseModel):
    data: List[Runbook]
