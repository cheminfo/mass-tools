import { EMDB } from '../..';

describe('fromRange', () => {
  it('no filter', async () => {
    let emdb = new EMDB();
    await emdb.fromRange('C1-10, H1-10; Cl0-1 Br0-1');
    expect(emdb.databases.generated).toHaveLength(80);
  });

  it('with charge', async () => {
    let emdb = new EMDB();
    await emdb.fromRange('C1-10 H1-10 (-)');
    expect(emdb.databases.generated[0].charge).toBe(-1);
  });

  it('Filter callback', async () => {
    let emdb = new EMDB();
    await emdb.fromRange('C0-4 H0-4', {
      filter: {
        callback: (entry) => entry.atoms.C - entry.atoms.H === 0,
      },
    });
    expect(emdb.databases.generated).toHaveLength(4);
  });
});
