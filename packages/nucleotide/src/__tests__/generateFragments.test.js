'use strict';

const { generateFragments } = require('..');

describe('test generate fragments', () => {
  test('nucleotide to sequence of HDampDtmpDcmpOH', () => {
    let fragments = generateFragments('HDampDtmpDcmpOH', { a: true });
    console.log(fragments);
  });
  test('nucleotide to sequence of HDampDtmpDcmpOH', () => {
    let fragments = generateFragments('HDampDtmpDcmpOH', { a: true, ab: true });
    expect(fragments).toMatchSnapshot();
  });
});
