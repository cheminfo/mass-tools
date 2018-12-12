'use strict';

const matcher = require('../msemMatcher');

test('test msemMatcher', () => {
  let entry = {
    mf: 'C10',
    em: 120,
    msem: 0,
    charge: 0,
    unsaturation: 11,
    atoms: {
      C: 10
    },
  };


  expect(matcher(entry, { targetMass: 120, minCharge: 1 })).toBe(false);
  expect(matcher(entry, { targetMass: 120, maxCharge: -1 })).toBe(false);
  expect(matcher(entry, { targetMass: 120, ionization: { charge: 1, em: 0 }, atoms: {
    N: { min: 10, max: 20 }
  } })).toBe(false)();
  expect(matcher(entry, { targetMass: 120, atoms: {
    C: { min: 5, max: 9 }
  } })).toBe(false)();
  expect(matcher(entry, { targetMass: 120, ionization: { charge: 1, em: 0 }, atoms: {
    C: { min: 10, max: 20 },
    N: { min: 0, max: 10 }
  } })).toBeTruthy();
});


test('test msemMatcher with forced ionization', () => {
  let entry = {
    mf: 'C10',
    em: 120,
    msem: 0,
    charge: 0,
    unsaturation: 11,
    atoms: {
      C: 10
    },
    ionization: { mf: 'H+', charge: 1, em: 1 }
  };

  expect(matcher(entry, {
    targetMass: 120,
    maxCharge: 1,
    minCharge: 1,
    ionization: { mf: 'H+', charge: 1, em: 0 },
    forceIonization: true
  })).toStrictEqual({
    ionization: 'H+',
    em: 119.99945142009094,
    delta: -0.0005485799090649834,
    ppm: 4.571499242208195,
    charge: 1
  });
});
