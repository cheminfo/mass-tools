'use strict';

var PEP = require('..');

describe('Generate peptide fragments default options', () => {
  var result = PEP.generatePeptideFragments('HAlaGlySerOH');
  test('Check array and length', () => {
    expect(result).toHaveLength(4);
  });
  test('Check first value', () => {
    expect(result).toHaveProperty('0', 'HAla(+1)$b1');
  });
});

describe('Generate non natural peptide fragments default options', () => {
  var result = PEP.generatePeptideFragments('HAla(H-1Ph)Gly(Ts)SerOH');
  test('Check array and length', () => {
    expect(result).toHaveLength(4);
  });
  test('Check first value', () => {
    expect(result).toHaveProperty('0', 'HAla(H-1Ph)(+1)$b1');
  });
});

describe('Generate peptide fragments all fragments', () => {
  var result = PEP.generatePeptideFragments('HAlaGlySerOH', {
    a: true,
    b: true,
    c: true,
    x: true,
    y: true,
    z: true
  });
  test('Check array and length', () => {
    expect(result).toHaveLength(12);
  });
});

describe('Check isoelectric point - One point', () => {
  var result = PEP.calculateIEP('HAlaGlySerLysLysHisOH');
  test('Check single point result', () => {
    expect(result).toBe(10.744);
  });
});

describe('Check isoelectric point - One point', () => {
  var result = PEP.calculateIEPChart('HAlaGlySerLysLysHisOH');
  test('Check y array and length', () => {
    expect(result.y).toHaveLength(1401);
  });
  test('Check yAbs array and length', () => {
    expect(result.yAbs).toHaveLength(1401);
  });
});

describe('Check isoelectric point - Get Color', () => {
  var result = PEP.getColorForIEP(4);
  expect(result).toBe('rgb(105,105,255)');
});

describe('Check isoelectric point - Get charge', () => {
  var result = PEP.calculateCharge('HAlaGlySerLysLysHisOH', 2.0);
  expect(result).toBe(3.334);
});
