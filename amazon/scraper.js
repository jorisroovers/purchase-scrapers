const playwright = require('playwright');
const fs = require('fs');

// https://stackoverflow.com/a/7228322/381010 
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// https://stackoverflow.com/a/39914235/381010
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

    const userDataDir = fs.realpathSync(process.env.SCRAPER_DATA_DIR);
    let orderId = process.env.ORDER_ID || "ALL";
    const baseURL = "https://www.amazon.de";
    const accountURL = `${baseURL}/gp/your-account`

    console.log("USER DATA DIR", userDataDir);
    console.log("ORDER ID", orderId);


    // -------------

    const browser = await playwright.chromium.launchPersistentContext(userDataDir, { headless: false });

    const page = await browser.newPage();


    let fetchOrderDetails = async function (orderId) {
        // load order details
        await page.goto(`${accountURL}/order-details/ref=ppx_yo_dt_b_order_details_o00?ie=UTF8&orderID=${orderId}`);
        let dateEls = await page.$$(".order-date-invoice-item");
        let date = await dateEls[0].innerText();
        date = date.replace("Ordered on ", "");
        console.log("DATE", date);

        // shipments on page
        const priceElements = await page.$$(".shipment .a-color-price");
        priceElements.forEach(async priceElement => {
            let price = await priceElement.innerText();
            price = price.replace("EUR", "").replace(",", ".").trim();

            let descriptionEl = await priceElement.$('xpath=../..');
            descriptionEl = await descriptionEl.$(".a-row");
            let description = await descriptionEl.innerText();
            console.log(date, description, price);

        });
    }


    if (orderId === "ALL") {
        await page.goto(`${accountURL}/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&orderFilter=year-2021`);

        // find orders on page
        const orderIdElements = await page.$$('.order-info .a-col-right .value');
        orderId = (await orderIdElements[0].innerText()).trim();

        orderIdElements.forEach(async element => {
            const orderId = await element.innerText();
            console.log(orderId);

            let timeoutLength = 1000 + randomIntFromInterval(100, 2000);
            console.log("TIMEOUT LENGTH", timeoutLength);
            await sleep(timeoutLength);
            
            // TODO: fix this, timing out?
            // await fetchOrderDetails(orderId);
        });

    } else {
        await fetchOrderDetails(orderId);
    }

}

main();