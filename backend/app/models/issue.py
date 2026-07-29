from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime
import json

# --- SQLAlchemy DB Models ---

class IssueDB(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, nullable=False, index=True)
    priority = Column(String, nullable=False)
    assignee = Column(String, nullable=True, index=True)
    requester = Column(String, nullable=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    activity_events = relationship("ActivityEventDB", back_populates="issue", cascade="all, delete-orphan", order_by="ActivityEventDB.timestamp")


class ActivityEventDB(Base):
    __tablename__ = "activity_events"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"), nullable=False, index=True)
    type = Column(String, nullable=False)
    author = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    message = Column(String, nullable=False)
    metadata_json = Column(Text, nullable=True)

    # Relationships
    issue = relationship("IssueDB", back_populates="activity_events")


# --- Pydantic Models ---

class ActivityEvent(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    type: str
    author: str
    timestamp: datetime
    message: str
    metadata: Optional[dict] = None

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        # Override to handle id prefixing and metadata_json parsing
        if isinstance(obj, ActivityEventDB):
            meta = None
            if obj.metadata_json:
                try:
                    meta = json.loads(obj.metadata_json)
                except json.JSONDecodeError:
                    pass
            
            return cls(
                id=f"evt-{obj.id:03d}",
                type=obj.type,
                author=obj.author,
                timestamp=obj.timestamp,
                message=obj.message,
                metadata=meta
            )
        return super().model_validate(obj, *args, **kwargs)


class Issue(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    title: str
    status: str
    priority: str
    assignee: Optional[str] = None
    requester: Optional[str] = None
    description: Optional[str] = None
    createdAt: datetime

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        if isinstance(obj, IssueDB):
            return cls(
                id=f"IT-{obj.id}",
                title=obj.title,
                status=obj.status,
                priority=obj.priority,
                assignee=obj.assignee,
                requester=obj.requester,
                description=obj.description,
                createdAt=obj.created_at
            )
        return super().model_validate(obj, *args, **kwargs)


class IssueDetail(Issue):
    activityFeed: List[ActivityEvent] = Field(default_factory=list)

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        if isinstance(obj, IssueDB):
            return cls(
                id=f"IT-{obj.id}",
                title=obj.title,
                status=obj.status,
                priority=obj.priority,
                assignee=obj.assignee,
                requester=obj.requester,
                description=obj.description,
                createdAt=obj.created_at,
                activityFeed=[ActivityEvent.model_validate(event) for event in obj.activity_events]
            )
        return super().model_validate(obj, *args, **kwargs)


class IssueMeta(BaseModel):
    total: int
    limit: int
    offset: int


class IssueListResponse(BaseModel):
    data: List[Issue]
    meta: IssueMeta


class IssueDetailResponse(BaseModel):
    data: IssueDetail


class IssueStatusUpdate(BaseModel):
    status: str

class IssueCreate(BaseModel):
    title: str
    priority: str
    assignee: Optional[str] = None
    requester: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class IssueUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None
    description: Optional[str] = None


class CommentCreate(BaseModel):
    message: str

class BulkIssueUpdate(BaseModel):
    issue_ids: list[str]
    update: IssueUpdate

class BulkUpdateResponse(BaseModel):
    updated: int
    issues: list[Issue]
