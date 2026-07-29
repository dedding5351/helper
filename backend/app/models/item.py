from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from sqlalchemy import Column, String, Float
from core.database import Base

class ItemDB(Base):
    __tablename__ = "items"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    price = Column(Float)

class Item(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str = Field(..., description="The name of the item")
    description: Optional[str] = Field(None, description="Detailed description of the item")
    price: float

class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
