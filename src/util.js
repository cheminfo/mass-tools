'use strict';

const Util = require('../../packages/emdb/src').Util;

test('test emdbUtil isotopicDistrbution', () => {
  let isotopicDistribution = new Util.IsotopicDistribution('C10');
  let xy = isotopicDistribution.getXY();
  expect(xy.x[0]).toBe(120);
  expect(xy.y[0]).toBe(100);
});

test('test emdbUtil MF', () => {
  let mf = new Util.MF('C10');
  let html = mf.toHtml();
  let info = mf.getInfo();

  expect(html).toBe('C<sub>10</sub>');
  expect(info).toMatchObject({
    mass: 120.10735896735248,
    monoisotopicMass: 120,
    charge: 0,
    mf: 'C10',
    atoms: { C: 10 },
    unsaturation: 11
  });
});
