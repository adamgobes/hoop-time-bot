const { assert } = require('chai');
const { filter, getRecTimes } = require('../calendar/rec');

/* eslint-env node, mocha */

describe('rec functions', () => {
    const sport = 'basketball';
    const events = [
        {
            summary: 'Practice Varsity Basketball Redmen (Gyms 3 & 4)',
            start: {
                dateTime: '2017-09-21T07:00:00-04:00',
            },
            end: {
                dateTime: '2017-09-21T09:00:00-04:00',
            },
        },
        {
            summary: 'Rec Basketball - Gyms 1 and 2',
            start: {
                dateTime: '2017-09-21T07:00:00-04:00',
            },
            end: {
                dateTime: '2017-09-21T09:00:00-04:00',
            },
        },
        {
            summary: 'Lotto Quebec (Gym 1-Basketball)',
            start: {
                dateTime: '2017-09-21T07:00:00-04:00',
            },
            end: {
                dateTime: '2017-09-21T09:00:00-04:00',
            },
        },
    ];
    describe('filter function', () => {
        it('should filter events properly', () => {
            const filteredList = filter(events, sport);
            assert.equal(filteredList.size, 1);
            assert.equal(filteredList.get(0).summary, 'Rec Basketball - Gyms 1 and 2');
        });
    });

    describe('getRecTimes function', () => {
        it('should return the correct times', () => {
            const times = getRecTimes(filter(events, sport), sport);
            assert.equal(times, 'The available times I found to play basketball are 7:00-9:00');
        });
    });
});
