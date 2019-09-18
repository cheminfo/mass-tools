'use strict';

const isMF = require('../isMF');

const tests = [
  ['triethylamine', false],
  ['ac1234', false],
  ['aco2', false],
  ['CDCl3', true],
  ['CdCl2', true],
  ['kmno4', false],
  ['cdcl3', false],
  ['na2co3', false],
  ['h2so4', false],
  ['Et3N', true],
  ['N(CH2CH3)3', true],
  ['Et4N+.Cl-', true],
  ['h2o', false],
  ['ch2cl2', false],
  ['ch3cl', false],
  ['ccl4', false],
  ['chcl3', false],
  ['co2', false],
];

describe('isMF', () => {
  it.each(tests)('%s', (mf, value) => {
    expect(isMF(mf)).toBe(value);
  });
});
