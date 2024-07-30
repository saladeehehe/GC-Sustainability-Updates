<<<<<<< HEAD
# Mantine + Vite + Vanilla extract template

Get started with the template by clicking `Use this template` button on the top of the page.

[Documentation](https://mantine.dev/styles/vanilla-extract/)
=======
# GCInternsII
>>>>>>> origin/main


`aggregate_scrapers.py` iterates over all Python scripts in the `backend` directory. 
It executes each script, assuming each script outputs its results to a file named results.json.
It reads the results from results.json and aggregates them into a single list (all_articles).
Finally, it writes the aggregated results to news_data.json in the specified location (vite-vanilla-extract-template/public/).
This approach allows you to run multiple scraper scripts, collect their outputs, and store the combined results in a single JSON file.
