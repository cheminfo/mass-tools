'use strict';

const furanThreeTerm = require('..');
const MF = require('mf-parser').MF;

describe('test nucleotide', () => {
  test('remove base of three terminal of HDampDtmpDcmp', () => {
    let fragments = furanThreeTerm('HDampDtmpDcmp', { a: true });
    console.log(fragments);
  });
});
