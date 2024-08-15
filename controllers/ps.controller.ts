import axios from "axios";
import cookie from "cookie";
import {psPassword, psUsername, psWebURL} from "../configs/environment";
import {getComment} from "../utils/psUtils";
import {PsListingResponse} from "../types";

const getCsrfToken = async () => {
    const response = await axios.get(`${psWebURL}/api/auth/csrf/`);
    const setCookie = response?.headers["set-cookie"]?.join("; ") || "";
    const jsonCookie = cookie.parse(setCookie);
    const cookieValue = cookie.serialize("__Host-next-auth.csrf-token", jsonCookie["__Host-next-auth.csrf-token"]);
    return {
        csrfToken: response.data.csrfToken,
        csrfCookie: cookieValue
    };
};

const getCredentialsCookieToken = async () => {
    const {csrfCookie, csrfToken} = await getCsrfToken();

    const data = {
        "email": psUsername,
        "password": psPassword,
        "redirect": "false",
        "isNewUser": "false",
        "locale": "en",
        "csrfToken": csrfToken,
        "callbackUrl": `${psWebURL}/en/`,
        "json": "true"
    };
    // send post with x-www-form-urlencoded
    const response = await axios.post(
        `${psWebURL}/api/auth/callback/credentials/`,
        new URLSearchParams(data),
        {
            headers: {
                "cookie": csrfCookie,
            }
        }
    );
    const setCookie = response?.headers["set-cookie"]?.join("; ") || "";
    const json2 = cookie.parse(setCookie);
    return cookie.serialize("__Secure-next-auth.session-token", json2["__Secure-next-auth.session-token"]);
};

const getListing = async (psCode: string) => {
    const credentialsCookie = await getCredentialsCookieToken();
    const response = await axios.post<PsListingResponse>(
        `${psWebURL}/api/listing-admin/my-listings/`,
        {
            sorts: [],
            listingSources: [],
            listingProviders: [],
            page: 1,
            limit: 20,
            language: "en",
            availabilities: [],
            keyword: "",
            saleTypes: [],
            tenures: [],
            numberBedrooms: [],
            numberBathrooms: [],
            listingIds: [psCode],
            propertyTypes: [],
            statuses: ["ACTIVE"],
            showMyListingsOnly: false,
            shouldGroupDuplicates: true
        },
        {
            headers: {cookie: credentialsCookie}
        }
    );

    return response.data?.data?.find((item) => item.id === +psCode);
};

const getListings = async () => {
    const credentialsCookie = await getCredentialsCookieToken();
    const response = await axios.post<PsListingResponse>(
        `${psWebURL}/api/listing-admin/my-listings/`,
        {
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
            "area": [{"id": 336, "name": "Asok (Neighborhood)"}]
        },
        {
            headers: {cookie: credentialsCookie}
        }
    );

    return response.data?.data;
};

export const getInternalSearchListing = async () => {
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


export const getAvailableFromPsCode = async (psCode: string) => {
    const psListing = await getListing(psCode);
    const availableStatus = {
        available: "Available",
        rented: "Not Available",
        "no-information": "Cannot contact",
        "to-sell-with-tenant": "Not Available"
    };
    const availability = psListing?.availability as keyof typeof availableStatus;
    return {
        availability: availableStatus[availability],
        comment: getComment(psListing)
    };
};
