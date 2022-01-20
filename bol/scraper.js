const playwright = require('playwright');
const fs = require('fs');
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
    const baseURL = "https://www.bol.com";
    const accountURL = `${baseURL}/nl/rnwy/account/bestellingen/overzicht`

    console.log("USER DATA DIR", userDataDir);
    console.log("ORDER ID", orderId);

    // -------------

    const browser = await playwright.chromium.launchPersistentContext(userDataDir, { headless: false });

    const page = await browser.newPage();


    let fetchOrderDetails = async function (orderId) {
        // TODO: load order details
    }


    if (orderId === "ALL") {

        // 1. Find all order ids by loading all the order pages and extracting the ids
        let startIndex = 0;
        let endIndex = 1000;
        const orderIds = [];

        while (startIndex <= endIndex) {
            await page.goto(`${accountURL}`);
            const orderNrEls = await page.$$('.order-overview__order-number');
            for (const orderEl of orderIdElements) {
                const orderNr = await orderEl.innerText();
                console.log("ORDER ID FOUND", orderNr);
            }
            

            // if (endIndex == 1000) {
            //     const numOrderEl = await page.$$('.num-orders');
            //     const numOrders = parseInt((await numOrderEl[0].innerText()).replace(" orders").trim());
            //     endIndex = Math.floor(numOrders / 10) * 10;
            //     console.log("NUM ORDERS", numOrders);
            //     console.log("END INDEX", endIndex);
            // }

            // // find orders on page
            // const orderIdElements = await page.$$('.order-info .a-col-right .value');
            // orderId = (await orderIdElements[0].innerText()).trim(); // ensure we can actually read order Ids

            // console.log("ORDERS EL LENGTH", orderIdElements.length);
            // // Extract ids from orders
            // for (const orderEl of orderIdElements) {
            //     const orderId = await orderEl.innerText();
            //     orderIds.push(orderId);
            //     console.log("ORDER ID FOUND", orderId);
            // }
            // startIndex += 10;
        }


        // console.log("TOTAL ORDERS FOUND", orderIds.length);
        // console.log("--------------------");

        // // 2. For each order id found, load the order details, wait some random time in between page loads

        // processOrders = async function (i) {
        //     if (i < orderIds.length) {
        //         const orderId = orderIds[i];

        //         let timeoutLength = 1000 + randomIntFromInterval(100, 5000);
        //         await sleep(timeoutLength);
        //         console.log("FETCHING DETAILS FOR", orderId);

        //         try {
        //             await fetchOrderDetails(orderId);
        //         } catch (e) {
        //             console.log(e);
        //         }
        //         processOrders(i + 1)
        //     }
        // }
        // processOrders(0)

    } else {
        // await fetchOrderDetails(orderId);
    }

}

main();