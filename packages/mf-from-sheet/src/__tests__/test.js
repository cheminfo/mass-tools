'use strict';

var mfFromSheet = require('..');

test('Test getReferenceList with existing', async () => {
    var result = await mfFromSheet('https://googledocs.cheminfo.org/spreadsheets/d/15Kuc5MeOhvm4oeTMvEuP1rWdRFiVWosxXhYwAmuf3Uo/export?format=tsv');

    result.length.should.be.equal(1200);
    result[0].em.should.be.approximately(22.0782503207, 0.00001);
});

test('Test getReferenceList with non existing document', async () => {
    var result = await mfFromSheet('https://googledocs.cheminfo.org/spreadsheets/d/15Kuc5MeOhvm4xxxVWosxXhYwAmuf3Uo/export?format=tsv');

    // error.response.status.should.equal(404);

});
