const axios = require('axios');
const moment = require('moment');


var today = moment("2017-02-18T00:00:00.000-08:00");
console.log(today.add(2, "day").toISOString());

const requestTimes = (date) => {
    const calendarId = "athleticsmcgill@gmail.com";
    let today = moment(date).toISOString();
    let tomorrow = moment(date).add(1, "days").toISOString();
    const myKey = "AIzaSyBVniGKarvjET4CVH5OisnQ0NxJsH09L2w";
    let url = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events?key=" + myKey + "&timeMin=" + today + "&timeMax=" + today + "&showDeleted=false&singleEvents=true&orderBy=startTime";
    return axios.get(url);
}

const filter = (events, sport) => {
    let returnString = "";
    let eventString = "Varsity Badminton";
    for (var i = 0; i < events.length; i++) {
        if (events[i].summary.includes(eventString)) {
            returnString += " " + events[i].summary + " " + events[i].start.dateTime;
        }
    }
    return returnString;
}

module.exports = { requestTimes, filter };
