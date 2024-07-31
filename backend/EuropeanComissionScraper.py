import requests
from bs4 import BeautifulSoup
import json

# URL of the page to scrape
base_url = "https://environment.ec.europa.eu/news_en?f%5B0%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/343&f%5B1%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/535&f%5B2%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/1158&f%5B3%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2470&f%5B4%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2530&f%5B5%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2947&f%5B6%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/5482&f%5B7%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_98d1408a&f%5B8%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_749f2ce9&f%5B9%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_1138d9d2&f%5B10%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/ANNOUNC_NEWS&f%5B11%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/PRESS_REL&f%5B12%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/STAT"

# Set headers to mimic a browser request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
}

# Initialize the list to store all articles
articles = []

# Number of pages to scrape
num_pages = 3

for page in range(num_pages):
    # If page > 0, add the page parameter to the URL
    if page > 0:
        url = f"{base_url}&page={page}"
    else:
        url = base_url

    # Send a GET request to the URL with headers
    response = requests.get(url, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Select all news items
        news_items = soup.select('#block-ewcms-theme-main-page-content > article > div > div > div.ecl-col-s-12.ecl-col-m-9 > div:nth-child(4) > div > div > div > div > article')

        if news_items:
            for news_item in news_items:
                # Extracting the date
                date = news_item.select_one('ul.ecl-content-block__primary-meta-container > li:nth-child(2) > time').get_text(strip=True)

                # Extracting the title and link
                title_element = news_item.select_one('div.ecl-content-block__title > a')
                title = title_element.get_text(strip=True)
                link = title_element['href']

                # Check if the link is already complete or needs the base URL
                if not link.startswith("https"):
                    link = 'https://environment.ec.europa.eu' + link

                # Extracting the description
                description = news_item.select_one('div.ecl-content-block__description > p').get_text(strip=True)

                # Append the extracted data to the articles list
                articles.append({
                    "title": title,
                    "summary": description,
                    "date": date,
                    "source": "European Commission",
                    "link": link
                })
        else:
            print(f"No news items found on page {page + 1}.")
    else:
        print(f"Failed to retrieve the webpage for page {page + 1}. Status code: {response.status_code}")

# Output the list of articles
# print(articles[-1])

with open('results.json', 'w') as json_file:
    json.dump(articles, json_file, indent=4)
