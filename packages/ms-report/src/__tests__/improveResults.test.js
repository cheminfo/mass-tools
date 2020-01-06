'use strict';

const improveResults = require('../improveResults');

describe('improveResults', () => {
  let info = require('./data/ACGGCTT(C8H14N2O)AGG');
  it('no merge', () => {
    let results = improveResults(info, 10);
    expect(results).toHaveLength(284);
  });
  it('merge charge', () => {
    let results = improveResults(info, 10, { merge: { charge: true } });
    expect(results).toHaveLength(223);
  });
});
