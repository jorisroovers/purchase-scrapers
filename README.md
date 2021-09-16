# purchase-scrapers
Personal scripts to scrape online webshop order overviews.
# Amazon

This script assumes you're logged into Amazon. On first run, you'll need to login, close the browser and rerun the script.

```sh
export SCRAPER_DATA_DIR="/Users/jroovers/Documents/tmp/playwright-datadir"
mkdir $SCRAPER_DATA_DIR
export ORDER_ID="ALL" # optionally set and order id to just fetch details of a single order
node amazon/scraper.js
```
