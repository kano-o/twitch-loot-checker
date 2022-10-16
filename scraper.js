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
            headless: false,
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



        console.log('Hit wait for selector');
        const test = await page.waitForSelector(".swiper-slide");

        await (await page.$('.tw-button--amazon')).click({waitUntil: "networkidle0"});

        await (await page.$('.language-selector__dropdown-arrow')).click({waitUntil: "networkidle0"});
        console.log('language dropdown open');

        await page.screenshot({path:'screenshots/test1.png', fullPage:true});

        // await browser.close();

        await (await page.$('[data-language="en-US"]')).click();
        console.log('language en-US selected');

        await page.waitForNavigation({waitUntil: 'networkidle0'});

        await page.screenshot({path:'screenshots/test2.png', fullPage:true});

        console.log('finished waiting for selector');

        const el = await page.$$('.offer-list__content__grid > div.tw-block > div > div > div > a > div > div > div > div.item-card-details > div');


        console.log(el.length);


        for (const [i, elElement] of el.entries()) {
            const href = await elElement.getProperty('textContent')
            console.log(await href.jsonValue() + ',');
            //await elElement.screenshot({path:'screenshots/tw-card' + i + '.png'});
        }

        await browser.close();
    })();

}


scrapeLoot('https://gaming.amazon.com/home?ingress=twch');