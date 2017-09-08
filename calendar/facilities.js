const allTimes = () => {
    let returnList = [];
    for (var i = 6; i <= 22; i++) {
        if (i < 10) {
            returnList.push('0' + i + ':00');
            returnList.push('0' + i + ':30');
        } else {
            returnList.push(i + ':00');
            returnList.push(i + ':30');
        }
    }
    return returnList;
};

const removeConsecBreaks = (array) => {
    var returnArray = [];
    var previousBreak = false;
    for (var i = 0; i < array.length; i++) {
        if (previousBreak && array[i].length != 0) {
            previousBreak = false;
        }
        if (!previousBreak) {
            returnArray.push(array[i]);
        }
        if (array[i].length == 0) {
            previousBreak = true;
        }
    }
    return returnArray;
};

const generateIntervals = (openSlots, returnArray) => {
    let index = openSlots.indexOf('');
    if (index === -1) {
        if (openSlots.length <= 1) {
            return returnArray;
        } else {
            returnArray.push(openSlots[0] + '-' + openSlots[openSlots.length-1]);
            return returnArray;
        }
    }
    returnArray.push(openSlots[0] + '-' + openSlots[index-1]);
    return generateIntervals(openSlots.slice(index + 1, openSlots.length), returnArray);
};

const generateResponse = (array) => {
    if (array.length == 0) {
        return 'Sorry, the gyms are not available on the date you requested';
    }
    let returnString = '';
    for (var i = 0; i < array.length; i++) {
        if (i == array.length - 1) {
            returnString += array[i];
        } else {
            returnString += array[i] + ',';
        }
    }
    return returnString;
};

// const getSpecificGymEvents = (events, code) => {
//     let filter;
//     switch (code) {
//         case 12:
//             filter = "(Gyms 1 & 2)";
//             break;
//         case 34:
//             filter = "(Gyms 3 & 4)";
//             break;
//         default:
//             filter = "(Gyms 1 & 2)";
//     }
//     for (let i = 0; i < events.length; i++) {
//         if (events[i].summary.includes(filter))
//     }
//     //return array of events for specific gym;
// };

const generateOpenGymTimes = (events) => {
    // if (gymCode) return generateOpenGymTimes(getSpecificGymEvents(events, gymCode));

    if (events.length == 0) {
        return 'This facility is free the whole day!';
    } else if (events[0].summary.includes('EXAMINATIONS PERIOD')) {
        return 'Exams season is unfortunately upon us. All the facilities are occupied :(';
    }

    let allTimesList = allTimes();
    let timesOccupied = [];
    let lastTime = '';
    for (var i = 0; i < events.length; i++) {
        let startTimeIndex = allTimesList.indexOf(events[i].start.dateTime.substring(11, 16));
        let endTimeIndex = allTimesList.indexOf(events[i].end.dateTime.substring(11, 16));

        if (lastTime == allTimesList[startTimeIndex]) {
            timesOccupied.push(allTimesList[startTimeIndex]);
        }

        lastTime = allTimesList[endTimeIndex];

        for (var j = startTimeIndex + 1; j < endTimeIndex; j++) {
            timesOccupied.push(allTimesList[j]);
        }
    }

    for (var k = 0; k < allTimesList.length; k++) {
        if (timesOccupied.indexOf(allTimesList[k]) != -1) {
            allTimesList[k] = '';
        }
    }

    return 'The available times I found to use this facility are ' + generateResponse(generateIntervals(removeConsecBreaks(allTimesList), []));
};

module.exports = generateOpenGymTimes;
