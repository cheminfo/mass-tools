'use strict';

const capitalizeMF = require('../capitalizeMF');

const tests = [
  ['triethylamine', 'triethylamine'],
  ['ac1234', 'ac1234'],
  ['CDCl3', 'CDCl3'],
  ['CdCl2', 'CdCl2'],
  ['kmno4', 'KMnO4'],
  ['cdcl3', 'CDCl3'],
  ['na2co3', 'Na2CO3'],
  ['h2so4', 'H2SO4'],
  ['Et3N', 'Et3N'],
  ['h2o', 'H2O'],
  ['ch2cl2', 'CH2Cl2'],
  ['ch3cl', 'CH3Cl'],
  ['ccl4', 'CCl4'],
  ['chcl3', 'CHCl3'],
  ['co2', 'CO2'],
];

describe('capitalizeMF', () => {
  it.each(tests)('%s', (mf, value) => {
    expect(capitalizeMF(mf)).toBe(value);
  });
});
