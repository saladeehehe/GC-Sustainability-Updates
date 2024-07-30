import json
import os

all_articles = []

for script in os.listdir('backend'):
    if script.endswith('.py'):
        # Assuming each scraper script saves its results in 'results.json'
        os.system(f'python backend/{script}')
        with open('results.json', 'r') as f:
            articles = json.load(f)
            all_articles.extend(articles)

with open('vite-vanilla-extract-template/public/news_data.json', 'w') as json_file:
    json.dump(all_articles, json_file, indent=4)
