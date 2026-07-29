from fastapi import APIRouter, Depends, UploadFile, File, Form, Query, HTTPException
from typing import Optional, List
from services.knowledge_service import KnowledgeService, UploadResponse
from models.knowledge import KnowledgeDocumentListResponse, KnowledgeDocument
from core.dependencies import get_knowledge_service

router = APIRouter(tags=["knowledge"])

@router.post("/upload", response_model=UploadResponse, status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    service: KnowledgeService = Depends(get_knowledge_service)
):
    """Upload a document. Auto-creates a runbook and digests content into ChromaDB."""
    try:
        tag_list = [t.strip() for t in tags.split(",")] if tags else None
        return await service.ingest_document(file=file, title=title, tags=tag_list)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{runbook_id}/documents", response_model=KnowledgeDocumentListResponse)
def list_documents(runbook_id: str, service: KnowledgeService = Depends(get_knowledge_service)):
    """List all documents attached to a runbook."""
    internal_id = int(runbook_id.replace("RB-", ""))
    docs = service.list_documents(internal_id)
    return KnowledgeDocumentListResponse(
        data=[KnowledgeDocument.model_validate(doc) for doc in docs]
    )

@router.delete("/{runbook_id}/documents/{doc_id}", status_code=204)
def delete_document(runbook_id: str, doc_id: str, service: KnowledgeService = Depends(get_knowledge_service)):
    """Remove a document and its embeddings from both SQLite and ChromaDB."""
    internal_doc_id = int(doc_id.replace("DOC-", ""))
    service.delete_document(internal_doc_id)

@router.get("/search")
def search_knowledge(q: str = Query(...), service: KnowledgeService = Depends(get_knowledge_service)):
    """Search the knowledge base across all runbooks."""
    return service.search_knowledge(q)
