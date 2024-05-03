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
    const page = await getPageInstance()
    const $ = await loadPage(page, psCode);
    return propertyAvailableMapper($)
}

module.exports = {
    getPageInstance,
    getAvailableFromPsCode
}
