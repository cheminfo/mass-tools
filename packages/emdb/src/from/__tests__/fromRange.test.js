'use strict';

const DBManager = require('../..');

describe('fromRange', () => {
  it('no filter', async () => {
    let dbManager = new DBManager();
    await dbManager.fromRange('C1-10, H1-10; Cl0-1 Br0-1');
    expect(dbManager.databases.generated).toHaveLength(80);
  });

  it('with charge', async () => {
    let dbManager = new DBManager();
    await dbManager.fromRange('C1-10 H1-10 (-)');
    expect(dbManager.databases.generated[0].charge).toBe(-1);
  });

  it('Filter callback', async () => {
    let dbManager = new DBManager();
    await dbManager.fromRange('C0-4 H0-4', {
      filter: {
        callback: (entry) => entry.atoms.C - entry.atoms.H === 0,
      },
    });
    expect(dbManager.databases.generated).toHaveLength(4);
  });
});
