"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableFromPsCode = exports.getInternalSearchListing = void 0;
const axios_1 = __importDefault(require("axios"));
const cookie_1 = __importDefault(require("cookie"));
const environment_1 = require("../configs/environment");
const psUtils_1 = require("../utils/psUtils");
const getCsrfToken = async () => {
    const response = await axios_1.default.get(`${environment_1.psWebURL}/api/auth/csrf/`);
    const setCookie = response?.headers['set-cookie']?.join('; ') || '';
    const jsonCookie = cookie_1.default.parse(setCookie);
    const cookieValue = cookie_1.default.serialize('__Host-next-auth.csrf-token', jsonCookie['__Host-next-auth.csrf-token']);
    return {
        csrfToken: response.data.csrfToken,
        csrfCookie: cookieValue
    };
};
const getCredentialsCookieToken = async () => {
    const { csrfCookie, csrfToken } = await getCsrfToken();
    const data = {
        'email': environment_1.psUsername,
        'password': environment_1.psPassword,
        'redirect': 'false',
        'isNewUser': 'false',
        'locale': 'en',
        'csrfToken': csrfToken,
        'callbackUrl': `${environment_1.psWebURL}/en/`,
        'json': 'true'
    };
    // send post with x-www-form-urlencoded
    const response = await axios_1.default.post(`${environment_1.psWebURL}/api/auth/callback/credentials/`, new URLSearchParams(data), {
        headers: {
            'cookie': csrfCookie,
        }
    });
    const setCookie = response?.headers['set-cookie']?.join('; ') || '';
    const json2 = cookie_1.default.parse(setCookie);
    return cookie_1.default.serialize('__Secure-next-auth.session-token', json2['__Secure-next-auth.session-token']);
};
const getListing = async (psCode) => {
    const credentialsCookie = await getCredentialsCookieToken();
    const response = await axios_1.default.post(`${environment_1.psWebURL}/api/listing-admin/my-listings/`, {
        sorts: [],
        listingSources: [],
        listingProviders: [],
        page: 1,
        limit: 20,
        language: 'en',
        availabilities: [],
        keyword: '',
        saleTypes: [],
        tenures: [],
        numberBedrooms: [],
        numberBathrooms: [],
        listingIds: [psCode],
        propertyTypes: [],
        statuses: ['ACTIVE'],
        showMyListingsOnly: false,
        shouldGroupDuplicates: true
    }, {
        headers: { cookie: credentialsCookie }
    });
    return response.data?.data?.find((item) => item.id === +psCode);
};
const getListings = async () => {
    const credentialsCookie = await getCredentialsCookieToken();
    const response = await axios_1.default.post(`${environment_1.psWebURL}/api/listing-admin/my-listings/`, {
        "sorts": [],
        "listingSources": [],
        "listingProviders": [],
        "page": 1,
        "limit": 100,
        "language": "en",
        "availabilities": [],
        "keyword": "",
        "saleTypes": [],
        "tenures": [],
        "numberBedrooms": [],
        "numberBathrooms": [],
        "listingIds": [],
        "propertyTypes": [],
        "statuses": ["ACTIVE"],
        "showMyListingsOnly": false,
        "shouldGroupDuplicates": true,
        "saleHoldType": [],
        "area": [{ "id": 336, "name": "Asok (Neighborhood)" }]
    }, {
        headers: { cookie: credentialsCookie }
    });
    return response.data?.data;
};
const getInternalSearchListing = async () => {
    const response = await getListings();
    return response.map((item) => ({
        "Area LP": item.address.neighborhood,
        "Area LV": "",
        "SKU": "",
        "Property Type": item.propertyType,
        "PostType": item.listingType,
        "PostFrom": item.postBy,
        "Title EN": item.project,
        "Price": "",
        "AreaSize": item.floorSize,
        "Floor": item.floorLevel,
        "Bedroom": item.numberOfBedRooms,
        "Bathroom": item.numberOfBathrooms,
        "pet_allowed": "",
        "Facing direction": "",
        "Unit Number": item.unitNumber,
        "Building year": item.buildingYear,
        "Email": "",
        "Line ID": "",
        "Tel.": "",
        "Name": "",
        "Whatsapp": "",
        "Facebook Messenger": "",
        "Wechat": "",
        "External Data Source": "",
        "Listed On": "",
        "Availability": "",
        "Comment": "",
        "Update Availability": "",
        "Exclusive": "",
        "PS Code": item.id
    }));
};
exports.getInternalSearchListing = getInternalSearchListing;
const getAvailableFromPsCode = async (psCode) => {
    const psListing = await getListing(psCode);
    const availableStatus = {
        available: "Available",
        rented: "Not Available",
        'no-information': "Cannot contact",
        'to-sell-with-tenant': 'Not Available'
    };
    return {
        // @ts-ignore
        availability: availableStatus[psListing?.availability],
        comment: (0, psUtils_1.getComment)(psListing)
    };
};
exports.getAvailableFromPsCode = getAvailableFromPsCode;
