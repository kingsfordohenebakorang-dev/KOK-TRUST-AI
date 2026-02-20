
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def fetch_actuarial_papers():
    # C162118730 is the OpenAlex Concept ID for Actuarial Science (verified via API)
    # We sort by cited_by_count to find "high-impact" papers
    url = "https://api.openalex.org/works"
    params = {
        "filter": "concepts.id:C162118730",
        "sort": "cited_by_count:desc",
        "per_page": 5
    }

    
    api_key = os.getenv("OPENALEX_API_KEY")
    if api_key:
        params["api_key"] = api_key

    print(f"Fetching high-impact Actuarial Science papers from OpenAlex...")
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        print(f"Found {data['meta']['count']} total works. Showing top 5:\n")

        for work in data['results']:
            title = work.get('title')
            year = work.get('publication_year')
            citations = work.get('cited_by_count')
            landing_page = work.get('landing_page_url')
            
            print(f"Title: {title}")
            print(f"Year: {year}")
            print(f"Citations: {citations}")
            print(f"URL: {landing_page}")
            print("-" * 40)

    except Exception as e:
        print(f"Error fetching data: {e}")

if __name__ == "__main__":
    fetch_actuarial_papers()
