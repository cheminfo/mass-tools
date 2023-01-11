import { EMDB } from '..';

jest.setTimeout(30000);

describe('test search', () => {
  it('should filter one database', async () => {
    let emdb = new EMDB();
    await emdb.loadContaminants();

    let results = emdb.search({
      minEM: 100.123,
      maxEM: 140,
    });
    expect(results.contaminants).toHaveLength(30);
  });

  it('should yield a flatten database', async () => {
    let emdb = new EMDB();
    await emdb.loadContaminants();

    let results = emdb.search(
      {
        minEM: 100.123,
        maxEM: 140,
      },
      {
        flatten: true,
      },
    );
    expect(results).toHaveLength(30);
    expect(results[0].database).toBe('contaminants');
  });
});
