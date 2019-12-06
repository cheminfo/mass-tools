'use strict';

let MF = require('../MF');

test('getIsotopesInfo from C{50,50}[13C]H2', () => {
  let mf = new MF('[13C]3CC{50,50}((2+))2');
  let info = mf.getIsotopesInfo();

  expect(info.charge).toBe(4);
  expect(info.isotopes[0].distribution).toStrictEqual([
    { x: 12, y: 0.9893 },
    { x: 13.00335483507, y: 0.0107 },
  ]);
  expect(info.isotopes[1].distribution).toStrictEqual([
    { x: 13.00335483507, y: 1 },
  ]);
  expect(info.isotopes[2].distribution).toStrictEqual([
    { x: 12, y: 0.5 },
    { x: 13.00335483507, y: 0.5 },
  ]);
});

test('getIsotopesInfo from C.H', () => {
  expect(() => {
    let mf = new MF('C.H');
    mf.getIsotopesInfo();
  }).toThrow('getIsotopesInfo can not be applied on multipart MF');
});

test('getIsotopesInfo from (CH3(+))2', () => {
  let mf = new MF('(CH3(+))2');
  let info = mf.getIsotopesInfo();
  expect(info.charge).toBe(2);
});
