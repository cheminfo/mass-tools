'use strict';

var mfFromSheet = require('..');

// The original document is on: https://docs.google.com/spreadsheets/d/15Kuc5MeOhvm4oeTMvEuP1rWdRFiVWosxXhYwAmuf3Uo/edit#gid=0
test('Test getReferenceList with existing', async () => {
    var result = await mfFromSheet('https://googledocs.cheminfo.org/spreadsheets/d/15Kuc5MeOhvm4oeTMvEuP1rWdRFiVWosxXhYwAmuf3Uo/export?format=tsv');
    expect(result.length).toBeGreaterThan(1200);
    expect(result[0].em).toBeCloseTo(22.0782503207, 5);
});

test('Test getReferenceList with non existing document', async () => {
    var result = await mfFromSheet('https://googledocs.cheminfo.org/spreadsheets/d/15Kuc5MeOhvm4xxxVWosxXhYwAmuf3Uo/export?format=tsv');

    // error.response.status.should.equal(404);

});
