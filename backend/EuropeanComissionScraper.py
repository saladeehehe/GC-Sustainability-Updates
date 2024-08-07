import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

# Load configuration from the config_EuropeanCommission.json file
with open('backend/config_EuropeanCommission.json', 'r') as config_file:
    config = json.load(config_file)

base_url = config['base_url']
headers = config['headers']
num_pages = config['num_pages']
output_file = config['output_file']
selectors = config['selectors']

# Initialize the list to store all articles
articles = []

def format_date(date_str):
    try:
        # Parse the date string
        date_obj = datetime.strptime(date_str, '%d %B %Y')
        # Format the date to have the month as a 3-letter abbreviation
        formatted_date = date_obj.strftime('%d %b %Y')
        return formatted_date
    except ValueError:
        # Handle cases where the date format does not match the expected format
        return date_str

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
        news_items = soup.select(selectors['news_items'])

        if news_items:
            for news_item in news_items:
                # Extracting the date
                date = news_item.select_one(selectors['date']).get_text(strip=True)
                formatted_date = format_date(date)

                # Extracting the title and link
                title_element = news_item.select_one(selectors['title'])
                title = title_element.get_text(strip=True)
                link = title_element['href']

                # Check if the link is already complete or needs the base URL
                if not link.startswith("https"):
                    link = 'https://environment.ec.europa.eu' + link

                # Extracting the description
                description = news_item.select_one(selectors['description']).get_text(strip=True)

                # Append the extracted data to the articles list
                articles.append({
                    "title": title,
                    "summary": description,
                    "date": formatted_date,
                    "source": "European Commission",
                    "link": link
                })
        else:
            print(f"No news items found on page {page + 1}.")
    else:
        print(f"Failed to retrieve the webpage for page {page + 1}. Status code: {response.status_code}")

# Output the list of articles
with open(output_file, 'w') as json_file:
    json.dump(articles, json_file, indent=4)
