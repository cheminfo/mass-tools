import { describe, expect, it } from 'vitest';

import { generatePeptideFragments } from '..';

// http://www.matrixscience.com/help/fragmentation_help.html

describe('Generate internal fragments', () => {
  it('Check internal fragments for yb', () => {
    let result = generatePeptideFragments('HAlaGlySerProPheOH', {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: true,
      ya: false,
    });

    expect(result).toHaveLength(6);
    expect(result).toStrictEqual([
      'HGly(+1)$b2y4',
      'HGlySer(+1)$b3y4',
      'HGlySerPro(+1)$b4y4',
      'HSer(+1)$b3y3',
      'HSerPro(+1)$b4y3',
      'HPro(+1)$b4y2',
    ]);
  });

  it('Check internal fragments for ya', () => {
    let result = generatePeptideFragments('HAlaGlySerProPheOH', {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: false,
      ya: true,
    });

    expect(result).toHaveLength(6);
    expect(result).toStrictEqual([
      'HGlyC-1O-1(+1)$a2y4',
      'HGlySerC-1O-1(+1)$a3y4',
      'HGlySerProC-1O-1(+1)$a4y4',
      'HSerC-1O-1(+1)$a3y3',
      'HSerProC-1O-1(+1)$a4y3',
      'HProC-1O-1(+1)$a4y2',
    ]);
  });

  it('Check internal fragments for ya with maxInternal=2', () => {
    let result = generatePeptideFragments('HAlaGlySerProPheOH', {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: false,
      ya: true,
      maxInternal: 2,
    });

    expect(result).toHaveLength(5);
    expect(result).toStrictEqual([
      'HGlyC-1O-1(+1)$a2y4',
      'HGlySerC-1O-1(+1)$a3y4',
      'HSerC-1O-1(+1)$a3y3',
      'HSerProC-1O-1(+1)$a4y3',
      'HProC-1O-1(+1)$a4y2',
    ]);
  });

  it('Check internal fragments for ya with maxInternal=2 and minInternal=2', () => {
    let result = generatePeptideFragments('HAlaGlySerProPheOH', {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: false,
      ya: true,
      minInternal: 2,
      maxInternal: 2,
    });

    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      'HGlySerC-1O-1(+1)$a3y4',
      'HSerProC-1O-1(+1)$a4y3',
    ]);
  });
});
