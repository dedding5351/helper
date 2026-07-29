from typing import List, Optional
from sqlalchemy.orm import Session
from models.item import Item, ItemDB
import uuid

class ItemRepository:
    """
    Data Access Layer for Items.
    Handles direct interaction with the database.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Item]:
        db_items = self.db.query(ItemDB).all()
        return [Item.model_validate(item) for item in db_items]

    def get_by_id(self, item_id: str) -> Optional[Item]:
        db_item = self.db.query(ItemDB).filter(ItemDB.id == item_id).first()
        if db_item:
            return Item.model_validate(db_item)
        return None

    def create(self, item_data: dict) -> Item:
        item_id = str(uuid.uuid4())
        db_item = ItemDB(id=item_id, **item_data)
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return Item.model_validate(db_item)
