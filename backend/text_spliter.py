from langchain_text_splitters import MarkdownHeaderTextSplitter
import os

if __name__ == "__main__":
    # Get path to markdown file (script's parent directory + 'solutions' + filename)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, 'solutions', 'data_vpn_guide.md')

    with open(file_path, 'r') as f:
        markdown_text = f.read()

    headers_to_split_on = [
        ("#", "H1"),
        ("##", "H2"),
        ("###", "H3"),
    ]

    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
    docs = markdown_splitter.split_text(markdown_text)

    for i, doc in enumerate(docs):
        print(f"--- Document {i+1} ---")
        print(f"Source: {doc.metadata.get('source', 'IT Solutions')}")
        print(f"Content:\n{doc.page_content}\n")