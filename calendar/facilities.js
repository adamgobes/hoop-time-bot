const { OrderedMap, List } = require('immutable');

const createTimesMap = (map, startHour, endHour) => {
    if (startHour < 10 && startHour !== endHour) {
        const hourMap = OrderedMap([
            [`0${startHour}:00`, false],
            [`0${startHour}:05`, false],
            [`0${startHour}:10`, false],
            [`0${startHour}:15`, false],
            [`0${startHour}:20`, false],
            [`0${startHour}:25`, false],
            [`0${startHour}:30`, false],
            [`0${startHour}:35`, false],
            [`0${startHour}:40`, false],
            [`0${startHour}:45`, false],
            [`0${startHour}:50`, false],
            [`0${startHour}:55`, false],
        ]);
        return createTimesMap(map.concat(hourMap), startHour + 1, endHour);
    } else if (startHour >= 10 && startHour !== endHour) {
        const hourMap = OrderedMap([
            [`${startHour}:00`, false],
            [`${startHour}:05`, false],
            [`${startHour}:10`, false],
            [`${startHour}:15`, false],
            [`${startHour}:20`, false],
            [`${startHour}:25`, false],
            [`${startHour}:30`, false],
            [`${startHour}:35`, false],
            [`${startHour}:40`, false],
            [`${startHour}:45`, false],
            [`${startHour}:50`, false],
            [`${startHour}:55`, false],
        ]);
        return createTimesMap(map.concat(hourMap), startHour + 1, endHour);
    }
    return map;
};

const getFreeTimes = (timesMap, events) => {
    const bookInterval = (map, start, end) => {
        if (start === end) return map;
        const keyArray = map.keySeq().toArray();
        const nextIndex = keyArray.indexOf(start) + 1;
        const next = keyArray[nextIndex];
        return bookInterval(map.set(start, true), next, end);
    };

    if (events.length === 0) return timesMap;
    const startTime = events[0].start.dateTime.substring(11, 16);
    const endTime = events[0].end.dateTime.substring(11, 16);

    return getFreeTimes(bookInterval(timesMap, startTime, endTime), events.splice(1));
};

const getResponse = (timesMap) => {
    const start = timesMap.findKey(time => time);

    const keyArray = timesMap.keySeq().toArray();
    const startIndex = keyArray.indexOf(start);

    if (!start) return `and ${keyArray[0]}-${keyArray[keyArray.length - 1]}`;

    const beforeStart = timesMap.slice(0, startIndex + 1);
    const beforeStartArray = beforeStart.keySeq().toArray();

    const afterStart = timesMap.slice(startIndex + 1);

    let end = afterStart.findKey(time => !time);
    if (!end) end = keyArray[keyArray.length - 1];
    const endIndex = keyArray.indexOf(end);

    return `${beforeStartArray[0]}-${beforeStartArray[beforeStartArray.length - 1]}, ${getResponse(timesMap.slice(endIndex))}`;
};

const getCurrieSchedule = (events) => {
    const CONTAINS12 = List(['Gyms 1 & 2', 'Gym 1 & 2', 'Gyms 1&2', 'Gym 1&2', 'Gyms 1/2', 'Gym 1/2']);
    const CONTAINS34 = List(['Gyms 3 & 4', 'Gym 3 & 4', 'Gyms 3&4', 'Gym 3&4', 'Gyms 3/4', 'Gym 3/4']);

    let events12 = List();
    let events34 = List();

    events.forEach((event) => {
        const in12 = CONTAINS12.find(string => event.summary.indexOf(string) !== -1);
        const in23 = CONTAINS34.find(string => event.summary.indexOf(string) !== -1);
        if (in12) events12 = events12.concat(event);
        else if (in23) events34 = events34.concat(event);
        else {
            events12 = events12.concat(event);
            events34 = events34.concat(event);
        }
    });
    return { events12, events34 };
};

const getFacilityTimes = (events, facility) => {
    const timesMap = createTimesMap(new OrderedMap({}, 6, 23));
    switch (facility) {
        case 'fieldhouse': {
            const fieldhouseMap = getFreeTimes(timesMap, events);
            return `The available times I found to use the fieldhouse are ${getResponse(fieldhouseMap)}`;
        }
        case 'gym': {
            const { events12, events34 } = getCurrieSchedule(events);
            const gyms12Map = getFreeTimes(timesMap, events12.toArray());
            const gyms34Map = getFreeTimes(timesMap, events34.toArray());
            return `The available times I found to use Gyms 1 & 2 are ${getResponse(gyms12Map)} ${getResponse(gyms34Map)}`;
        }
        default: {
            return 'Sorry, the gyms are not available on the date you requested';
        }
    }
};

module.exports = {
    createTimesMap,
    getFacilityTimes,
    getCurrieSchedule,
    getFreeTimes,
    getResponse,
};
