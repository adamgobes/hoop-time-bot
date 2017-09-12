const parseDate = (date) => {
    const indexOfT = date.indexOf('T');
    const parsed = `${date.substring(0, indexOfT)} ${date.substring(indexOfT + 1, 16)}`;
    return parsed;
};

module.exports = { parseDate };
