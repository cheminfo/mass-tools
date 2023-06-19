import { compoundsFromMF } from '../compoundsFromMF';

describe('compoundsFromMF', () => {
  it('simple case', async () => {
    let data = await compoundsFromMF("C5H10", {});
    const entry = data.filter(datum => datum.data.iupac === 'pentane')[0]
    expect(entry.data.title).toBe('(1,5-Pentanediyl)radical')
  });
});
