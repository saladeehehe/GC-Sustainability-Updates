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
