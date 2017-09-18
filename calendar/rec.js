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
            eventString = 'Rec Soccer';
            break;
        case 'volleyball':
            eventString = 'Rec Vball';
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

    const nearestDate = moment(filteredList[0].start.dateTime).format('dddd, MMMM Do YYYY');
    const startTime = moment(parseDate(filteredList[0].start.dateTime)).hour();
    const endTime = moment(parseDate(filteredList[0].end.dateTime)).hour();

    let responseString = (sport === 'swimming') || (sport === 'swim') ? `The nearest time I found to go ${sport} is ` : `The nearest time I found to play ${sport} is `;

    responseString += `${nearestDate} from ${startTime}:00 to ${endTime}:00`;

    return responseString;
};

module.exports = { getRecTimes, getNearestRec };
