# purchase-scrapers
Personal scripts to scrape online webshop order overviews.
# Amazon

This script will ask you to login on first run. If something goes wrong, just try to close the browser after initial login and rerun the script.

```sh
npm --prefix amazon install
export SCRAPER_DATA_DIR="/Users/jroovers/Documents/tmp/playwright-datadir"
mkdir $SCRAPER_DATA_DIR
export ORDER_ID="ALL" # optionally set an order id to just fetch details of a single order
export ORDER_YEAR="2021" # when setting ORDER_ID=ALL, also set the ORDER_YEAR to fetch orders for

node amazon/scraper.js
```

# Bol

```sh
export SCRAPER_DATA_DIR="/Users/jroovers/Documents/tmp/playwright-datadir"
mkdir $SCRAPER_DATA_DIR
export ORDER_ID="ALL" # optionally set and order id to just fetch details of a single order
node bol/scraper.js
```