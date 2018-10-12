'use strict';

const { generateFragments } = require('..');

describe('test generate fragments', () => {
  test('nucleotide fragmentation a of HODadeDtmpDcmpH', () => {
    let fragments = generateFragments('HODadeDtmpDcmpH', { a: true });
    expect(fragments).toMatchSnapshot();
  });

  test('nucleotide fragmentation ab of HODadeDtmpDcmpH', () => {
    let fragments = generateFragments('HODadeDtmpDcmpH', { ab: true });
    expect(fragments).toMatchSnapshot();
  });

  test('nucleotide fragmentation y of HODadeDtmpDcmpH', () => {
    let fragments = generateFragments('HODadeDtmpDcmpH', { y: true });
    expect(fragments).toMatchSnapshot();
  });

  test('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', { a: true });
    expect(fragments).toMatchSnapshot();
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
