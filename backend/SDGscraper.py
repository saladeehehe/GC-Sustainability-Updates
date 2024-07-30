

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import re

# Function to extract the first 20 words from the main content of a page
def extract_main_content_words(news_url):
    response = requests.get(news_url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract date (assuming it's in a <span> with class 'date-class'; update this selector as needed)
    date_element = soup.find('span', class_='date')  # Adjust this class
    date = date_element.text.strip() if date_element else ''
    
    # Assuming main content is within a <div> with a specific class; update this selector as needed
    main_content = soup.find('div', class_='col-12 col-lg-7 mt-5')  # Adjust this class
    
    if main_content:
        paragraphs = main_content.find_all('p')
        content_text = ' '.join(p.get_text(strip=True) for p in paragraphs)
        
        # Use regex to extract words and punctuation
        words_with_punctuation = re.findall(r'\b\w+\b[,.!?]*', content_text)
        
        return {
            'main_content_words': ' '.join(words_with_punctuation[:20]) + '...',
            'date': date
        }
    return {
        'main_content_words': '',
        'date': date
    }


# Function to scrape data from a single page
def scrape_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all news cards on the page
    cards = soup.find_all('div', class_='card card-custom news-03 col-12 col-sm-6 col-lg-4')
    
    results = []
    for card in cards:
        title = card.find('h4', class_='card-title').text.strip()
        
        # Extract the link
        link_tag = card.find('a', href=True)
        relative_link = link_tag['href'] if link_tag else None
        
        # Construct the full URL
        full_link = urljoin(url, relative_link) if relative_link else None
        
        content_and_date= extract_main_content_words(full_link)
        
        # Find all related goals
        goals = card.select('span.badge.badge-primary')
        related_goals = [goal.text.strip() for goal in goals]
        
        results.append({
            'title': title,
            'date': content_and_date['date'],
            'main_content_words': content_and_date['main_content_words'],
            'link': full_link,
            'related_goals': related_goals
        })
    
    return results

# Base URL for scraping
base_url = "https://sdgs.un.org/news?page=%2C%2C{}"
# Number of pages to scrape
num_pages = 3

all_data = []

# Scrape multiple pages
for page_number in range(num_pages):
    url = base_url.format(page_number)
    new_data = scrape_page(url)
    all_data.extend(new_data)

# Load existing data
with open('vite-vanilla-extract-template/public/news_data.json', 'r') as file:
    existing_data = json.load(file)

# Function to format new data to match the existing format
def format_new_data(new_item):
    formatted_item = {
        "title": new_item['title'],
        "main_content_words": new_item['main_content_words'],
        "date": new_item['date'],
        "source": "UN SDGs",  # Set source to a default value
        "link": new_item['link']
    }
    # Include 'related_goals' only if it exists and is not empty
    if 'related_goals' in new_item and new_item['related_goals']:
        formatted_item['related_goals'] = new_item['related_goals']
    
    return formatted_item

# Convert new data to match existing format
formatted_new_data = [format_new_data(item) for item in all_data]

# Append formatted new data to existing data
existing_data.extend(formatted_new_data)

# Save the updated data back to the file
with open('results.json', 'w') as json_file:
    json.dump(articles, json_file, indent=4)

print("Data updated successfully.")
