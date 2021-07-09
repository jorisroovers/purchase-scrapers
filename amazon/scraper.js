// Import the playwright library into our scraper.
const playwright = require('playwright');
const fs = require('fs');

async function main() {

    const userDataDir =  fs.realpathSync(process.env.SCRAPER_DATA_DIR);
    console.log("USER DATA DIR", userDataDir);

    const browser = await playwright.chromium.launchPersistentContext(userDataDir, { headless: false });

    const page = await browser.newPage();
    await page.goto('https://www.amazon.de/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&orderFilter=year-2021');

}

main();