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

from app.repositories.knowledge_repository import KnowledgeRepository
from app.repositories.embedding_repository import EmbeddingRepository
from app.services.knowledge_service import KnowledgeService

import chromadb
from google import genai
import os
from dotenv import load_dotenv

load_dotenv(".env.local")

# Singleton clients
_chroma_client = chromadb.PersistentClient(path="./chroma_db")
_genai_client = genai.Client()

def get_chroma_client() -> chromadb.ClientAPI:
    return _chroma_client

def get_genai_client() -> genai.Client:
    return _genai_client

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

# --- Knowledge & Embeddings ---
def get_embedding_repository(
    chroma: chromadb.ClientAPI = Depends(get_chroma_client),
    genai_client: genai.Client = Depends(get_genai_client)
) -> EmbeddingRepository:
    return EmbeddingRepository(chroma_client=chroma, genai_client=genai_client)

def get_knowledge_repository(db: Session = Depends(get_db_connection)) -> KnowledgeRepository:
    return KnowledgeRepository(db=db)

def get_knowledge_service(
    runbook_repo: RunbookRepository = Depends(get_runbook_repository),
    knowledge_repo: KnowledgeRepository = Depends(get_knowledge_repository),
    embedding_repo: EmbeddingRepository = Depends(get_embedding_repository)
) -> KnowledgeService:
    return KnowledgeService(runbook_repo=runbook_repo, knowledge_repo=knowledge_repo, embedding_repo=embedding_repo)
