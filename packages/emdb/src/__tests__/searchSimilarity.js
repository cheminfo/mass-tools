'use strict';

const DBManager = require('..');

describe('test searchSimilarity', () => {
    it('should filter one database with existing ionization', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();
        let results = dbManager.searchSimilarity(101, { x: [101], y: [1] }, {
            precision: 1000,
            widthBottom: 0.05,
            widthTop: 0.01,
            common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
        });


        expect(results.contaminants).toMatchSnapshot();
    });
});
