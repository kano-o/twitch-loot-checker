const puppeteer = require('puppeteer');
const fs = require("fs");

async function scrapeLoot(url) {

    await (async () => {
        const preparePageForTests = async (page) => {
            const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
            await page.setUserAgent(userAgent);
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox', '--window-size=1920,8000'
            ],
            defaultViewport: {
                width:1920,
                height:8000
            }
        });
        const page = await browser.newPage();
        await preparePageForTests(page);

        page.once('load', () => console.log('Page loaded!'));
        await page.goto(url, {waitUntil: "networkidle0"});

        console.log('Hit wait for selector')
        const test = await page.waitForSelector(".swiper-slide");

        await (await page.$('.tw-button--amazon')).click();

        //await page.screenshot({path:'screenshots/test.png', fullPage:true})

        console.log('finished waiting for selector');

        const el = await page.$$('.offer-list__content__grid > div.tw-block > div > div > div > a ');


        console.log(el.length);


        for (const [i, elElement] of el.entries()) {
            const href = await elElement.getProperty('href');

            console.log(await href.jsonValue() + ',');
            //await elElement.screenshot({path:'screenshots/tw-card' + i + '.png'});
        }

        await browser.close();
    })();

}


scrapeLoot('https://gaming.amazon.com/home?ingress=twch');