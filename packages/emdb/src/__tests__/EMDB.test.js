import { EMDB } from '..';

test('EMDB contaminants and knapSack', async () => {
  let emdb = new EMDB();

  await emdb.loadContaminants();
  await emdb.loadKnapSack();

  expect(emdb.listDatabases()).toStrictEqual(['contaminants', 'knapSack']);
  expect(emdb.get('contaminants').length).toBeGreaterThan(1000);
}, 30000);

test('EMDB fromMonoisotopicMass', async () => {
  let emdb = new EMDB();

  await emdb.fromMonoisotopicMass(300, { ionizations: 'H+,Na+' });

  expect(emdb.listDatabases()).toStrictEqual(['monoisotopic']);
  expect(emdb.get('monoisotopic').length).toBeGreaterThan(100);
});

test('EMDB MFParser', () => {
  let MFParser = EMDB.MFParser;

  let mf = new MFParser.MF('C10H20');
  expect(mf.getInfo()).toStrictEqual({
    mass: 140.26617404846803,
    monoisotopicMass: 140.1565006446,
    charge: 0,
    mf: 'C10H20',
    atoms: { C: 10, H: 20 },
    unsaturation: 1,
  });
});

test('EMDB IsotopicDistribution', () => {
  let IsotopicDistribution = EMDB.IsotopicDistribution;

  let distribution = new IsotopicDistribution('C10');
  let result = distribution.getXY();
  expect(result.x[0]).toBe(120);
  expect(result.y[0]).toBe(100);
});
