from pydantic import BaseModel, Field
from typing import Optional

class Item(BaseModel):
    id: str
    name: str = Field(..., description="The name of the item")
    description: Optional[str] = Field(None, description="Detailed description of the item")
    price: float

class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
