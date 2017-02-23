const axios = require('axios');
const moment = require('moment');


const requestTimes = (date) => {
    const calendarId = "athleticsmcgill@gmail.com";
    let desiredDate = moment(date).toISOString();
    let dayAfter = moment(date).add(1, "days").toISOString();
    const myKey = "AIzaSyBVniGKarvjET4CVH5OisnQ0NxJsH09L2w";
    let url = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events?key=" + myKey + "&timeMin=" + desiredDate + "&timeMax=" + dayAfter + "&showDeleted=false&singleEvents=true&orderBy=startTime";
    return axios.get(url);
}

const filter = (events, sport) => {
    let returnString = "";
    let eventString;
    switch (sport) {
        case "basketball":
            eventString = "Rec Basketball";
            break;
        case "badminton":
            eventString = "Rec Badminton";
            break;
    }
    for (var i = 0; i < events.length; i++) {
        if (events[i].summary.includes(eventString)) {
            returnString += " " + events[i].summary + " " + events[i].start.dateTime;
        }
    }
    return returnString;
}

module.exports = { requestTimes, filter };
