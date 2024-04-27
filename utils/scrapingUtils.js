const {psWebURL, psUsername, psPassword, isLocal, googleChromePath} = require("../configs/environment");
const cheerio = require("cheerio");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

const signIn = async () => {
    // Launch a headless browser instance.
    const browser = await puppeteer.launch({
        args: isLocal ? puppeteer.defaultArgs() : chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: isLocal ? googleChromePath : await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
        timeout: 120000,


    });

    const page = await browser.newPage();
    const acceptBeforeUnload = dialog =>
        dialog.type() === "beforeunload" && dialog.accept()
    ;
    page.on("dialog", acceptBeforeUnload);

    await page.goto(psWebURL);

    await page.waitForSelector('[data-testid="sign-in"]');
    await page.click('[data-testid="sign-in"]');

    await page.waitForSelector("input[name='email']");
    await page.type("input[name='email']", psUsername);

    await page.waitForSelector('input[name="password"]');
    await page.type("input[name='password']", psPassword);

    await page.click("[data-testid=submit]")

    await page.waitForSelector('[data-testid="auth-form"]', {hidden: true})
    return {page, browser};
}

const getPageData = async (page, code) => {
    await page.goto(`${psWebURL}/en/edit/${code}/`, {waitUntil: 'networkidle2', timeout: 120000});
    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML,
        };
    });
    return pageData.html
}

const loadPage = async (page, psCode) => {

    const pageData = await getPageData(page, psCode);
    return cheerio.load(pageData);
}

const getAvailabilityAndComment = (availabilityValue) => {
    let availability = ''
    let comment = ''
    if (availabilityValue?.includes('Available')) {
        availability = 'Available'
    } else if (availabilityValue?.includes('No Information')) {
        availability = 'Cannot contact'
    } else if (availabilityValue) {
        availability = 'Not Available'
        comment = availabilityValue
    }
    return {
        availability,
        comment
    }
}

const propertyAvailableMapper = async ($) => {
    const available = $(`.border-gray-300.border-dashed.border.px-3.py-3.rounded-md`).text()
    return getAvailabilityAndComment(available || '');
}

module.exports = {
    signIn,
    getPageData,
    loadPage,
    propertyAvailableMapper
}

