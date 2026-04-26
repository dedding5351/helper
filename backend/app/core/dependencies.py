from typing import Generator
from fastapi import Depends
from app.repositories.item_repository import ItemRepository
from app.services.item_service import ItemService

# Mock Database Connection
class MockDatabase:
    def __init__(self):
        self.data = {}

# Singleton instance for the mock DB
_mock_db_instance = MockDatabase()

def get_db_connection() -> Generator[MockDatabase, None, None]:
    """
    Yields a database connection.
    In a real app, this would be a SQLAlchemy session, ChromaDB client, etc.
    """
    yield _mock_db_instance

def get_item_repository(db: MockDatabase = Depends(get_db_connection)) -> ItemRepository:
    """
    Injects the database connection into the ItemRepository.
    """
    return ItemRepository(db=db)

def get_item_service(repository: ItemRepository = Depends(get_item_repository)) -> ItemService:
    """
    Injects the ItemRepository into the ItemService.
    """
    return ItemService(repository=repository)
