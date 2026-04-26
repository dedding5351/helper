import os
import glob
from dotenv import load_dotenv
from langchain_text_splitters import MarkdownHeaderTextSplitter
from google import genai
from google.genai.types import EmbedContentConfig
import chromadb

def main():
    # Load environment variables from .env file
    # NOTE: You MUST have GEMINI_API_KEY set in your .env file for genai.Client() to work!
    load_dotenv()
    
    # Initialize Clients
    print("Initializing Google GenAI and Chroma clients...")
    genai_client = genai.Client()
    chroma_client = chromadb.Client()
    collection_name = "knowledge_base"
    collection = chroma_client.get_or_create_collection(name=collection_name)

    # Prepare markdown splitter
    headers_to_split_on = [
        ("#", "H1"),
        ("##", "H2"),
        ("###", "H3"),
    ]
    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)

    # Locate markdown files
    script_dir = os.path.dirname(os.path.abspath(__file__))
    solutions_dir = os.path.join(script_dir, 'solutions')
    md_files = glob.glob(os.path.join(solutions_dir, '*.md'))

    print(f"Found {len(md_files)} markdown files in {solutions_dir}")

    # Process each file
    all_docs = []
    for file_path in md_files:
        filename = os.path.basename(file_path)
        with open(file_path, 'r') as f:
            markdown_text = f.read()

        docs = markdown_splitter.split_text(markdown_text)
        # Add filename source to metadata
        for doc in docs:
            doc.metadata['source'] = filename
        all_docs.extend(docs)

    print(f"Generated {len(all_docs)} chunks from all files.")

    if not all_docs:
        print("No documents found. Exiting.")
        return

    # Prepare data for Chroma and Gemini
    contents_to_embed = [doc.page_content for doc in all_docs]
    ids = [f"chunk_{i}" for i in range(len(all_docs))]
    metadatas = [doc.metadata for doc in all_docs]

    print("Generating embeddings via Google GenAI...")
    # Generate embeddings
    response = genai_client.models.embed_content(
        model="gemini-embedding-001",
        contents=contents_to_embed,
        config=EmbedContentConfig(
            task_type="RETRIEVAL_DOCUMENT",
            output_dimensionality=3072,
        ),
    )
    
    embeddings = [emb.values for emb in response.embeddings]

    print("Ingesting data into Chroma collection...")
    # Upsert into Chroma
    collection.upsert(
        documents=contents_to_embed,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

    # Query the collection as a test
    query_text = "How do I fix my wifi?"
    print(f"\nTest Query: '{query_text}'")

    # Embed the query
    query_response = genai_client.models.embed_content(
        model="gemini-embedding-001",
        contents=[query_text],
        config=EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=3072,
        ),
    )
    query_embedding = query_response.embeddings[0].values

    # Query Chroma using the query embedding
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=2
    )

    print("\nResults:")
    for i in range(len(results['ids'][0])):
        print(f" - ID: {results['ids'][0][i]}")
        print(f"   Distance: {results['distances'][0][i]}")
        print(f"   Source: {results['metadatas'][0][i].get('source', 'Unknown')}")
        print(f"   Preview: {results['documents'][0][i][:150]}...\n")

if __name__ == "__main__":
    main()
