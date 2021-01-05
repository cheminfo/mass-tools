'use strict';

const DBManager = require('..');

describe('fromArray', () => {
  it('using an array of string', () => {
    let dbManager = new DBManager();
    dbManager.fromArray(['C.N', 'N.O']);
    expect(dbManager.databases.generated).toHaveLength(4);
  });

  it('with ranges and group', () => {
    let dbManager = new DBManager();
    dbManager.fromArray(['(CH2)0-2N0-1', 'O0-1']);
    expect(dbManager.databases.generated).toHaveLength(12);
    let mfs = dbManager.databases.generated.map((entry) => entry.mf).sort();
    expect(mfs).toStrictEqual([
      '',
      'C2H4',
      'C2H4N',
      'C2H4NO',
      'C2H4O',
      'CH2',
      'CH2N',
      'CH2NO',
      'CH2O',
      'N',
      'NO',
      'O',
    ]);
  });

  it('with callback filter', () => {
    let dbManager = new DBManager();
    dbManager.fromArray(['C0-100', 'H0-100'], {
      filter: {
        callback: (entry) => entry.atoms.C === entry.atoms.H,
      },
    });
    expect(dbManager.databases.generated).toHaveLength(101);
  });

  it('using an array or array', () => {
    let dbManager = new DBManager();
    dbManager.fromArray(['C.N', ['Cl0-1', 'Br0-1']]);
    let result = dbManager
      .get('generated')
      .map((entry) => entry.mf)
      .sort()
      .join();
    expect(result).toBe('BrN,C,CBr,CCl,ClN,N');
  });
});
