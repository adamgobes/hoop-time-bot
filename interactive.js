'use strict';

const calendarRequest = require('./calendarRequest');

let Wit = null;
let interactive = null;
try {
    // if running from repo
    Wit = require('../').Wit;
    interactive = require('../').interactive;
} catch (e) {
    Wit = require('node-wit').Wit;
    interactive = require('node-wit').interactive;
}

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
    const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
    ;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
};

const actions = {
    send(request, response) {
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;
        console.log('sending...', JSON.stringify(response));
    },
    getTimes({context, entities}) {
        var date = firstEntityValue(entities, "datetime");
        var sport = firstEntityValue(entities, "sport");
        var times = calendarRequest.requestTimes(sport, date).then(function(response) {
            context.times = calendarRequest.filter(response.data.items, sport).substring(0, 200);
            return context;
        }).catch(function(error) {
            console.log(error);
        });
    },
};

let accessToken = "RGDH23D2DR62LX4YEYDNLEC3PJ6ATQTG";


const client = new Wit({accessToken, actions});
interactive(client);
