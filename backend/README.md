# Folder Documentation for `backend/`
This folder contains python scripts used for web scraping of various sources, which include: 
- `EuropeanComissionScraper.py`: web scraper for [European Comission](https://environment.ec.europa.eu/news_en?f%5B0%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/343&f%5B1%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/535&f%5B2%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/1158&f%5B3%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2470&f%5B4%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2530&f%5B5%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/2947&f%5B6%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/5482&f%5B7%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_98d1408a&f%5B8%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_749f2ce9&f%5B9%5D=oe_news_subject%3Ahttp%3A//data.europa.eu/uxp/c_1138d9d2&f%5B10%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/ANNOUNC_NEWS&f%5B11%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/PRESS_REL&f%5B12%5D=oe_news_types%3Ahttp%3A//publications.europa.eu/resource/authority/resource-type/STAT) website 
- `MSEscraper.py`: web scraper for [Ministry of Sustainability and Environment (Singapore)](https://www.mse.gov.sg/news/--press-releases/)
- `SDGscraper.py`: web scraper for [UN SDGs](https://sdgs.un.org/news?page=%2C%2) website
- `newsScraper.py`: web scraper for Google News
  - Search query: latest sustainability regulations Singapore
  - *To change the search, modify the `search_query` variable in `newsScraper.py`*
- requirements.txt (for installing of dependencies)

## Configuration Files

Each scraper script has an associated `config_{scraper}.json` file. These configuration files store the HTML selectors used to identify elements on each site. If the website's structure changes, you can easily update the selectors in the configuration file rather than searching through the .py scraper scripts to make adjustments.


## Requirements 
Make sure to install the required dependencies listed in `requirements.txt` before running the scripts 
```sh
pip install -r requirements.txt
```

## To Note 
`aggregate_scrapers.py` in the root directory iterates over all Python scripts in this directory 
### `aggregate_scrapers.py`
- Executes each script, assuming each outputs its results to a file named `results.json`.
- Reads the results from `results.json` and aggregates them into a single list (`all_articles`).
- Writes the aggregated results to `news_data.json` in the specified location (`GC-Sustainability-Updates/public/`).
