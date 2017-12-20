'use strict';

var mfFromGoogleSheet = require('..');

// The original document is on: https://docs.google.com/spreadsheets/d/15Kuc5MeOhvm4oeTMvEuP1rWdRFiVWosxXhYwAmuf3Uo/edit#gid=0
test('Test getReferenceList with existing', async () => {
    var result = await mfFromGoogleSheet('https://googledocs.cheminfo.org/spreadsheets/d/15Kuc5MeOhvm4oeTMvEuP1rWdRFiVWosxXhYwAmuf3Uo/export?format=tsv');
    expect(result.length).toBe(1684);
    expect(result[0].em).toBeCloseTo(5.95304980662, 5);
    expect(result[0].msem).toBeCloseTo(5.95250122671093, 5);
});

test('Test getReferenceList with non existing document', () => {
    return expect(mfFromGoogleSheet('https://googledocs.cheminfo.org/spreadsheets/d/15Kuc5MeOhvm4xxxVWosxXhYwAmuf3Uo/export?format=tsv')).rejects.toThrow('404');
});
