'use strict';

const { generateFragments } = require('..');

describe('test generate fragments', () => {
  it('nucleotide to sequence of OHDampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', { a: true });
  });
  it('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', { a: true, ab: true });
    expect(fragments).toMatchSnapshot();
  });

  it('nucleotide to sequence of HODampDtmpDcmpH', () => {
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
