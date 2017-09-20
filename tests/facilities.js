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
            etag: '"2994734951450000"',
            id: 'g9eofppufeekkrmq5ijai59ih8',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=Zzllb2ZwcHVmZWVra3JtcTVpamFpNTlpaDggYXRobGV0aWNzbWNnaWxsQG0',
            created: '2017-06-13T15:24:23.000Z',
            updated: '2017-06-13T15:24:35.725Z',
            summary: 'Practice Varsity Basketball Redmen (Gyms 3 & 4)',
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
                dateTime: '2017-09-21T07:00:00-04:00',
            },
            end: {
                dateTime: '2017-09-21T09:00:00-04:00',
            },
            iCalUID: 'g9eofppufeekkrmq5ijai59ih8@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2994936674500000"',
            id: 'fnojkq2e60js36g0629u71tf38_20170921T140500Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=Zm5vamtxMmU2MGpzMzZnMDYyOXU3MXRmMzhfMjAxNzA5MjFUMTQwNTAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-06-14T19:25:37.000Z',
            updated: '2017-06-14T19:25:37.250Z',
            summary: 'EDKP 204 (Gyms 1 & 2)',
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
                dateTime: '2017-09-21T10:05:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-21T10:55:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: 'fnojkq2e60js36g0629u71tf38',
            originalStartTime: {
                dateTime: '2017-09-21T10:05:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: 'fnojkq2e60js36g0629u71tf38@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"3010813253012000"',
            id: '1o09bdssbsifv0k6so9b3tb2mb_20170921T160000Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=MW8wOWJkc3Nic2lmdjBrNnNvOWIzdGIybWJfMjAxNzA5MjFUMTYwMDAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-09-14T16:30:26.000Z',
            updated: '2017-09-14T16:30:26.506Z',
            summary: 'Lotto Quebec (Gym 1-Basketball)',
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
                dateTime: '2017-09-21T12:00:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-21T13:00:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: '1o09bdssbsifv0k6so9b3tb2mb',
            originalStartTime: {
                dateTime: '2017-09-21T12:00:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: '1o09bdssbsifv0k6so9b3tb2mb@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2995249457418000"',
            id: 'a9gvkubs5l3jj7bo74clhl870c_20170921T180500Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=YTlndmt1YnM1bDNqajdibzc0Y2xobDg3MGNfMjAxNzA5MjFUMTgwNTAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-06-16T14:52:08.000Z',
            updated: '2017-06-16T14:52:08.709Z',
            summary: 'EDKP 223 (Gyms 1 & 2)',
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
                dateTime: '2017-09-21T14:05:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-21T15:55:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: 'a9gvkubs5l3jj7bo74clhl870c',
            originalStartTime: {
                dateTime: '2017-09-21T14:05:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: 'a9gvkubs5l3jj7bo74clhl870c@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2994735014390000"',
            id: 'ner2q2ks9thmbs9aa11u22botg',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=bmVyMnEya3M5dGhtYnM5YWExMXUyMmJvdGcgYXRobGV0aWNzbWNnaWxsQG0',
            created: '2017-06-13T15:25:07.000Z',
            updated: '2017-06-13T15:25:07.195Z',
            summary: 'Practice Varsity Volleyball Martlet (Gyms 1 & 2)',
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
                dateTime: '2017-09-21T16:00:00-04:00',
            },
            end: {
                dateTime: '2017-09-21T18:30:00-04:00',
            },
            iCalUID: 'ner2q2ks9thmbs9aa11u22botg@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2994735065950000"',
            id: 'lso7gt8eim7atg56gm7msp17q0',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=bHNvN2d0OGVpbTdhdGc1NmdtN21zcDE3cTAgYXRobGV0aWNzbWNnaWxsQG0',
            created: '2017-06-13T15:25:32.000Z',
            updated: '2017-06-13T15:25:32.975Z',
            summary: 'Practice Varsity Basketball Redmen (Gyms 3 & 4)',
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
                dateTime: '2017-09-21T16:30:00-04:00',
            },
            end: {
                dateTime: '2017-09-21T18:30:00-04:00',
            },
            iCalUID: 'lso7gt8eim7atg56gm7msp17q0@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2992518274680000"',
            id: 'jbqmpg8fnesm450ik9mamnoqbk_20170921T223000Z',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=amJxbXBnOGZuZXNtNDUwaWs5bWFtbm9xYmtfMjAxNzA5MjFUMjIzMDAwWiBhdGhsZXRpY3NtY2dpbGxAbQ',
            created: '2017-05-31T19:32:17.000Z',
            updated: '2017-05-31T19:32:17.340Z',
            summary: 'Gym 1 & 2- Varsity Badminton',
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
                dateTime: '2017-09-21T18:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: '2017-09-21T21:00:00-04:00',
                timeZone: 'America/Toronto',
            },
            recurringEventId: 'jbqmpg8fnesm450ik9mamnoqbk',
            originalStartTime: {
                dateTime: '2017-09-21T18:30:00-04:00',
                timeZone: 'America/Toronto',
            },
            iCalUID: 'jbqmpg8fnesm450ik9mamnoqbk@google.com',
            sequence: 0,
        },
        {
            kind: 'calendar#event',
            etag: '"2994735135472000"',
            id: 'si457n7tip1hclm33er75sfaco',
            status: 'confirmed',
            htmlLink: 'https://www.google.com/calendar/event?eid=c2k0NTduN3RpcDFoY2xtMzNlcjc1c2ZhY28gYXRobGV0aWNzbWNnaWxsQG0',
            created: '2017-06-13T15:26:07.000Z',
            updated: '2017-06-13T15:26:07.736Z',
            summary: 'Practice Varsity Basketball Martlet (Gyms 3 & 4)',
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
                dateTime: '2017-09-21T18:30:00-04:00',
            },
            end: {
                dateTime: '2017-09-21T20:30:00-04:00',
            },
            iCalUID: 'si457n7tip1hclm33er75sfaco@google.com',
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
