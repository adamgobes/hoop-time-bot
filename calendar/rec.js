const moment = require('moment');
const { parseDate } = require('./utilities');

const filter = (events, sport) => {
    const filteredList = [];
    let eventString;
    switch (sport) {
        case 'basketball':
            eventString = 'Rec Basketball';
            break;
        case 'badminton':
            eventString = 'Rec Badminton';
            break;

        case 'swimming':
        case 'swim':
            eventString = 'Rec Swim';
            break;

        case 'soccer':
            eventString = 'Drop-In Soccer';
            break;
        case 'volleyball':
            eventString = 'Drop-In Volleyball';
            break;
        default:
            eventString = '';
    }
    for (let i = 0; i < events.length; i += 1) {
        if (events[i].summary.includes(eventString)) {
            filteredList.push(events[i]);
        }
    }
    return filteredList;
};

const getRecTimes = (events, sport) => {
    const filteredList = filter(events, sport);

    if (filteredList.length === 0) {
        return 'Sorry I did not find any times available for your request.';
    }

    let responseString = (sport === 'swimming') || (sport === 'swim') ? `The available times I found to go ${sport} are ` : `The available times I found to play ${sport} are `;

    for (let i = 0; i < filteredList.length; i += 1) {
        const eventTimes = {
            start: moment(parseDate(filteredList[i].start.dateTime)).hour(),
            end: moment(parseDate(filteredList[i].end.dateTime)).hour(),
        };
        if (i === filteredList.length - 1) {
            responseString += `${eventTimes.start}:00-${eventTimes.end}:00`;
        } else {
            responseString += `${eventTimes.start}:00-${eventTimes.end}:00, `;
        }
    }
    return responseString;
};

const getNearestRec = (events, sport) => {
    const filteredList = filter(events, sport);
    if (filteredList.length === 0) {
        return 'Sorry I did not find any times available for your request.';
    }

    const nearest = filteredList[0];
    console.log(nearest);

    let responseString = (sport === 'swimming') || (sport === 'swim') ? `The nearest time I found to go ${sport} are ` : `The nearest time I found to play ${sport} are `;

    responseString += `${filteredList[0].start}:00-${filteredList[0].end}:00`;

    return responseString;
};

module.exports = { getRecTimes, getNearestRec };
