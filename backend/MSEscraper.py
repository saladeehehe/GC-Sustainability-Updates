import requests
from bs4 import BeautifulSoup
import numpy as np
import json

# Load configuration from config.json
with open('backend/config_MSE.json') as config_file:
    config = json.load(config_file)

# URL of the website to scrape
url = config['url']

# Send a GET request to the website
response = requests.get(url)

press_release_links = np.array([])

# Initialize the articles list
articles = []

def get_pdf_details(href):
    link = 'https://www.mse.gov.sg' + href
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find the section containing the PDF link
    link_element = soup.find('a', href=href)
    if link_element:
        # Extract the h5 and small elements
        h5_element = link_element.select_one(config['selectors']['pdf_title'])
        small_elements = link_element.select(config['selectors']['pdf_date'])
        
        if h5_element and small_elements:
            h5_text = h5_element.get_text(strip=True)
            date = small_elements[1].get_text(strip=True)
            date = ' '.join([word.title() if word.isupper() else word for word in date.split()])
            
            # Combine the extracted details
            articles.append({
                'title': h5_text,
                'summary': 'This is a PDF',
                'date': date,
                "source": config['source_name'],
                "link": link
            })
            
        else:
            print('h5 or small elements not found')
    else:
        print('Link element not found')

# get the links to the press release news
def get_press_release_links():
    global press_release_links
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Use the specified selector to find the target element
    target_element = soup.select(config['selectors']['press_release_links_container'])
    
    # Extract all the 'a' tags within the target element
    a_tags = target_element[0].find_all(config['selectors']['press_release_link_tag']) if target_element else []
    
    # Get all the href attributes
    hrefs = [a['href'] for a in a_tags]
    
    for href in hrefs:
        if href.endswith('.pdf'):
            # links to a pdf instead of webpage so need to dealt with by another function
            get_pdf_details(href)
        else:
            press_release_links = np.append(press_release_links, 'https://www.mse.gov.sg' + href)

get_press_release_links()

# Function to fetch and parse details from each press release link
def get_press_release_details(link):
    try:
        response = requests.get(link)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        # print(f"Error fetching {link}: {e}")
        return
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract the title
        title_tag = soup.select_one(config['selectors']['press_release_title'])
        title = title_tag.text if title_tag else "N/A"

        # Extract the summary
        summary_tag = soup.select_one(config['selectors']['press_release_summary'])
        summary = summary_tag.text if summary_tag else "N/A"
        
        # Extract the date
        date_tag = soup.select_one(config['selectors']['press_release_date'])
        date = date_tag.text if date_tag else "N/A"
        # Convert the month to title case
        date = ' '.join([word.title() if word.isupper() else word for word in date.split()])
        
        source = config['source_name']

        articles.append({
            "title": title,
            "summary": summary,
            "date": date,
            "source": source,
            "link": link
        })

# Loop through each press release link and get details
for link in press_release_links:
    # Check if the link ends with .pdf
    get_press_release_details(link)

with open('results.json', 'w') as json_file:
    json.dump(articles, json_file, indent=4)
