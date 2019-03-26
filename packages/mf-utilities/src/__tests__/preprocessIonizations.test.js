'use strict';

const preprocessIonizations = require('../preprocessIonizations');

describe('preprocessIonizations', () => {
  it('check ionizations', () => {
    let ionizations = preprocessIonizations('H+,Na+,(H+)2, K+');
    expect(ionizations).toHaveLength(4);
    expect(ionizations[0]).toMatchObject({
      mf: 'H+',
      em: 1.00782503223,
      charge: 1
    });
    expect(ionizations[2]).toMatchObject({
      mf: '(H+)2',
      em: 2.01565006446,
      charge: 2
    });
  });
  it('check ionizations with ranges', () => {
    let ionizations = preprocessIonizations('(H+)-1--3');
    expect(ionizations).toMatchObject([
      { mf: '(H+)-3', em: -3.02347509669, charge: -3 },
      { mf: '(H+)-2', em: -2.01565006446, charge: -2 },
      { mf: '(H+)-1', em: -1.00782503223, charge: -1 }
    ]);
  });
});
