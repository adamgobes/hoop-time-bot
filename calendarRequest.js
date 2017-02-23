const axios = require('axios');
const moment = require('moment');


const requestTimes = (date) => {
    const calendarId = "athleticsmcgill@gmail.com";
    let desiredDate = moment(date).toISOString();
    let dayAfter = moment(date).add(1, "days").toISOString();
    console.log(desiredDate, dayAfter);
    const myKey = "AIzaSyBVniGKarvjET4CVH5OisnQ0NxJsH09L2w";
    let url = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events?key=" + myKey + "&timeMin=" + desiredDate + "&timeMax=" + dayAfter + "&showDeleted=false&singleEvents=true&orderBy=startTime";
    return axios.get(url);
}

const filter = (events, sport) => {
    let filteredList = [];
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
            filteredList.push({
                start: moment(events[i].start.dateTime).hour(),
                end: moment(events[i].end.dateTime).hour()
            });
        }
    }
    return filteredList;
}

const generateResponse = (list) => {
    if (list.length == 0) {
        return "Sorry I did not find any times available for your request."
    }

    let responseString = "The available times I found are "

    for (var i = 0; i < list.length; i++) {
        responseString += list[i].start + "-" + list[i].end + " ";
    }
    return responseString;
}

module.exports = { requestTimes, filter, generateResponse };
