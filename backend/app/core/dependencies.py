from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.repositories.item_repository import ItemRepository
from app.services.item_service import ItemService

def get_db_connection() -> Generator[Session, None, None]:
    """
    Yields a database connection.
    In a real app, this would be a SQLAlchemy session, ChromaDB client, etc.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_item_repository(db: Session = Depends(get_db_connection)) -> ItemRepository:
    """
    Injects the database connection into the ItemRepository.
    """
    return ItemRepository(db=db)

def get_item_service(repository: ItemRepository = Depends(get_item_repository)) -> ItemService:
    """
    Injects the ItemRepository into the ItemService.
    """
    return ItemService(repository=repository)
