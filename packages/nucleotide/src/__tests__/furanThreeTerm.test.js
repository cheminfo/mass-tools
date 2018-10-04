'use strict';

const { furanThreeTerm } = require('..');
const MF = require('mf-parser').MF;

describe('test nucleotide', () => {
  test('remove base of three terminal of HDampDtmpDcmp', () => {
    let modified = furanThreeTerm('HDampDtmpDcmp', { a: true });
    expect(modified).toBe('HDampDtmpC5H5O5P');
  });

  test('remove base of three terminal of HDampDtmpDump', () => {
    expect(() => furanThreeTerm('HDampDtmpDump', { a: true })).toThrowError(
      'can not remove'
    );
  });
});
