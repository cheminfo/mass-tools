'use strict';

const DBManager = require('..');

describe('test searchMSEM', () => {
    it('should filter one database with existing ionization', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();

        let results = dbManager.searchMSEM(101, {
            precision: 100000
        });
        expect(results.contaminants).toHaveLength(4);
    });

    it('should filter one database with proposed ionization', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();

        let results = dbManager.searchMSEM(101, {
            precision: 100000,
            ionizations: 'H+'
        });
        expect(results.contaminants).toHaveLength(4);
    });

    it('should filter one database with forced ionization', async () => {
        let dbManager = new DBManager();
        await dbManager.loadContaminants();

        let results = dbManager.searchMSEM(101, {
            precision: 100000,
            ionizations: 'H+',
            forceIonization: true
        });

        expect(results.contaminants).toHaveLength(3);
    });

});
