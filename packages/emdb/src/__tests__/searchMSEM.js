'use strict';

const DBManager = require('..');

describe('test searchMSEM', () => {
  it('should filter one database with existing ionization', async () => {
    let dbManager = new DBManager();
    await dbManager.loadContaminants();

    let results = dbManager.searchMSEM(101, {
      filter: {
        precision: 1000
      }
    });

    expect(results.contaminants).toHaveLength(4);
  });

  it('should filter one database with proposed ionization', async () => {
    let dbManager = new DBManager();
    await dbManager.loadContaminants();

    let results = dbManager.searchMSEM(101, {
      ionizations: 'H+',
      filter: {
        precision: 1000
      }
    });
    expect(results.contaminants).toHaveLength(4);
  });

  it('should filter one database with forced ionization', async () => {
    let dbManager = new DBManager();
    await dbManager.loadContaminants();

    let results = dbManager.searchMSEM(101, {
      ionizations: 'H+',
      filter: {
        precision: 1000,
        forceIonization: true
      }
    });

    expect(results.contaminants).toHaveLength(3);
  });
});
