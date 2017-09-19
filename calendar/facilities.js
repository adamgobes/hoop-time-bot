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

const generateCurrieSchedule = (listOneTwo, listThreeFour, events) => {
    const CONTAINS12 = List(['Gyms 1 & 2', 'Gym 1 & 2', 'Gyms 1&2', 'Gym 1&2', 'Gyms 1/2']);
    const CONTAINS34 = List(['Gyms 3 & 4', 'Gym 3 & 4', 'Gyms 3&4', 'Gym 3&4', 'Gyms 3/4']);

    let events12 = List();
    let events34 = List();

    events.forEach((event) => {
        const in12 = CONTAINS12.find(string => event.summary === string);
        const in23 = CONTAINS34.find(string => event.summary === string);
        if (in12) events12 = events12.concat(event);
        else if (in23) events34 = events34.concat(event);
        else {
            events12 = events12.concat(event);
            events34 = events34.concat(event);
        }
    });

    return `The available times I found to use Gyms 1 & 2 are ${generateOpenGymTimes(events12)}. The available times I found to use Gyms 3 & 4 are ${generateOpenGymTimes(events34)}`;
};

const generateFieldhouseTimes = events => `The available times I found to use the fieldhouse are ${generateOpenGymTimes(events)}`;

const getFacilityTimes = (events, facility) => {
    switch (facility) {
        case 'fieldhouse':
            return generateFieldhouseTimes(events);
        case 'gym':
            return generateCurrieSchedule(events);
        default:
            return 'Sorry, the gyms are not available on the date you requested';
    }
};

module.exports = { getFacilityTimes, generateCurrieSchedule };
