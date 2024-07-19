import {PsListing} from "../types";

export const getComment = (listing?: PsListing) => {
    if (['rented', 'to-sell-with-tenant'].includes(listing?.availability || '')) {
        return listing?.availableFrom ? `Available on ${listing?.availableFrom}` : ''
    } else {
        return ''
    }
}
