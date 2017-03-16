const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const calendarRequest = require('./calendarRequest');

const app = express();



let Wit = null;
let log = null;
try {
    Wit = require('../').Wit;
    log = require('../').log;
} catch (e) {
    Wit = require('node-wit').Wit;
    log = require('node-wit').log;
}



app.set('port', (process.env.PORT || 5000));
const WIT_TOKEN = "RGDH23D2DR62LX4YEYDNLEC3PJ6ATQTG"
const FB_PAGE_TOKEN = "EAAUEZA7z5fc4BAIXFXyFJaNXSCN3rVjdfgYQzMIs2qfsjCwEhuCEB8hIZB2t3URhg8L1wHIgNvqkZBzNR1GlZAZCM8i1z978e686FGVZBNAnFLuzyogJrMqZCwHkpGdZCtqGoINs9lfuX04NUzc4KKZCPZCqMq0HcqQVrIZAWyVQc82sgZDZD"
const FB_VERIFY_TOKEN = "verified"

const fbMessage = (id, text) => {
    const body = JSON.stringify({
        recipient: { id },
        message: { text },
    });
    const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
    return fetch('https://graph.facebook.com/me/messages?' + qs, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body,
    })
    .then(rsp => rsp.json())
    .then(json => {
        if (json.error && json.error.message) {
            throw new Error(json.error.message);
        }
        return json;
    });
};


const sessions = {};

const findOrCreateSession = (fbid) => {
    let sessionId;
    Object.keys(sessions).forEach(k => {
        if (sessions[k].fbid === fbid) {
            sessionId = k;
        }
    });
    if (!sessionId) {
        sessionId = new Date().toISOString();
        sessions[sessionId] = {fbid: fbid, context: {}};
    }
    return sessionId;
};


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
    send({sessionId}, {text}) {
        const recipientId = sessions[sessionId].fbid;
        if (recipientId) {
            return fbMessage(recipientId, text)
            .then(() => null)
            .catch((err) => {
                console.error(
                    'Oops! An error occurred while forwarding the response to',
                    recipientId,
                    ':',
                    err.stack || err
                );
            });
        } else {
            console.error('Oops! Couldn\'t find user for session:', sessionId);
            return Promise.resolve();
        }
    },
    getRecTimes({context, entities}) {
        return new Promise(function(resolve, reject) {
            var date = firstEntityValue(entities, "datetime");
            var sport = firstEntityValue(entities, "sport");
            if (sport) {
                context.sport = sport;
            }
            if (date) {
                calendarRequest.requestTimes(date).then(function(response) {
                    context.times = calendarRequest.generateRecTimes(response.data.items, context.sport);
                    delete context.missingDate;
                    return resolve(context);
                }).catch(function(error) {
                    console.log(error);
                });
            } else {
                context.missingDate = true;
                delete context.times;
                return resolve(context);
            }
        });

    },

    getGymTimes({context, entities}) {
        return new Promise(function(resolve, reject) {
            var date = firstEntityValue(entities, "datetime");
            if (date) {
                calendarRequest.requestTimes(date).then(function(response) {
                    context.times = calendarRequest.generateOpenGymTimes(response.data.items);
                    delete context.missingDate;
                    return resolve(context);
                }).catch(function(error) {
                    console.log(error);
                });
            } else {
                context.missingDate = true;
                delete context.times;
                return resolve(context);
            }
        });
    }
};

const wit = new Wit({
    accessToken: WIT_TOKEN,
    actions,
    logger: new log.Logger(log.INFO)
});



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
});


app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});


app.post('/webhook', (req, res) => {
    const data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && !event.message.is_echo) {
                    const sender = event.sender.id;

                    const sessionId = findOrCreateSession(sender);

                    const {text, attachments} = event.message;

                    if (attachments) {
                        fbMessage(sender, 'Sorry I can only process text messages for now.')
                        .catch(console.error);
                    } else if (text) {
                        wit.runActions(
                            sessionId,
                            text,
                            sessions[sessionId].context
                        ).then((context) => {
                            console.log('Waiting for next user messages');
                            sessions[sessionId].context = context;
                        })
                        .catch((err) => {
                            console.error('Oops! Got an error from Wit: ', err.stack || err);
                        })
                    }
                } else if (event.postback && event.postback.payload) {
                    fbMessage(sender, "Hey man!!");
                } else {
                    console.log('received event', JSON.stringify(event));
                }
            });
        });
    }
    res.sendStatus(200);
});

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});
