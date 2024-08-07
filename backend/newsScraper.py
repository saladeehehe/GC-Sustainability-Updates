import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

# Load configuration from config.json
with open('backend/config_news.json') as config_file:
    config = json.load(config_file)

def getNewsData():
    headers = config['headers']
    search_query = config['search_query']
    url = f"{config['url']}?q={search_query}&gl=sg&tbm=nws&num=50"
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    
    articles = []
    
    date_formats = config['date_formats']
    
    for each in soup.select(config['selectors']['article_container']):
        title = each.select_one(config['selectors']['title']).get_text()
        summary = each.select_one(config['selectors']['summary']).get_text()
        date = each.select_one(config['selectors']['date']).get_text()
        source = each.select_one(config['selectors']['source']).get_text()
        link = each.find(config['selectors']['link'])["href"]

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
