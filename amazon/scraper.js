const playwright = require('playwright');
const fs = require('fs');
const readline = require('readline')
const { exit } = require('process');

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
    let orderYear = process.env.ORDER_YEAR || "2022";
    const baseURL = "https://www.amazon.de";
    const accountURL = `${baseURL}/gp/your-account`

    console.log("USER DATA DIR", userDataDir);
    console.log("ORDER ID", orderId);
    console.log("ORDER YEAR", orderYear);

    // -------------

    const browser = await playwright.chromium.launchPersistentContext(userDataDir, { headless: false });

    const page = await browser.newPage();
    await page.goto(baseURL)

    let fetchOrderDetails = async function (orderId) {
        // load order details
        await page.goto(`${accountURL}/order-details/ref=ppx_yo_dt_b_order_details_o00?ie=UTF8&orderID=${orderId}`);
        let dateEls = await page.$$(".order-date-invoice-item");
        let date = await dateEls[0].innerText();
        date = date.replace("Ordered on ", "").trim();
        // console.log("DATE", date);

        // shipments on page
        const priceElements = await page.$$(".shipment .a-color-price");
        priceElements.forEach(async priceElement => {
            let price = await priceElement.innerText();
            price = price.replace("EUR", "").replace(",", ".").trim();

            let descriptionEl = await priceElement.$('xpath=../..');
            descriptionEl = await descriptionEl.$(".a-row");
            let description = await descriptionEl.innerText();
            console.log(date + ";" + description + ";" + price);

        });
    }

    console.log("------------------------------------------------------------------")
    console.log("The first time you run this, you will need to login to amazon")
    console.log("------------------------------------------------------------------")

    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    await new Promise(resolve => readlineInterface.question("You should be logged in at this point, press any key here to continue ", answer => {
        readlineInterface.close();
        resolve(answer);
    }))
    console.log("Ok, moving on...")

    if (orderId === "ALL") {

        // 1. Find all order ids by loading all the order pages and extracting the ids
        let startIndex = 0;
        let endIndex = 1000;
        const orderIds = [];

        while (startIndex <= endIndex) {
            await page.goto(`${accountURL}/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&orderFilter=year-${orderYear}&startIndex=${startIndex}`);

            if (endIndex == 1000) {
                const numOrderEl = await page.$$('.num-orders');
                const numOrders = parseInt((await numOrderEl[0].innerText()).replace(" orders").trim());
                endIndex = Math.floor(numOrders / 10) * 10;
                console.log("NUM ORDERS", numOrders);
                console.log("END INDEX", endIndex);
            }

            // find orders on page
            const orderIdElements = await page.$$('.order-info .a-col-right .value');
            orderId = (await orderIdElements[0].innerText()).trim(); // ensure we can actually read order Ids

            console.log("ORDERS EL LENGTH", orderIdElements.length);
            // Extract ids from orders
            for (const orderEl of orderIdElements) {
                const orderId = await orderEl.innerText();
                orderIds.push(orderId);
                console.log("ORDER ID FOUND", orderId);
            }
            startIndex += 10;
        }


        console.log("TOTAL ORDERS FOUND", orderIds.length);
        console.log("--------------------");

        // 2. For each order id found, load the order details, wait some random time in between page loads

        processOrders = async function (i) {
            if (i < orderIds.length) {
                const orderId = orderIds[i];

                let timeoutLength = 1000 + randomIntFromInterval(100, 5000);
                await sleep(timeoutLength);
                console.log("FETCHING DETAILS FOR", orderId);

                try {
                    await fetchOrderDetails(orderId);
                } catch (e) {
                    console.log(e);
                }
                processOrders(i + 1)
            }
        }
        await processOrders(0)
        console.log("ALL DONE");


    } else {
        await fetchOrderDetails(orderId);
    }

}

main();