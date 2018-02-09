'use strict';

const DBManager = require('..');

describe('test searchSimilarity', () => {
    it('should filter one database with existing ionization', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();
        let results = dbManager.searchSimilarity(101, { x: [], y: [] }, {
            precision: 1000
        });

        expect(results.contaminants).toHaveLength(4);
    });
});
