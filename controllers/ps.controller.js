const {signIn, loadPage, propertyAvailableMapper} = require("../utils/scrapingUtils");

let pageInstance = null;

const getPageInstance = async () => {
    if (!pageInstance) {
        const {page} = await signIn();
        pageInstance = page
    }
    return pageInstance;
};

const getAvailableFromPsCode = async (psCode) => {
    console.log(new Date())
    const page = await getPageInstance()
    console.log(new Date())
    const $ = await loadPage(page, psCode);
    console.log(new Date())
    return propertyAvailableMapper($)
}

module.exports = {
    getPageInstance,
    getAvailableFromPsCode
}
