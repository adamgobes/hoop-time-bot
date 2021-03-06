
const PAGE_ACCESS_TOKEN = 'EAAUEZA7z5fc4BAIXFXyFJaNXSCN3rVjdfgYQzMIs2qfsjCwEhuCEB8hIZB2t3URhg8L1wHIgNvqkZBzNR1GlZAZCM8i1z978e686FGVZBNAnFLuzyogJrMqZCwHkpGdZCtqGoINs9lfuX04NUzc4KKZCPZCqMq0HcqQVrIZAWyVQc82sgZDZD';
const APIAI_TOKEN = '2b6ae2b94c1c440e9045cde556ced1f5';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

const {
	getFacilityTimes, requestTimes, getRecTimes, getNearestRec,
} = require('./calendar');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
	console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const apiaiApp = apiai(APIAI_TOKEN);


app.get('/', (req, res) => {
	res.send('Hello, this is the server for the HoopTime chat bot');
});


app.get('/webhook', (req, res) => {
	if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'verified') {
		res.status(200).send(req.query['hub.challenge']);
	} else {
		res.status(403).end();
	}
});


app.post('/webhook', (req, res) => {
	if (req.body.object === 'page') {
		req.body.entry.forEach((entry) => {
			entry.messaging.forEach((event) => {
				if (event.message && event.message.text) {
					sendMessage(event);
				} else if (event.postback) {
					const getStartedMsg = `
					Hey! I'm the HoopTime bot. I can tell you almost anything about the athletic facilities at McGill such as when the Currie Gymnasium and Fieldhouse are open, or even when you can play recreational sports. Ask me questions like 'when is the nearest time I can play basketball?' or 'when is the gym open today?`;
					request({
						url: 'https://graph.facebook.com/v2.6/me/messages',
						qs: { access_token: PAGE_ACCESS_TOKEN },
						method: 'POST',
						json: {
							recipient: { id: event.sender.id },
							message: { text: getStartedMsg },
						},
					}, (error, response) => {
						if (error) {
							console.log('Error sending message: ', error);
						} else if (response.body.error) {
							console.log('Error: ', response.body.error);
						}
					});
				}
			});
		});
		res.status(200).end();
	}
});


function sendMessage(event) {
	const sender = event.sender.id;
	const text = event.message.text;

	const apiai = apiaiApp.textRequest(text, {
		sessionId: 'hoop_time',
	});

	apiai.on('response', (response) => {
		const aiText = response.result.fulfillment.speech;

		request({
			url: 'https://graph.facebook.com/v2.6/me/messages',
			qs: { access_token: PAGE_ACCESS_TOKEN },
			method: 'POST',
			json: {
				recipient: { id: sender },
				message: { text: aiText },
			},
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
	switch (req.body.result.action) {
		case 'find_rec': {
			const { date, sport } = req.body.result.parameters;
			return requestTimes(date, sport, date).then((response) => {
				const msg = getRecTimes(response.data.items, sport);
				return res.json({
					speech: msg,
					displayText: msg,
					source: 'rec',
				});
			}).catch((err) => {
				console.log(err);
			});
		}
		case 'find_gym': {
			const { date, facility } = req.body.result.parameters;
			return requestTimes(date, facility, date).then((response) => {
				const msg = getFacilityTimes(response.data.items, facility);
				return res.json({
					speech: msg,
					displayText: msg,
					source: 'rec',
				});
			}).catch((err) => {
				console.log(err);
			});
		}
		case 'find_nearest_rec': {
			const { sport } = req.body.result.parameters;
			const today = new Date();
			const month = new Date().setMonth(today.getMonth() + 1);
			return requestTimes(today, sport, month).then((response) => {
				const msg = getNearestRec(response.data.items, sport);
				return res.json({
					speech: msg,
					displayText: msg,
					source: 'rec',
				});
			});
		}
		default: {
			const msg = 'Sorry I could not retrieve the information you requested';
			return res.json({
				msg,
				displayText: msg,
			});
		}
	}
});
