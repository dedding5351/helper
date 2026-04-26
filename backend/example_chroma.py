import chromadb

def main():
    print("Connecting to Chroma in-memory client...")
    # Instantiate the Chroma in-memory Client
    client = chromadb.Client()
    # Create or get a collection
    collection_name = "getting_started_collection"
    collection = client.get_or_create_collection(name=collection_name)

    # Data to add
    documents = [
        "Chroma is an AI-native open-source vector database.",
        "It makes it easy to build LLM apps by making knowledge, facts, and skills pluggable for LLMs.",
        "Python is a popular programming language for AI and machine learning."
    ]
    metadatas = [{"source": "chroma_docs"}, {"source": "chroma_docs"}, {"source": "python_docs"}]
    ids = ["id1", "id2", "id3"]

    print("\nIngesting data into collection '{}'...".format(collection_name))
    for i in range(len(ids)):
        print(f" - ID: {ids[i]} | Source: {metadatas[i]['source']} | Document: '{documents[i]}'")

    # Use upsert to avoid errors if run multiple times
    collection.upsert(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )

    # Query the collection
    query_text = "What is Chroma?"
    print(f"\nQuerying for: '{query_text}'")

    results = collection.query(
        query_texts=[query_text],
        n_results=2
    )

    print("\nResults:")
    for i in range(len(results['ids'][0])):
        print(f" - ID: {results['ids'][0][i]}")
        print(f"   Distance: {results['distances'][0][i]}")
        print(f"   Metadata: {results['metadatas'][0][i]}")
        print(f"   Document: '{results['documents'][0][i]}'")

if __name__ == "__main__":
    main()
