'use strict';

const { furanThreeTerm } = require('..');

describe('test nucleotide', () => {
  it('remove base of three terminal of HDampDtmpDcmp', () => {
    let modified = furanThreeTerm('HDampDtmpDcmp');
    expect(modified).toBe('HDampDtmpC5H6O4P');
  });

  it('remove base of three terminal of HDamp', () => {
    let modified = furanThreeTerm('HDamp');
    expect(modified).toBe('HC5H6O4P');
  });

  it('remove base of three terminal of HODamp', () => {
    let modified = furanThreeTerm('HODamp');
    expect(modified).toBe('HOC5H6O4P');
  });
});
