import json
import os
from datetime import datetime

all_articles = []

# Function to convert date string to datetime object for comparison
def parse_date(date_str):
    # Adjust the format string to match your date format
    return datetime.strptime(date_str, "%d-%m-%Y")

# Run each scraper script and collect articles
for script in os.listdir('backend'):
    if script.endswith('.py'):
        # Assuming each scraper script saves its results in 'results.json'
        os.system(f'python backend/{script}')
        with open('results.json', 'r') as f:
            articles = json.load(f)
            all_articles.extend(articles)

# Dictionary to store the latest articles by title
latest_articles = {}

for article in all_articles:
    title = article['title']
    date = parse_date(article['date'])

    # If the title is not in the dictionary or the current article is more recent, update the dictionary
    if title not in latest_articles or date > parse_date(latest_articles[title]['date']):
        latest_articles[title] = article

# Convert the dictionary back to a list of articles
unique_articles = list(latest_articles.values())

# Save the unique articles to the JSON file
with open('public/news_data2.json', 'w') as json_file:
    json.dump(unique_articles, json_file, indent=4)
