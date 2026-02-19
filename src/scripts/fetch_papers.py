
import arxiv
import sys
import json

def search_papers(query, max_results=5):
    """
    Search arXiv for papers matching the query.
    """
    client = arxiv.Client()
    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.Relevance
    )

    results = []
    for result in client.results(search):
        results.append({
            "title": result.title,
            "summary": result.summary,
            "authors": [a.name for a in result.authors],
            "pdf_url": result.pdf_url,
            "published": result.published.strftime("%Y-%m-%d")
        })
    
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fetch_papers.py <query>")
        sys.exit(1)
    
    query = sys.argv[1]
    papers = search_papers(query)
    print(json.dumps(papers, indent=2))
