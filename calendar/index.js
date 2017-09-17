const requestTimes = require('./requestTimes');

const getFacilityTimes = require('./facilities');

const { getRecTimes, getNearestRec } = require('./rec');

module.exports = {
    requestTimes, getRecTimes, getFacilityTimes, getNearestRec,
};
