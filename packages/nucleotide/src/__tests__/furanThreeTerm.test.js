'use strict';

const { furanThreeTerm } = require('..');
const MF = require('mf-parser').MF;

describe('test nucleotide', () => {
  test('remove base of three terminal of HDampDtmpDcmp', () => {
    let modified = furanThreeTerm('HDampDtmpDcmp', { a: true });
    expect(modified).toBe('HDampDtmpC5H6O4P');
  });
});
