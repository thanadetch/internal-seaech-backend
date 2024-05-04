const axios = require("axios");
const cookie = require('cookie');
const {psWebURL, psUsername, psPassword} = require("../configs/environment");

const getCsrfToken = async () => {
    const response = await axios.get(`${psWebURL}/api/auth/csrf/`);
    const setCookie = response.headers['set-cookie'].join('; ')
    const jsonCookie = cookie.parse(setCookie)
    const cookieValue = cookie.serialize('__Host-next-auth.csrf-token', jsonCookie['__Host-next-auth.csrf-token'])
    return {
        csrfToken: response.data.csrfToken,
        csrfCookie: cookieValue
    }
}

const getCredentialsCookieToken = async () => {
    const {csrfCookie, csrfToken} = await getCsrfToken()

    const data = {
        'email': psUsername,
        'password': psPassword,
        'redirect': 'false',
        'isNewUser': 'false',
        'locale': 'en',
        'csrfToken': csrfToken,
        'callbackUrl': `${psWebURL}/en/`,
        'json': 'true'
    };
    // send post with x-www-form-urlencoded
    const response = await axios.post(
        `${psWebURL}/api/auth/callback/credentials/`,
        new URLSearchParams(data),
        {
            headers: {
                'cookie': csrfCookie,
            }
        }
    );
    const setCookie = response.headers['set-cookie'].join('; ')
    const json2 = cookie.parse(setCookie)
    return cookie.serialize('__Secure-next-auth.session-token', json2['__Secure-next-auth.session-token'])
}

const getListing = async (psCode) => {
    const credentialsCookie = await getCredentialsCookieToken();
    const response = await axios.post(
        `${psWebURL}/api/listing-admin/my-listings/`,
        {
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
        },
        {
            headers: {cookie: credentialsCookie}
        }
    );

    return response.data?.data?.find((item) => item.id === +psCode)
}

const getAvailableFromPsCode = async (psCode) => {
    const listing = await getListing(psCode)
    const availableStatus = {
        available: "Available",
        rented: "Not Available",
        'no-information': "Cannot contact"
    }

    return {
        availability: availableStatus[listing?.availability],
        comment: listing?.availability === 'rented' ? `Rented Until ${listing?.availableFrom}` : ''
    }
}

module.exports = {
    getAvailableFromPsCode
}
