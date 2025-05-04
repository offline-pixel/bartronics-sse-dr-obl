function getPagedData(isbns, page, limit) {
    const start = (page - 1) * limit;
    const end = start + parseInt(limit, 10);
    const pagedIsbns = isbns.slice(start, end);
    return pagedIsbns;
}

module.exports = { getPagedData }