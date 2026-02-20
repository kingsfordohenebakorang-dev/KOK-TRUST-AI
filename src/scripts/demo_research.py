
import arxiv

# 1. Search for the latest Actuarial Science papers
search = arxiv.Search(
  query = "actuarial science insurance risk",
  max_results = 5,
  sort_by = arxiv.SortCriterion.Relevance
)

# 2. Extract and display the "Intelligence"
# Note: Using Client.results for valid 2.0+ usage to avoid deprecation warnings if possible,
# but keeping user structure.
client = arxiv.Client()
for result in client.results(search):
    print(f"Title: {result.title}")
    print(f"Summary: {result.summary[:200]}...") # Feed this to OpenAI
    print(f"PDF Link: {result.pdf_url}\n")
