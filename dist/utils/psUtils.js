"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComment = void 0;
const getComment = (listing) => {
    if (['rented', 'to-sell-with-tenant'].includes(listing?.availability || '')) {
        return listing?.availableFrom ? `Available on ${listing?.availableFrom}` : '';
    }
    else {
        return '';
    }
};
exports.getComment = getComment;
