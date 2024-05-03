const {loadPage, propertyAvailableMapper, getPageAndSignIn} = require("../utils/scrapingUtils");

const getAvailableFromPsCode = async (psCode) => {
    const page = await getPageAndSignIn();
    const $ = await loadPage(page, psCode);
    return propertyAvailableMapper($)
}

module.exports = {
    getAvailableFromPsCode
}
