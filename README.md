# Sustainability News Web Scraper and Dashboard

## About The Project
Our project aims to simplify the process of staying updated on sustainability-related news and regulatory trends by consolidating information from various sources into a single, convenient platform.

## Benefits of Our Product

### Automated Web Scraping
- Performs automated web scraping to gather the latest sustainability-related news from various sources.
- Ensures up-to-date information is always available.

### Daily Updates
- System updates news once a day.
- Keeps you informed with the most recent developments and trends in sustainability.

### Comprehensive Dashboard
- User-friendly dashboard with multiple functionalities:
  - **Source Filtering**: Filter news based on specific sources.
  - **Date Filtering**: Narrow down news articles by date.
  - **Category Filtering**: Browse news by different categories.
  - **Bookmarking**: Save important news articles for later access.

### Direct Access to News Sites
- Allows users to conveniently visit the original news sites directly from the dashboard.
- Provides a seamless experience from discovery to in-depth reading.

## Code Functionality

### `aggregate_scrapers.py`
- Iterates over all Python scripts in the `backend` directory.
- Executes each script, assuming each outputs its results to a file named `results.json`.
- Reads the results from `results.json` and aggregates them into a single list (`all_articles`).
- Writes the aggregated results to `news_data.json` in the specified location (`vite-vanilla-extract-template/public/`).

This approach allows you to run multiple scraper scripts, collect their outputs, and store the combined results in a single JSON file.
