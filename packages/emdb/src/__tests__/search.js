'use strict';

const DBManager = require('..');

describe('test search', () => {
    it('should filter one database', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();

        let results = dbManager.search({
            minEM: 100.123,
            maxEM: 140
        });
        expect(results.contaminants).toHaveLength(31);
    });

    it('should yield a flatten database', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();

        let results = dbManager.search(
            {
                minEM: 100.123,
                maxEM: 140
            },
            {
                flatten: true
            }
        );
        expect(results).toHaveLength(31);
        expect(results[0].database).toBe('contaminants');
    });
});
