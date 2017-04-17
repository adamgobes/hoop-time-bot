const axios = require('axios');
const moment = require('moment');


const requestTimes = (date, activity) => {

    let calendarId;

    switch (activity) {
        case "basketball":
        case "badminton":
        case "gym":
            calendarId = "athleticsmcgill@gmail.com";
            break;

        case "swimming":
        case "swim":
            calendarId = "gvfv48ia1o6tj5ourq6r63oon4@group.calendar.google.com";
            break;
        case "soccer":
        case "volleyball":
        case "fieldhouse":
            calendarId = "nt3abkietk5e709ifldk6g50dk@group.calendar.google.com";
            break;
        default:
            calendarId = "athleticsmcgill@gmail.com";
    }
    let desiredDate = moment(date).toISOString();
    let dayAfter = moment(date).add(1, "days").toISOString();
    const myKey = "AIzaSyBVniGKarvjET4CVH5OisnQ0NxJsH09L2w";
    let url = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events?key=" + myKey + "&timeMin=" + desiredDate + "&timeMax=" + dayAfter + "&showDeleted=false&singleEvents=true&orderBy=startTime";
    return axios.get(url);
}




const generateOpenGymTimes = (events) => {
    if (events.length == 0) {
        return "This facility is free the whole day!";
    } else if (events[0].summary = "Exams") {
        return "Exams season is unfortunately upon us. All the facilities are occupied :(";
    }
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
        for (var i = 6; i <= 22; i++) {
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
            if (openSlots.length <= 1) {
                return returnArray;
            } else {
                returnArray.push(openSlots[0] + "-" + openSlots[openSlots.length-1]);
                return returnArray;
            }
            return returnArray;
        }
        returnArray.push(openSlots[0] + "-" + openSlots[index-1]);
        return generateIntervals(openSlots.slice(index + 1, openSlots.length), returnArray);
    }

    const generateResponse = (array) => {
        if (array.length == 0) {
            return "Sorry, the gyms are not available on the date you requested";
        }
        let returnString = "";
        for (var i = 0; i < array.length; i++) {
            if (i == array.length - 1) {
                returnString += array[i];
            } else {
                returnString += array[i] + ",";
            }
        }
        return returnString;
    }

    let allTimesList = allTimes();
    let timesOccupied = [];
    let lastTime = "";
    for (var i = 0; i < events.length; i++) {
        let startTimeIndex = allTimesList.indexOf(events[i].start.dateTime.substring(11, 16));
        let endTimeIndex = allTimesList.indexOf(events[i].end.dateTime.substring(11, 16));

        if (lastTime == allTimesList[startTimeIndex]) {
            timesOccupied.push(allTimesList[startTimeIndex]);
        }

        lastTime = allTimesList[endTimeIndex];

        for (var j = startTimeIndex + 1; j < endTimeIndex; j++) {
            timesOccupied.push(allTimesList[j]);
        }
    }

    for (var j = 0; j < allTimesList.length; j++) {
        if (timesOccupied.indexOf(allTimesList[j]) != -1) {
            allTimesList[j] = "";
        }
    }

    return "The available times I found to use this facility are " + generateResponse(generateIntervals(removeConsecBreaks(allTimesList), []));
}


const generateRecTimes = (events, sport) => {
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

            case "swimming":
            case "swim":
                eventString = "Rec Swim";
                break;

            case "soccer":
                eventString = "Drop-In Soccer";
                break;
            case "volleyball":
                eventString = "Drop-In Volleyball";
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

    let filteredList = filter(events, sport);

    if (filteredList.length == 0) {
        return "Sorry I did not find any times available for your request."
    }

    let responseString = (sport == "swimming") || (sport == "swim") ? "The available times I found to go " + sport + " are "  : "The available times I found to play " + sport + " are ";

    for (var i = 0; i < filteredList.length; i++) {
        if (i == filteredList.length - 1) {
            responseString += filteredList[i].start + ":00-" + filteredList[i].end + ":00";
        } else {
            responseString += filteredList[i].start + ":00-" + filteredList[i].end + ":00, ";
        }
    }
    return responseString;
}


const parseDate = (date) => {
    let indexOfT = date.indexOf("T");
    let parsed = date.substring(0, indexOfT) + " " + date.substring(indexOfT + 1, 16);
    return parsed;
}

module.exports = { requestTimes, generateRecTimes, generateOpenGymTimes };
