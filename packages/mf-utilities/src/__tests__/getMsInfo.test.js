import { expect, test } from 'vitest';

import { getMsInfo } from '../getMsInfo';

test('getMsInfo', () => {
  let mf = {
    mf: 'C10',
    em: 120,
    charge: 0,
  };

  expect(getMsInfo(mf).ms).toMatchObject({
    ionization: '',
    em: 0,
    charge: 0,
  });

  expect(getMsInfo(mf, { allowNeutralMolecules: true }).ms).toMatchObject({
    ionization: '',
    em: 120,
    charge: 0,
  });

  expect(
    getMsInfo(mf, { ionization: { mf: 'H+', charge: 1, em: 1 } }).ms,
  ).toMatchObject({
    ionization: 'H+',
    em: 120.99945142009094,
    charge: 1,
  });
});

test('getMsInfo with targetMass', () => {
  let mf = {
    mf: 'C10',
    em: 120,
    charge: 0,
  };

  expect(
    getMsInfo(mf, {
      allowNeutralMolecules: true,
      targetMass: 120,
    }).ms,
  ).toMatchObject({
    ionization: '',
    em: 120,
    charge: 0,
    ppm: 0,
    delta: 0,
  });

  expect(
    getMsInfo(mf, {
      ionization: { mf: 'H+', charge: 1, em: 1 }, // we use one as exact mass to test
      targetMass: 121,
    }).ms,
  ).toMatchObject({
    ionization: 'H+',
    em: 120.99945142009094,
    charge: 1,
    ppm: 4.533738811429821,
    delta: 0.0005485799090649834,
  });
});
