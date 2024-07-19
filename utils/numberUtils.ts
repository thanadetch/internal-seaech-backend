import _ from "lodash";

export const convertToNumber = (numberValue: string) => {
    if (_.isEmpty(numberValue)) return undefined;
    return _.toNumber(_.isNumber(numberValue) ? numberValue : numberValue.replaceAll(/,/g, ""));
};
