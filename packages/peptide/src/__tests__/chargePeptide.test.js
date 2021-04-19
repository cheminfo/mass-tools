'use strict';

let PEP = require('..');

describe('Checking charge peptide', () => {
  it('Check charge with default option', () => {
    let result = PEP.chargePeptide('HAlaGlyLysHisAspOH');
    expect(result).toStrictEqual('H+HAlaGlyLys(H+)His(H+)AspOH');
  });

  it('Check charge with pH = 1', () => {
    let result = PEP.chargePeptide('HAlaGlyLysHisAspOH', { pH: 1 });
    expect(result).toStrictEqual('H+HAlaGlyLys(H+)His(H+)AspOH');
  });

  it('Check charge with pH = 7', () => {
    let result = PEP.chargePeptide('HAlaGlyLysHisAspOH', { pH: 7 });
    expect(result).toStrictEqual('H+HAlaGlyLys(H+)HisAsp(H-1-)O-');
  });

  it('Check charge with pH = 13', () => {
    let result = PEP.chargePeptide('HAlaGlyLysHisAspOH', { pH: 13 });
    expect(result).toStrictEqual('HAlaGlyLysHisAsp(H-1-)O-');
  });

  it('Charge an array of mfs', () => {
    let result = PEP.chargePeptide(['HAlaGlyLysHisAspOH', 'HLysHisAspOH'], {
      pH: 13,
    });
    expect(result).toStrictEqual([
      'HAlaGlyLysHisAsp(H-1-)O-',
      'HLysHisAsp(H-1-)O-',
    ]);
  });
});
