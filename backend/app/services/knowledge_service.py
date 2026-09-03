import os
import json
import re
from pathlib import Path
from typing import Optional, List, Dict
from fastapi import UploadFile
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from repositories.knowledge_repository import KnowledgeRepository
from repositories.embedding_repository import EmbeddingRepository
from repositories.runbook_repository import RunbookRepository
from models.knowledge import KnowledgeDocument, KnowledgeDocumentDB
from models.runbook import Runbook
from pydantic import BaseModel

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_EXTENSIONS = {".pdf", ".md", ".txt"}

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

class UploadResponse(BaseModel):
    runbook: Runbook
    document: KnowledgeDocument
    chunksProcessed: int

class KnowledgeService:
    def __init__(
        self,
        runbook_repo: RunbookRepository,
        knowledge_repo: KnowledgeRepository,
        embedding_repo: EmbeddingRepository
    ):
        self.runbook_repo = runbook_repo
        self.knowledge_repo = knowledge_repo
        self.embedding_repo = embedding_repo

    async def ingest_document(
        self,
        file: UploadFile,
        title: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> UploadResponse:
        # 1. Sanitize filename and validate extension
        if not file.filename:
            raise ValueError("No filename provided.")

        raw_filename = Path(file.filename).name
        clean_filename = re.sub(r"[^a-zA-Z0-9_.-]", "_", raw_filename)
        if not clean_filename or clean_filename.startswith("."):
            clean_filename = f"doc_{clean_filename}"

        ext = Path(clean_filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise ValueError(f"Unsupported file type '{ext}'. Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}")

        # 2. Read file bytes with maximum size check (DoS prevention)
        content_bytes = await file.read(MAX_FILE_SIZE + 1)
        if len(content_bytes) > MAX_FILE_SIZE:
            raise ValueError("File exceeds maximum allowed size of 10MB.")

        filename = clean_filename
        
        content_type = "application/octet-stream"
        if ext == ".pdf":
            content_type = "application/pdf"
        elif ext == ".md":
            content_type = "text/markdown"
        elif ext == ".txt":
            content_type = "text/plain"
            
        # 2. Extract text
        raw_text = ""
        if content_type == "application/pdf":
            if not PdfReader:
                raise ValueError("pypdf is not installed. Cannot process PDF files.")
            import io
            reader = PdfReader(io.BytesIO(content_bytes))
            for page in reader.pages:
                raw_text += page.extract_text() + "\n"
        else:
            raw_text = content_bytes.decode("utf-8", errors="ignore")
            
        # 3. Auto-generate runbook
        runbook_title = title if title else filename.rsplit(".", 1)[0].replace("_", " ").title()
        tags_json = json.dumps(tags) if tags else json.dumps(["Knowledge Base", content_type.split("/")[-1]])
        
        # Simple description generation
        description = raw_text[:200] + "..." if len(raw_text) > 200 else raw_text
        
        db_runbook = self.runbook_repo.create(
            title=runbook_title,
            author="System",
            tags_json=tags_json,
            status="Active",
            description=description,
            source_filename=filename
        )
        
        # 4. Split text into chunks
        chunks = []
        if content_type == "text/markdown":
            headers_to_split_on = [
                ("#", "H1"),
                ("##", "H2"),
                ("###", "H3"),
            ]
            markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
            docs = markdown_splitter.split_text(raw_text)
            chunks = [doc.page_content for doc in docs]
        else:
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=300)
            chunks = text_splitter.split_text(raw_text)
            
        # 5. Create KnowledgeDocumentDB record
        db_doc = self.knowledge_repo.create(
            runbook_id=db_runbook.id,
            filename=filename,
            content_type=content_type,
            raw_text=raw_text
        )
        
        # 6. Embed & upsert
        metadatas = [{"source": f"DOC-{db_doc.id:03d}", "runbook": f"RB-{db_runbook.id:03d}"} for _ in chunks]
        ids = [f"DOC-{db_doc.id:03d}_chunk_{i}" for i in range(len(chunks))]
        
        chunk_count = self.embedding_repo.upsert_chunks(chunks, metadatas, ids)
        
        # 7. Update status
        db_doc = self.knowledge_repo.update_status(db_doc.id, "ready", chunk_count)
        
        # 8. Save file safely within upload directory
        base_upload_dir = Path("uploads").resolve()
        upload_dir = (base_upload_dir / str(db_runbook.id)).resolve()
        upload_dir.mkdir(parents=True, exist_ok=True)
        target_path = (upload_dir / filename).resolve()

        if not str(target_path).startswith(str(upload_dir)):
            raise ValueError("Invalid target filepath.")

        with open(target_path, "wb") as f:
            f.write(content_bytes)
            
        # 9. Return Response
        return UploadResponse(
            runbook=Runbook.model_validate(db_runbook),
            document=KnowledgeDocument.model_validate(db_doc),
            chunksProcessed=chunk_count
        )

    def list_documents(self, runbook_id: int) -> List[KnowledgeDocumentDB]:
        return self.knowledge_repo.get_by_runbook(runbook_id)

    def delete_document(self, doc_id: int) -> None:
        source_id = f"DOC-{doc_id:03d}"
        self.embedding_repo.delete_by_source(source_id)
        self.knowledge_repo.delete(doc_id)

    def search_knowledge(self, query: str, n_results: int = 5) -> List[Dict]:
        results = self.embedding_repo.query(query, n_results)
        
        # Format the ChromaDB output
        formatted_results = []
        if results and results.get("ids") and results["ids"][0]:
            for i in range(len(results["ids"][0])):
                formatted_results.append({
                    "id": results["ids"][0][i],
                    "document": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i]
                })
        return formatted_results
