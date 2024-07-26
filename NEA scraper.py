from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from bs4 import BeautifulSoup
import time

# Initialize the WebDriver
driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

# URL of the page to scrape
url = "https://www.nea.gov.sg/media/news"

# Open the webpage
driver.get(url)

# Wait for the page to load and the dropdown to be present
wait = WebDriverWait(driver, 10)
dropdown = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 
                                                      '#mainContent_mainContent_TBAF94634002_Col00 > div > div > div.col-xs-12.col-sm-3.col-3 > div > div > div > div:nth-child(3) > select')))

"""
I still cant figure out the filter thingy
"""

# Use JavaScript to set the value of the dropdown
driver.execute_script("arguments[0].value = 'energy-efficiency';", dropdown)  # Change 'energy-efficiency' to the value attribute of the desired option

# Trigger the change event using JavaScript
driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", dropdown)

# Wait for the page to reload or content to update after selecting the filter
time.sleep(5)  # Adjust sleep time as needed





# Use the CSS selector to find the desired elements including the filter and news items
main_content_selector = "#mainContent_mainContent_TBAF94634002_Col00 > div > div"
main_content = driver.find_element(By.CSS_SELECTOR, main_content_selector)

# Get the outer HTML of the main content
outer_html = main_content.get_attribute('outerHTML')

# Parse the outer HTML with BeautifulSoup
soup = BeautifulSoup(outer_html, 'html.parser')

# Use BeautifulSoup to select and parse news items from the main content
news_items = soup.select(".col-xs-12.col-sm-9.col-md-9 > div > div.row.item-list-media > div")

# Debugging: print the number of news items found
print(f"Number of news items found: {len(news_items)}")

# Loop through the news items and print the details
for index, item in enumerate(news_items):
    try:
        # Extract and print the date
        date_tag = item.select_one(".title__text .date")
        date = date_tag.get_text(strip=True) if date_tag else "No date found"
        
        # Extract and print the title
        title_tag = item.select_one(".content .title")
        title = title_tag.get_text(strip=True) if title_tag else "No title found"

        # Extract and print the text
        text_tag = item.select_one(".content p")
        text = text_tag.get_text(strip=True) if text_tag else "No text found"

        print(f"Date: {date}")
        print(f"Title: {title}")
        print(f"Text: {text}")
        print("-" * 80)
    except Exception as e:
        print(f"Error processing item {index}: {e}")

# Close the WebDriver
driver.quit()
