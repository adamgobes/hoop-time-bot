const moment = require('moment');
const { List } = require('immutable');
const { parseDate } = require('./utilities');

const filter = (events, sport) => {
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
    return List(events).filter(event => event.summary.includes(eventString));
};

const getRecTimes = (events, sport) => {
    const getResponse = (init, filteredEvents) => {
        if (filteredEvents.size === 0) return init;
        const event = filteredEvents.get(0);
        const eventTimes = {
            start: moment(parseDate(event.start.dateTime)).hour(),
            end: moment(parseDate(event.end.dateTime)).hour(),
        };
        if (events.size === 1) return getResponse(`${init}${eventTimes.start}:00-${eventTimes.end}:00,`, filteredEvents.slice(1));
        return getResponse(`${init}${eventTimes.start}:00-${eventTimes.end}:00.`, filteredEvents.slice(1));
    };

    const filteredList = filter(events, sport);
    if (filteredList.size === 0) return 'Sorry I did not find any times available for your request.';

    const initString = (sport === 'swimming') || (sport === 'swim') ? `The available times I found to go ${sport} are ` : `The available times I found to play ${sport} are `;

    return getResponse(initString, filteredList);
};

const getNearestRec = (events, sport) => {
    const filteredList = filter(events, sport);
    if (filteredList.length === 0) return 'Sorry I did not find any times available for your request.';

        const nearestDate = moment(filteredList.get(0).start.dateTime).format('dddd, MMMM Do YYYY');
        const startTime = moment(parseDate(filteredList.get(0).start.dateTime)).hour();
        const endTime = moment(parseDate(filteredList.get(0).end.dateTime)).hour();

        let responseString = (sport === 'swimming') || (sport === 'swim') ? `The nearest time I found to go ${sport} is ` : `The nearest time I found to play ${sport} is `;
        responseString += `${nearestDate} from ${startTime}:00 to ${endTime}:00`;

        return responseString;
};

module.exports = { filter, getRecTimes, getNearestRec };
