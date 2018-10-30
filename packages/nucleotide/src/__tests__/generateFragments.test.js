'use strict';

const { generateFragments } = require('..');

describe('test generate fragments', () => {
  test('nucleotide to sequence of OHDampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', { a: true });
  });
  test('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', { a: true, ab: true });
    expect(fragments).toMatchSnapshot();
  });

  test('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', {
      a: true,
      ab: true,
      b: true,
      c: true,
      d: true,
      w: true,
      x: true,
      y: true,
      z: true
    });
    expect(fragments).toMatchSnapshot();
  });
});
