const getComment = (listing) => {
    if (['rented', 'to-sell-with-tenant'].includes(listing?.availability)) {
        return listing?.availableFrom ? `Available on ${listing?.availableFrom}` : ''
    } else {
        return ''
    }
}

module.exports = {
    getComment
}
