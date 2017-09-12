const allTimes = () => {
    const returnList = [];
    for (let i = 6; i <= 22; i += 1) {
        if (i < 10) {
            returnList.push(`0${i}:00`);
            returnList.push(`0${i}:30`);
        } else {
            returnList.push(`${i}:00`);
            returnList.push(`${i}:30`);
        }
    }
    return returnList;
};

const removeConsecBreaks = (array) => {
    const returnArray = [];
    let previousBreak = false;
    for (let i = 0; i < array.length; i += 1) {
        if (previousBreak && array[i].length !== 0) {
            previousBreak = false;
        }
        if (!previousBreak) {
            returnArray.push(array[i]);
        }
        if (array[i].length === 0) {
            previousBreak = true;
        }
    }
    return returnArray;
};

const generateIntervals = (openSlots, returnArray) => {
    const index = openSlots.indexOf('');
    if (index === -1) {
        if (openSlots.length <= 1) {
            return returnArray;
        }
            returnArray.push(`${openSlots[0]}-${openSlots[openSlots.length - 1]}`);
            return returnArray;
    }
    returnArray.push(`${openSlots[0]}-${openSlots[index - 1]}`);
    return generateIntervals(openSlots.slice(index + 1, openSlots.length), returnArray);
};

const generateResponse = (array) => {
    if (array.length === 0) {
        return 'Sorry, the gyms are not available on the date you requested';
    }
    let returnString = '';
    for (let i = 0; i < array.length; i += 1) {
        if (i === array.length - 1) {
            returnString += array[i];
        } else {
            returnString += `${array[i]},`;
        }
    }
    return returnString;
};

const generateOpenGymTimes = (events) => {
    if (events.length === 0) {
        return 'This facility is free the whole day!';
    } else if (events[0].summary.includes('EXAMINATIONS PERIOD')) {
        return 'Exams season is unfortunately upon us. All the facilities are occupied :(';
    }

    const allTimesList = allTimes();
    const timesOccupied = [];
    let lastTime = '';
    for (let i = 0; i < events.length; i += 1) {
        const startTimeIndex = allTimesList.indexOf(events[i].start.dateTime.substring(11, 16));
        const endTimeIndex = allTimesList.indexOf(events[i].end.dateTime.substring(11, 16));

        if (lastTime === allTimesList[startTimeIndex]) {
            timesOccupied.push(allTimesList[startTimeIndex]);
        }

        lastTime = allTimesList[endTimeIndex];

        for (let j = startTimeIndex + 1; j < endTimeIndex; j += 1) {
            timesOccupied.push(allTimesList[j]);
        }
    }

    for (let k = 0; k < allTimesList.length; k += 1) {
        if (timesOccupied.indexOf(allTimesList[k]) !== -1) {
            allTimesList[k] = '';
        }
    }

    return generateResponse(generateIntervals(removeConsecBreaks(allTimesList), []));
};

const generateCurrieTimes = (events) => {
    const CONTAINS12 = ['Gyms 1 & 2', 'Gyms 1&2', 'Gyms 1/2'];
    const CONTAINS34 = ['Gyms 3 & 4', 'Gyms 3&4', 'Gyms 3/4'];

    const events12 = [];
    const events34 = [];
    for (let i = 0; i < events.length; i += 1) {
        for (let j = 0; j < CONTAINS12.length; j += 1) {
            if (events[i].summary.includes(CONTAINS12[j])) {
                events12.push(events[i]);
            }
        }

        for (let j = 0; j < CONTAINS34.length; j += 1) {
            if (events[i].summary.includes(CONTAINS34[j])) {
                events34.push(events[i]);
            }
        }
    }
    return `The available times I found to use Gyms 1 & 2 are ${generateOpenGymTimes(events12)}. The available times I found to use Gyms 3 & 4 are ${generateOpenGymTimes(events34)}`;
};

const generateFieldhouseTimes = events => `The available times I found to use the fieldhouse are ${generateOpenGymTimes(events)}`;

const getTimes = (events, facility) => {
    switch (facility) {
        case 'fieldhouse':
            return generateFieldhouseTimes(events);
        case 'gym':
            return generateCurrieTimes(events);
        default:
            return 'Unable to process request';
    }
};

module.exports = getTimes;
