const DBManager = require('..');

test('DBManager contaminants and knapSack', async () => {
  let dbManager = new DBManager();

  await dbManager.loadContaminants();
  await dbManager.loadKnapSack();

  expect(dbManager.listDatabases()).toStrictEqual(['contaminants', 'knapSack']);
  expect(dbManager.get('contaminants').length).toBeGreaterThan(1000);
}, 30000);

test('DBManager fromMonoisotopicMass', async () => {
  let dbManager = new DBManager();

  await dbManager.fromMonoisotopicMass(300, { ionizations: 'H+,Na+' });

  expect(dbManager.listDatabases()).toStrictEqual(['monoisotopic']);
  expect(dbManager.get('monoisotopic').length).toBeGreaterThan(100);
});

test('DBManager MFParser', () => {
  let MFParser = DBManager.MFParser;

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

test('DBManager IsotopicDistribution', () => {
  let IsotopicDistribution = DBManager.IsotopicDistribution;

  let distribution = new IsotopicDistribution('C10');
  let result = distribution.getXY();
  expect(result.x[0]).toBe(120);
  expect(result.y[0]).toBe(100);
});
