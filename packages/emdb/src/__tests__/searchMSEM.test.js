import { EMDB } from '..';

describe('test searchMSEM', () => {
  it('should filter one database with existing ionization', async () => {
    let emdb = new EMDB();
    await emdb.loadContaminants();

    let results = emdb.searchMSEM(101, {
      filter: {
        precision: 1000,
      },
    });

    expect(results.contaminants).toHaveLength(4);
  });

  it('should filter one database with proposed ionization', async () => {
    let emdb = new EMDB();
    await emdb.loadContaminants();

    let results = emdb.searchMSEM(101, {
      ionizations: 'H+',
      filter: {
        precision: 1000,
      },
    });
    expect(results.contaminants).toHaveLength(4);
  });

  it('should filter one database with forced ionization', async () => {
    let emdb = new EMDB();
    await emdb.loadContaminants();

    let results = emdb.searchMSEM(101, {
      ionizations: 'H+',
      filter: {
        precision: 1000,
        forceIonization: true,
      },
    });

    expect(results.contaminants).toHaveLength(3);
  });
});
