import { describe, expect, it } from 'vitest';

import { chargePeptide } from '..';

describe('Checking charge peptide', () => {
  it('Check charge with default option', () => {
    let result = chargePeptide('HAlaGlyLysHisAspOH');
    expect(result).toBe('H+HAlaGlyLys(H+)His(H+)AspOH');
  });

  it('Check charge with pH = 1', () => {
    let result = chargePeptide('HAlaGlyLysHisAspOH', { pH: 1 });
    expect(result).toBe('H+HAlaGlyLys(H+)His(H+)AspOH');
  });

  it('Check charge with pH = 7', () => {
    let result = chargePeptide('HAlaGlyLysHisAspOH', { pH: 7 });
    expect(result).toBe('H+HAlaGlyLys(H+)HisAsp(H-1-)O-');
  });

  it('Check charge with pH = 13', () => {
    let result = chargePeptide('HAlaGlyLysHisAspOH', { pH: 13 });
    expect(result).toBe('HAlaGlyLysHisAsp(H-1-)O-');
  });

  it('Charge an array of mfs', () => {
    let result = chargePeptide(['HAlaGlyLysHisAspOH', 'HLysHisAspOH'], {
      pH: 13,
    });
    expect(result).toStrictEqual([
      'HAlaGlyLysHisAsp(H-1-)O-',
      'HLysHisAsp(H-1-)O-',
    ]);
  });
});
