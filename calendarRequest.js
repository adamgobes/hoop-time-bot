const axios = require('axios');

const request = (date, sport) => {
    const calendarId = "athleticsmcgill@gmail.com";
    const myKey = "AIzaSyBVniGKarvjET4CVH5OisnQ0NxJsH09L2w";
    let url = "https://www.googleapis.com/calendar/v3/calendars/" ++ calendarId ++ "/events?key=" ++ myKey ++ "&timeMin=" ++ date ++ "&timeMax=" ++ date ++ "&showDeleted=false&singleEvents=true&orderBy=startTime";
    axios.get(url).then(function(response) {
        return response;
    })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports = request;
