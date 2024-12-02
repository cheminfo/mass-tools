import { MF } from 'mf-parser';
import { describe, expect, it } from 'vitest';

import { furanThreeTerm } from '..';

describe('test nucleotide', () => {
  it('remove base of three terminal of HDampDtmpDcmp', () => {
    let modified = furanThreeTerm('HDampDtmpDcmp');
    expect(modified).toBe('HDampDtmpFurp');
    let mass = new MF(modified).getInfo().monoisotopicMass;
    expect(mass).toBeCloseTo(779.11, 2);
  });

  it('remove base of three terminal of HDamp', () => {
    let modified = furanThreeTerm('HDamp');
    expect(modified).toBe('HFurp');
    let mass = new MF(modified).getInfo().monoisotopicMass;
    expect(mass).toBeCloseTo(162.01, 2);
  });

  it('remove base of three terminal of (C5H3)DampDtmp', () => {
    let modified = furanThreeTerm('(C5H3)DampDtmp');
    expect(modified).toBe('(C5H3)DampFurp');
    let mass = new MF(modified).getInfo().monoisotopicMass;
    expect(mass).toBeCloseTo(537.08, 2);
  });

  it('remove base of three terminal of HODamp', () => {
    let modified = furanThreeTerm('HODamp');
    expect(modified).toBe('HOFurp');
    let mass = new MF(modified).getInfo().monoisotopicMass;
    expect(mass).toBeCloseTo(178, 2);
  });
});
