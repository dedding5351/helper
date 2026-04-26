import sys
import os
import json
from dotenv import load_dotenv

# Add the current directory to path so we can import app
sys.path.append(os.getcwd())

from app.core.dependencies import get_chroma_client, get_genai_client, get_embedding_repository

def main():
    # Initialize clients and repo
    chroma_client = get_chroma_client()
    genai_client = get_genai_client()
    embedding_repo = get_embedding_repository(chroma_client, genai_client)

    print("\n" + "="*60)
    print("🧠 KNOWLEDGE BASE INTERACTIVE SEARCH")
    print("Type your query to search the KB. Type 'q' or 'exit' to quit.")
    print("="*60)

    try:
        while True:
            query = input("\n🔍 Search: ").strip()
            
            if not query:
                continue
            if query.lower() in ('q', 'exit', 'quit'):
                print("\nGoodbye! 👋\n")
                break

            print("-" * 60)
            try:
                results = embedding_repo.query(query, n_results=5)
                
                if not results or not results.get("ids") or not results["ids"][0]:
                    print("No results found.")
                    continue

                for i in range(len(results["ids"][0])):
                    doc_id = results["ids"][0][i]
                    content = results["documents"][0][i]
                    metadata = results["metadatas"][0][i]
                    distance = results["distances"][0][i]
                    
                    # Color coding for distance/relevance would be nice but keeping it simple
                    print(f"\n[Result {i+1}] (Distance: {distance:.4f})")
                    print(f"Source: {metadata.get('source', 'Unknown')} | Runbook: {metadata.get('runbook', 'Unknown')}")
                    print(f"Content: {content[:300]}...")
                    print("-" * 40)

            except Exception as e:
                print(f"❌ Error during search: {str(e)}")
                
    except KeyboardInterrupt:
        print("\n\nGoodbye! 👋\n")

if __name__ == "__main__":
    main()
