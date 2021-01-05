'use strict';

const DBManager = require('..');

describe('fromRange', () => {
  it('no filter', () => {
    let dbManager = new DBManager();
    dbManager.fromRange('C1-10, H1-10; Cl0-1 Br0-1');
    expect(dbManager.databases.generated).toHaveLength(80);
  });

  it('Filter callback', function () {
    let dbManager = new DBManager();
    dbManager.fromRange('C0-4 H0-4', {
      filter: {
        callback: (entry) => {
          if (entry.atoms.C - entry.atoms.H === 0) return true;
          return false;
        },
      },
    });
    expect(dbManager.databases.generated).toHaveLength(4);
  });
});
