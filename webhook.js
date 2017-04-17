'use strict';
const PAGE_ACCESS_TOKEN = "EAAUEZA7z5fc4BAIXFXyFJaNXSCN3rVjdfgYQzMIs2qfsjCwEhuCEB8hIZB2t3URhg8L1wHIgNvqkZBzNR1GlZAZCM8i1z978e686FGVZBNAnFLuzyogJrMqZCwHkpGdZCtqGoINs9lfuX04NUzc4KKZCPZCqMq0HcqQVrIZAWyVQc82sgZDZD";
const APIAI_TOKEN = "2b6ae2b94c1c440e9045cde556ced1f5";

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const apiaiApp = apiai(APIAI_TOKEN);


app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'verified') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});


app.post('/webhook', (req, res) => {
    console.log('/webhook ran');
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    sendMessage(event);
                }
            });
        });
        res.status(200).end();
    }
});


function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;

    let apiai = apiaiApp.textRequest(text, {
        sessionId: 'hoop_time'
    });

    apiai.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;

        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: {text: aiText}
            }
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
}


app.post('/ai', (req, res) => {
    console.log('ai ran');
    let msg = "hiiii";
    return res.json({
        speech: msg,
        displayText: msg,
        source: 'weather'
    });
});
