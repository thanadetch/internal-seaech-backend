const _ = require("lodash");

const convertToNumber = (numberValue) => {
    if (_.isEmpty(numberValue)) return numberValue;
    return _.toNumber(_.isNumber(numberValue) ? numberValue : numberValue.replaceAll(/,/g, ''))
}

module.exports = {
    convertToNumber
}
