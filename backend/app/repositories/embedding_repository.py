import chromadb
from google import genai
from google.genai.types import EmbedContentConfig

class EmbeddingRepository:
    """
    Abstracts the vector database (ChromaDB) and embedding logic (Gemini).
    The rest of the app never imports chromadb or google.genai directly.
    """
    COLLECTION_NAME = "knowledge_base"
    EMBEDDING_MODEL = "gemini-embedding-001"
    EMBEDDING_DIMS = 3072

    def __init__(self, chroma_client: chromadb.ClientAPI, genai_client: genai.Client):
        # Using cosine similarity for better text matching with Gemini embeddings
        self.collection = chroma_client.get_or_create_collection(
            name=self.COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        self.genai_client = genai_client

    def upsert_chunks(self, chunks: list[str], metadatas: list[dict], ids: list[str]) -> int:
        """Embed via Gemini and upsert into ChromaDB. Returns chunk count."""
        if not chunks:
            return 0
            
        embeddings = self._embed(chunks, task_type="RETRIEVAL_DOCUMENT")
        self.collection.upsert(
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        return len(chunks)

    def query(self, query_text: str, n_results: int = 5) -> list[dict]:
        """Embed query and return top-N results from ChromaDB."""
        query_embedding = self._embed([query_text], task_type="RETRIEVAL_QUERY")[0]
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        return results

    def delete_by_source(self, source_id: str) -> None:
        """Remove all chunks for a given document source."""
        self.collection.delete(where={"source": source_id})

    def _embed(self, texts: list[str], task_type: str) -> list[list[float]]:
        response = self.genai_client.models.embed_content(
            model=self.EMBEDDING_MODEL,
            contents=texts,
            config=EmbedContentConfig(
                task_type=task_type,
                output_dimensionality=self.EMBEDDING_DIMS
            ),
        )
        return [emb.values for emb in response.embeddings]
