from typing import List, Optional
from repositories.item_repository import ItemRepository
from models.item import Item, ItemCreate

class ItemService:
    """
    Business Logic Layer for Items.
    Coordinates between routes and repositories.
    """
    def __init__(self, repository: ItemRepository):
        self.repository = repository

    def list_items(self) -> List[Item]:
        # Business logic goes here (e.g., filtering, caching)
        return self.repository.get_all()

    def get_item(self, item_id: str) -> Optional[Item]:
        return self.repository.get_by_id(item_id)

    def create_item(self, item_create: ItemCreate) -> Item:
        # Business validation logic
        if item_create.price < 0:
            raise ValueError("Price cannot be negative")
        return self.repository.create(item_create.model_dump())
