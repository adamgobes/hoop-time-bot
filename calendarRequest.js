const axios = require('axios');
const moment = require('moment');


var today = moment("2017-02-18T00:00:00.000-08:00");
console.log(today.add(2, "day").toISOString());

const request = (date, sport) => {
    const calendarId = "athleticsmcgill@gmail.com";
    let today = moment(date).toISOString();
    let tomorrow = moment(date).add(1, "days").toISOString();
    console.log(today, tomorrow);
    const myKey = "AIzaSyBVniGKarvjET4CVH5OisnQ0NxJsH09L2w";
    let url = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events?key=" + myKey + "&timeMin=" + today + "&timeMax=" + tomorrow + "&showDeleted=false&singleEvents=true&orderBy=startTime";
    return axios.get(url);
}

module.exports = request;
