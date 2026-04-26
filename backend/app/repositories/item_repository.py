from typing import List, Optional
from app.models.item import Item
import uuid

class ItemRepository:
    """
    Data Access Layer for Items.
    Handles direct interaction with the database.
    """
    def __init__(self, db):
        self.db = db

    def get_all(self) -> List[Item]:
        return list(self.db.data.values())

    def get_by_id(self, item_id: str) -> Optional[Item]:
        return self.db.data.get(item_id)

    def create(self, item_data: dict) -> Item:
        item_id = str(uuid.uuid4())
        new_item = Item(id=item_id, **item_data)
        self.db.data[item_id] = new_item
        return new_item
