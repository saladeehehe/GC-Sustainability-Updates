# Scrape and Deploy Workflow

This GitHub Actions workflow automates the process of scraping data, updating the repository, and deploying the website to GitHub Pages. It is designed to run daily at 10:00 AM UTC, but it can also be triggered manually.

## Workflow Overview

1. **Scrape Data**: The workflow runs a Python script to aggregate scraped data.
2. **Update Repository**: Commits and pushes the updated data to the `main` branch.
3. **Deploy to GitHub Pages**: Builds the project and deploys it to GitHub Pages.

## Workflow Schedule

- **Schedule**: Runs every day at 10:00 AM UTC.
- **Manual Trigger**: Can be triggered manually via the GitHub Actions interface.

## Workflow Permissions

- **Contents**: Write permissions to update the repository.

## Jobs

### `run-scrapers`

#### Steps

1. **Checkout Main Branch**
   - Uses `actions/checkout@v3` to check out the `main` branch of the repository.

2. **Set Up Python**
   - Uses `actions/setup-python@v4` to set up Python 3.11.

3. **Install Python Dependencies**
   - Upgrades `pip` and installs dependencies from `backend/requirements.txt`.

4. **Run Aggregator Script**
   - Executes the `aggregate_scrapers.py` script to scrape and aggregate data.

5. **Commit and Push Changes to Main Branch**
   - Configures Git, commits changes to `public/news_data2.json`, and pushes to the `main` branch.

6. **Checkout Deployment Branch**
   - Checks out the `Deployment` branch.

7. **Overwrite `news_data2.json` from Main Branch**
   - Fetches the latest version of `public/news_data2.json` from the `main` branch and checks it out to the `Deployment` branch.

8. **Commit and Push Changes to Deployment Branch**
   - Configures Git, commits changes to `public/news_data2.json` in the `Deployment` branch, and pushes to the `Deployment` branch.

9. **Set Up Node.js**
   - Uses `actions/setup-node@v3` to set up the Node.js environment with the latest LTS version.

10. **Install Dependencies**
    - Runs `yarn install` to install project dependencies.

11. **Build Project**
    - Runs `yarn build` to build the project.

12. **Configure Git**
    - Configures Git user details for the GitHub Actions bot.

13. **Deploy to GitHub Pages**
    - Installs `gh-pages`, configures the Git remote URL with a personal access token (PAT), and deploys the project using `yarn deploy`.

## Secrets

- **`GH_TOKEN`**: Personal Access Token (PAT) for deploying to GitHub Pages. Set in the repository secrets.

## Usage

To manually trigger this workflow:
1. Go to the **Actions** tab of your repository.
2. Select the **Scrape and Deploy** workflow.
3. Click on the **Run workflow** button.

