const { assert } = require('chai');
const { OrderedMap } = require('immutable');

const {
    createTimesMap, getCurrieSchedule, getFreeTimes, getResponse,
} = require('../calendar/facilities');

/* eslint-env node, mocha */

describe('createTimesMap function', () => {
    const timesMap = createTimesMap(new OrderedMap({}), 6, 23);
    it('should return a map with 204 entries', () => {
        assert.equal(timesMap.size, 204);
    });
    it('should have a first entry of 6:00, and a last entry of 21:55', () => {
        const firstEntry = timesMap.keySeq().first();
        const lastEntry = timesMap.keySeq().last();
        assert.equal(firstEntry, '06:00');
        assert.equal(lastEntry, '22:55');
    });
    it('should default all times to false', () => {
        const newMap = timesMap.filter(time => time);
        assert.equal(newMap.size, 0);
    });
});

describe('functions that depend on array of events', () => {
    const testEventsArray = [
        {
            summary: 'Varsity Basketball Redmen (Gyms 1 & 2)',
            start: { dateTime: '2017-09-18T18:30:00-04:00' },
            end: { dateTime: '2017-09-18T20:30:00-04:00' },
        },
        {
            summary: 'Varsity Basketball Redmen (Gyms 3 & 4)',
            start: { dateTime: '2017-09-18T15:30:00-04:00' },
            end: { dateTime: '2017-09-18T16:30:00-04:00' },
        },
        {
            summary: 'Varsity Basketball Redmen (Gym 1/2)',
            start: { dateTime: '2017-09-18T10:30:00-04:00' },
            end: { dateTime: '2017-09-18T12:30:00-04:00' },
        },
        {
            summary: 'Varsity Basketball Redmen (Gym 3 & 4)',
            start: { dateTime: '2017-09-18T8:30:00-04:00' },
            end: { dateTime: '2017-09-18T10:30:00-04:00' },
        },
        {
            summary: 'Varsity Basketball Redmen (Gym 3 & 4)',
            start: { dateTime: '2017-09-18T10:30:00-04:00' },
            end: { dateTime: '2017-09-18T11:30:00-04:00' },
        },
    ];
    describe('generateCurrieSchedule function', () => {
        it('should correctly place events in correct place and in the correct order depending on summary', () => {
            const { events12, events34 } = getCurrieSchedule(testEventsArray);
            assert.equal(events12.get(0), 'Varsity Basketball Redmen (Gyms 1 & 2)');
            assert.equal(events12.get(1), 'Varsity Basketball Redmen (Gym 1/2)');
            assert.equal(events34.get(0), 'Varsity Basketball Redmen (Gyms 3 & 4)');
            assert.equal(events34.get(1), 'Varsity Basketball Redmen (Gym 3 & 4)');
        });
    });

    describe('getFreeTimes function', () => {
        it('should correctly set time slots to true in the timesMap if events are occuring', () => {
            const timesMap = createTimesMap(new OrderedMap({}), 6, 23);
            const newTimesMap = getFreeTimes(timesMap, testEventsArray);
            assert.equal(newTimesMap.get('18:45'), true);
            assert.equal(newTimesMap.get('16:00'), true);
            assert.equal(newTimesMap.get('10:30'), true);
        });
    });
});

describe('getResponse function', () => {
    it('should correctly generate intervals based on timeMap', () => {
        const timesMap = createTimesMap(new OrderedMap({}), 6, 23)
            .set('16:00', true).set('16:05', true).set('16:10', true);
        const res = getResponse(timesMap, 'fieldhouse');
        assert.equal(res, '06:00-16:00, 16:15-22:55');
    });
});
