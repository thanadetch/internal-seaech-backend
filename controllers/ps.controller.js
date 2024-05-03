const {signIn, loadPage, propertyAvailableMapper, setBrowser} = require("../utils/scrapingUtils");

const getAvailableFromPsCode = async (psCode) => {
    const {page} = await signIn();
    const $ = await loadPage(page, psCode);
    return propertyAvailableMapper($)
}

module.exports = {
    getAvailableFromPsCode
}
