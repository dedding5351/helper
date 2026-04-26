from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.repositories.item_repository import ItemRepository
from app.services.item_service import ItemService
from app.repositories.issue_repository import IssueRepository
from app.services.issue_service import IssueService
from app.repositories.runbook_repository import RunbookRepository
from app.services.runbook_service import RunbookService
from app.repositories.settings_repository import SettingsRepository
from app.services.settings_service import SettingsService

def get_current_user_id() -> str:
    """Stubbed auth — returns hardcoded default user."""
    return "default-user"

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

# --- Issues ---
def get_issue_repository(db: Session = Depends(get_db_connection)) -> IssueRepository:
    return IssueRepository(db=db)

def get_issue_service(repository: IssueRepository = Depends(get_issue_repository)) -> IssueService:
    return IssueService(repository=repository)

# --- Runbooks ---
def get_runbook_repository(db: Session = Depends(get_db_connection)) -> RunbookRepository:
    return RunbookRepository(db=db)

def get_runbook_service(repository: RunbookRepository = Depends(get_runbook_repository)) -> RunbookService:
    return RunbookService(repository=repository)

# --- Settings ---
def get_settings_repository(db: Session = Depends(get_db_connection)) -> SettingsRepository:
    return SettingsRepository(db=db)

def get_settings_service(repository: SettingsRepository = Depends(get_settings_repository)) -> SettingsService:
    return SettingsService(repository=repository)
