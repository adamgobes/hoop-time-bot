const parseDate = (date) => {
    let indexOfT = date.indexOf("T");
    let parsed = date.substring(0, indexOfT) + " " + date.substring(indexOfT + 1, 16);
    return parsed;
}

module.exports = { parseDate };
