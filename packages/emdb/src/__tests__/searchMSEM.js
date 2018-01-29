'use strict';

const DBManager = require('..');

describe('test searchMSEM', () => {
    it('should filter one database with existing modification', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();

        let results = dbManager.searchMSEM(101, {
            precision: 100000
        });
        expect(results.contaminants).toHaveLength(4);
    });

    it('should filter one database with proposed modification', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();

        let results = dbManager.searchMSEM(101, {
            precision: 100000,
            modifications: 'H+'
        });
        expect(results.contaminants).toHaveLength(4);
    });

    it.only('should filter one database with forced modification', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();

        let results = dbManager.searchMSEM(101, {
            precision: 100000,
            modifications: 'H+',
            forceModification: true
        });
        expect(results.contaminants).toHaveLength(4);
        //  console.log(results);
    });

});
