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
            kind: 'calendar#event',
            etag: '"2992518152098000"',
            id: '2ed149crppuefb101vgqip9q34_20170920T103000Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=MmVkMTQ5Y3JwcHVlZmIxMDF2Z3FpcDlxMzRfMjAxNzA5MjBUMTAzMDAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-05-31T19:31:16.000Z',
            updated: '2017-05-31T19:31:16.049Z',
            summary: 'Gym 1 & 2 - Varsity Badminton',
            creator: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            organizer: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            start: {
                dateTime: '2017-09-20T06:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-20T08:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: '2ed149crppuefb101vgqip9q34',
            originalStartTime: {
                dateTime: '2017-09-20T06:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: '2ed149crppuefb101vgqip9q34@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2993905191442000"',
            id: '3nt38kohor696mt4de711pm9vs',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=M250Mzhrb2hvcjY5Nm10NGRlNzExcG05dnMgYXRobGV0aWNzbWNnaWxsQG0',
            created: '2017-06-08T20:09:55.000Z',
            updated: '2017-06-08T20:09:55.721Z',
            summary: 'Varsity Basketball Redmen (Gyms 3 & 4)',
            creator: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            organizer: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            start: {
                dateTime: '2017-09-20T07:00:00-04:00',
            },
            end: {
                dateTime: '2017-09-20T09:00:00-04:00',
            },
            iCalUID: '3nt38kohor696mt4de711pm9vs@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2994936030350000"',
            id: 'q04096382cgbgrol5uk5decmbc_20170920T133500Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=cTA0MDk2MzgyY2diZ3JvbDV1azVkZWNtYmNfMjAxNzA5MjBUMTMzNTAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-06-14T19:20:15.000Z',
            updated: '2017-06-14T19:20:15.175Z',
            summary: 'EDKP 100 (Gyms 1 & 2)',
            creator: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            organizer: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            start: {
                dateTime: '2017-09-20T09:35:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-20T11:25:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: 'q04096382cgbgrol5uk5decmbc',
            originalStartTime: {
                dateTime: '2017-09-20T09:35:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: 'q04096382cgbgrol5uk5decmbc@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"3011676437416000"',
            id: '2cp1hmee57qbtiu8435g3hagdl_20170920T153000Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=MmNwMWhtZWU1N3FidGl1ODQzNWczaGFnZGxfMjAxNzA5MjBUMTUzMDAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-09-19T16:23:38.000Z',
            updated: '2017-09-19T16:23:38.708Z',
            summary: 'Redmen Basketball Practice - Gym 3&4',
            creator: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            organizer: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            start: {
                dateTime: '2017-09-20T11:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-20T13:00:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: '2cp1hmee57qbtiu8435g3hagdl',
            originalStartTime: {
                dateTime: '2017-09-20T11:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: '2cp1hmee57qbtiu8435g3hagdl@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"3007385087576000"',
            id: '697rq6qiph690arbc4ot0hn0l7_20170920T163000Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=Njk3cnE2cWlwaDY5MGFyYmM0b3QwaG4wbDdfMjAxNzA5MjBUMTYzMDAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-08-25T20:22:23.000Z',
            updated: '2017-08-25T20:22:23.788Z',
            summary: 'Staff Badminton Gym 1/2',
            creator: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            organizer: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            start: {
                dateTime: '2017-09-20T12:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-20T13:15:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: '697rq6qiph690arbc4ot0hn0l7',
            originalStartTime: {
                dateTime: '2017-09-20T12:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: '697rq6qiph690arbc4ot0hn0l7@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2994936829846000"',
            id: 'e1unc3gah5patnri550g7k9if0_20170920T170500Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=ZTF1bmMzZ2FoNXBhdG5yaTU1MGc3azlpZjBfMjAxNzA5MjBUMTcwNTAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-06-14T19:26:54.000Z',
            updated: '2017-06-14T19:26:54.923Z',
            summary: 'EDKP 223 (Gyms 3 & 4)',
            creator: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            organizer: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            start: {
                dateTime: '2017-09-20T13:05:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-20T14:55:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: 'e1unc3gah5patnri550g7k9if0',
            originalStartTime: {
                dateTime: '2017-09-20T13:05:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: 'e1unc3gah5patnri550g7k9if0@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"3009427670578000"',
            id: '2ubp6hlt6m9aieak48jg13tpko_20170920T200000Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=MnVicDZobHQ2bTlhaWVhazQ4amcxM3Rwa29fMjAxNzA5MjBUMjAwMDAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-06-08T19:19:37.000Z',
            updated: '2017-09-06T16:03:55.289Z',
            summary: 'Varsity Basketball Martlet (Gyms 3 & 4)',
            creator: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            organizer: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            start: {
                dateTime: '2017-09-20T16:00:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-20T19:00:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: '2ubp6hlt6m9aieak48jg13tpko',
            originalStartTime: {
                dateTime: '2017-09-20T16:00:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: '2ubp6hlt6m9aieak48jg13tpko@google.com',
            sequence: 2,
        },
        {
            kind: 'calendar#event',
            etag: '"2994734151498000"',
            id: 'r554ublgjj8dk23or082uokmv8',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=cjU1NHVibGdqajhkazIzb3IwODJ1b2ttdjggYXRobGV0aWNzbWNnaWxsQG0',
            created: '2017-06-13T15:17:55.000Z',
            updated: '2017-06-13T15:17:55.749Z',
            summary: 'Varsity Volleyball Martlet (Gyms 1 & 2)',
            creator: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            organizer: {
                email: 'athleticsmcgill@gmail.com',
                displayName: 'McGill Athletics',
                self: true,
            },
            start: {
                dateTime: '2017-09-20T16:00:00-04:00',
            },
            end: {
                dateTime: '2017-09-20T19:00:00-04:00',
            },
            iCalUID: 'r554ublgjj8dk23or082uokmv8@google.com',
            sequence: 0,
        },
    ];
    describe('generateCurrieSchedule function', () => {
        it('should correctly place events in correct place and in the correct order depending on summary', () => {
            const { events12, events34 } = getCurrieSchedule(testEventsArray);
            assert.equal(events12.get(0).summary, 'Varsity Basketball Redmen (Gyms 1 & 2)');
            assert.equal(events12.get(1).summary, 'Varsity Basketball Redmen (Gym 1/2)');
            assert.equal(events34.get(0).summary, 'Varsity Basketball Redmen (Gyms 3 & 4)');
            assert.equal(events34.get(1).summary, 'Varsity Basketball Redmen (Gym 3 & 4)');
        });
    });

    describe('getFreeTimes function', () => {
        it('should correctly set time slots to true in the timesMap if events are occuring', () => {
            const timesMap = createTimesMap(new OrderedMap({}), 6, 23);
            const { events12, events34 } = getCurrieSchedule(testEventsArray);
            const newTimesMap = getFreeTimes(timesMap, events12.toArray());
            assert.equal(newTimesMap.get('18:45'), true);
            assert.equal(newTimesMap.get('16:00'), true);
            assert.equal(newTimesMap.get('10:30'), true);
            assert.equal(newTimesMap.get('20:00'), false);
        });
    });
});

describe('getResponse function', () => {
    it('should correctly generate intervals based on timeMap', () => {
        const timesMap = createTimesMap(new OrderedMap({}), 6, 23)
        .set('16:00', true).set('16:05', true).set('16:10', true);
        const res = getResponse(timesMap, 'fieldhouse');
        assert.equal(res, '06:00-16:00, and 16:15-22:55');
    });
});
