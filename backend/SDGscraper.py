import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import re

# Load configuration from config.json
with open('backend/config_SDG.json', 'r') as config_file:
    config = json.load(config_file)

# Function to extract the first 20 words from the main content of a page
def extract_main_content_words(news_url):
    response = requests.get(news_url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract date based on configuration
    date_element = soup.find(config['date_element']['tag'], class_=config['date_element']['class'])
    date = date_element.text.strip() if date_element else ''
    
    # Extract main content based on configuration
    main_content = soup.find(config['main_content_element']['tag'], class_=config['main_content_element']['class'])
    
    if main_content:
        paragraphs = main_content.find_all('p')
        content_text = ' '.join(p.get_text(strip=True) for p in paragraphs)
        
        # Use regex to extract words and punctuation
        words_with_punctuation = re.findall(r'\b\w+\b[,.!?]*', content_text)
        
        return {
            'summary': ' '.join(words_with_punctuation[:20]) + '...',
            'date': date
        }
    return {
        'summary': '',
        'date': date
    }


# Function to scrape data from a single page
def scrape_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all news cards on the page based on configuration
    cards = soup.find_all(config['news_card_element']['tag'], class_=config['news_card_element']['class'])
    
    results = []
    for card in cards:
        title = card.find(config['title_element']['tag'], class_=config['title_element']['class']).text.strip()
        
        # Extract the link
        link_tag = card.find(config['link_element']['tag'], href=True)
        relative_link = link_tag['href'] if link_tag else None
        
        # Construct the full URL
        full_link = urljoin(url, relative_link) if relative_link else None
        
        content_and_date = extract_main_content_words(full_link)
        
        # Find all related goals based on configuration
        goals = card.select(f"{config['goal_element']['tag']}.{config['goal_element']['class']}")
        related_goals = [goal.text.strip() for goal in goals]
        
        results.append({
            'title': title,
            'date': content_and_date['date'],
            'summary': content_and_date['summary'],
            'link': full_link,
            'related_goals': related_goals
        })
    
    return results

# Base URL for scraping from config
base_url = config['base_url']
# Number of pages to scrape from config
num_pages = config['num_pages']

all_data = []

# Scrape multiple pages
for page_number in range(num_pages):
    url = base_url.format(page_number)
    new_data = scrape_page(url)
    all_data.extend(new_data)

# Function to format new data to match the existing format
def format_new_data(new_item):
    formatted_item = {
        "title": new_item['title'],
        "summary": new_item['summary'],
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

# Save the updated data back to the file
with open('results.json', 'w') as json_file:
    json.dump(formatted_new_data, json_file, indent=4)

print("Data updated successfully.")
