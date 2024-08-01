'''import requests
from bs4 import BeautifulSoup

# Define the website URL
website_url = 'https://www.mse.gov.sg'

# Fetch the robots.txt file
robots_url = f'{website_url}/robots.txt'
robots_response = requests.get(robots_url)
print("robots.txt content:")
print(robots_response.text)

# Check if the path is disallowed
disallowed_paths = ["/sitecore/"]

def is_allowed(url):
    for path in disallowed_paths:
        if path in url:
            return False
    return True

# Define the URL of the page containing the PDF link
page_url = f'{website_url}/policies/overview/'

# Get the HTML content of the page
page_response = requests.get(page_url)
page_response.status_code
soup = BeautifulSoup(page_response.text, 'html.parser')

# Extract the relevant information from the HTML code
mse_policies = []
main_container = soup.find('main', id="policies-container")
# Assuming each link is within a specific tag, e.g., 'a' tag
cards = main_container.find_all('a')
# Extract URLs or other relevant information
for card in cards:
    link = card.get('href')  # Example: Get the href attribute
    title = card.text.strip()  # Example: Get the text content of the link
    print(title, link)

    full_url = website_url + link
    print(f"Link: {full_url}")

# Example: Scraping content from each link
    response_inner = requests.get(full_url)
    inner_html_content = response_inner.text
    inner_soup = BeautifulSoup(inner_html_content, 'html.parser')
'''
'''
import requests
from bs4 import BeautifulSoup

def getNewsData():
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
    }
  # Modify the URL to search for "latest sustainability regulations Singapore"
    search_query = "latest+sustainability+regulations+singapore"
    url = f"https://www.google.com/search?q={search_query}&gl=sg&tbm=nws&num=50"
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    for each in soup.select("div.SoaBEf"):
        title = each.select_one("div.MBeuO").get_text() + "\r"
        summary = each.select_one(".GI74Re").get_text() + "\r"
        date = each.select_one("div.OSrXXb span").get_text() + "\r" 
        source = each.select_one("div.MgUUmf span").get_text() + "\r" 
        link = each.find("a")["href"] + "\r\n"
        print("Title: " + title +
                "Summary: " + summary +
                "Date: " + date + 
                "Source: " + source +
                "Link: " + link
                )
getNewsData()'''

import requests
from bs4 import BeautifulSoup
import json

from datetime import datetime

def getNewsData():
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
    }
    # Modify the URL to search for "latest sustainability regulations Singapore"
    search_query = "latest+sustainability+regulations+singapore"
    url = f"https://www.google.com/search?q={search_query}&gl=sg&tbm=nws&num=50"
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    
    articles = []
    
    # List of known date formats
    date_formats = [
        '%d %B %Y',  # e.g., 01 January 2024
        '%d %b %Y',  # e.g., 01 Jan 2024
        '%d %B, %Y', # e.g., 01 January, 2024
        '%d %b, %Y', # e.g., 01 Jan, 2024
        '%d %b. %Y', # e.g., 01 Sept. 2024
    ]
    
    for each in soup.select("div.SoaBEf"):
        title = each.select_one("div.MBeuO").get_text()
        summary = each.select_one(".GI74Re").get_text()
        date = each.select_one("div.OSrXXb span").get_text()
        source = each.select_one("div.MgUUmf span").get_text()
        link = each.find("a")["href"]

        # Manually replace "Sept" with "Sep"
        date = date.replace("Sept", "Sep")

        # Attempt to parse the date using known formats
        parsed_date = None
        for fmt in date_formats:
            try:
                parsed_date = datetime.strptime(date, fmt)
                break
            except ValueError:
                continue

        # If parsed successfully, format the date to ensure month is abbreviated to three letters
        if parsed_date:
            date = parsed_date.strftime('%d %b %Y')

        if title != "" and date != "":
            articles.append({
                "title": title,
                "summary": summary,
                "date": date,
                "source": source,
                "link": link
            })

    with open('results.json', 'w') as json_file:
        json.dump(articles, json_file, indent=4)

getNewsData()
