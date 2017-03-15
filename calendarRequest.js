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
                start: moment(parseDate(events[i].start.dateTime)).hour(),
                end: moment(parseDate(events[i].end.dateTime)).hour()
            });
        }
    }
    return filteredList;
}




const generateOpenGymTimes = (events) => {
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
    }

    const allTimes = () => {
        let returnList = [];
        for (var i = 8; i <= 22; i++) {
            if (i < 10) {
                returnList.push("0" + i + ":00");
                returnList.push("0" + i + ":30");
            } else {
                returnList.push(i + ":00");
                returnList.push(i + ":30");
            }
        }
        return returnList;
    }

    const generateIntervals = (openSlots, returnArray) => {
        let index = openSlots.indexOf("");
        if (index === -1) {
            return returnArray;
        }
        returnArray.push(openSlots[0] + "-" + openSlots[index-1]);
        return generateIntervals(openSlots.slice(index + 1, openSlots.length), returnArray);
    }

    const generateResponse = (array) => {
        let returnString = "The available times are ";
        for (var i = 0; i < array.length; i++) {
            returnString += array[i] + " ";
        }
        return returnString;
    }

    let allTimesList = allTimes();
    let lastTime = "";
    for (var i = 0; i < events.length; i++) {
        let startTimeIndex = allTimesList.indexOf(events[i].start.dateTime.substring(11, 16));
        let endTimeIndex = allTimesList.indexOf(events[i].end.dateTime.substring(11, 16));
        if (startTimeIndex === -1 ) {
            continue;
        } else {
            if (lastTime == allTimesList[startTimeIndex]) {
                allTimesList[startTimeIndex] = "";
            }
            lastTime = allTimesList[endTimeIndex];
        }
        for (var j = startTimeIndex + 1; j < endTimeIndex; j++) {
            allTimesList[j] = "";
        }
    }

    return generateResponse(generateIntervals(removeConsecBreaks(allTimesList), []));
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


const parseDate = (date) => {
    let indexOfT = date.indexOf("T");
    let parsed = date.substring(0, indexOfT) + " " + date.substring(indexOfT + 1, 16);
    return parsed;
}

module.exports = { requestTimes, filter, generateResponse, generateOpenGymTimes };
