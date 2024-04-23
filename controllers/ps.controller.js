const {signIn, loadPage, propertyAvailableMapper} = require("../utils/scrapingUtils");

const getAvailableFromPsCode = async (psCode) => {
    const {page, browser} = await signIn();
    const $ = await loadPage(page, psCode);
    return propertyAvailableMapper($)
}

module.exports = {
    getAvailableFromPsCode
}
