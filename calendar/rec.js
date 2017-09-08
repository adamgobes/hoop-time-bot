const moment = require('moment');
const parseDate = require('./utilities').parseDate;


const generateRecTimes = (events, sport) => {
    const filter = (events, sport) => {
        let filteredList = [];
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
        }
        for (var i = 0; i < events.length; i++) {
            if (events[i].summary.includes(eventString)) {
                filteredList.push({
                    start: moment(parseDate(events[i].start.dateTime)).hour(),
                    end: moment(parseDate(events[i].end.dateTime)).hour()
                });
            }
        }
        return filteredList;
    };

    let filteredList = filter(events, sport);

    if (filteredList.length == 0) {
        return 'Sorry I did not find any times available for your request.';
    }

    let responseString = (sport == 'swimming') || (sport == 'swim') ? 'The available times I found to go ' + sport + ' are '  : 'The available times I found to play ' + sport + ' are ';

    for (var i = 0; i < filteredList.length; i++) {
        if (i == filteredList.length - 1) {
            responseString += filteredList[i].start + ':00-' + filteredList[i].end + ':00';
        } else {
            responseString += filteredList[i].start + ':00-' + filteredList[i].end + ':00, ';
        }
    }
    return responseString;
};

module.exports = generateRecTimes;
