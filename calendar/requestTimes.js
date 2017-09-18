const moment = require('moment');
const axios = require('axios');

const requestTimes = (date, activity) => {
    let calendarId;

    switch (activity) {
        case 'basketball':
        case 'badminton':
        case 'gym':
            calendarId = 'athleticsmcgill@gmail.com';
            break;

        case 'swimming':
        case 'swim':
            calendarId = 'gvfv48ia1o6tj5ourq6r63oon4@group.calendar.google.com';
            break;
        case 'soccer':
        case 'volleyball':
        case 'fieldhouse':
            calendarId = 'nt3abkietk5e709ifldk6g50dk@group.calendar.google.com';
            break;
        default:
            calendarId = 'athleticsmcgill@gmail.com';
    }
    const desiredDate = moment(date).toISOString();
    console.log(date, desiredDate);
    const dayAfter = moment(date).add(1, 'days').toISOString();
    const myKey = 'AIzaSyBVniGKarvjET4CVH5OisnQ0NxJsH09L2w';
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${myKey}&timeMin=${desiredDate}&timeMax=${dayAfter}&showDeleted=false&singleEvents=true&orderBy=startTime`;
    return axios.get(url);
};

module.exports = requestTimes;
