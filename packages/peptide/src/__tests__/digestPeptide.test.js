import { describe, expect, it } from 'vitest';

import { digestPeptide } from '..';

describe('Checking digest sequence', () => {
  it('Normal sequence digest', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 0,
    });

    expect(result).toStrictEqual([
      'HLysOH$D1>1',
      'HLysOH$D2>2',
      'HAlaAlaLysOH$D3>5',
    ]);
  });

  it('Normal sequence digest, minMissed:0, maxMissed:1', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 1,
    });

    expect(result).toStrictEqual([
      'HLysOH$D1>1',
      'HLysLysOH$D1>2',
      'HLysOH$D2>2',
      'HLysAlaAlaLysOH$D2>5',
      'HAlaAlaLysOH$D3>5',
    ]);
  });

  it('Normal sequence digest, minMissed:1, maxMissed:1', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 1,
      maxMissed: 1,
    });

    expect(result).toStrictEqual(['HLysLysOH$D1>2', 'HLysAlaAlaLysOH$D2>5']);
  });

  it('Normal small sequence digest, default value', () => {
    let result = digestPeptide('HLysAlaOH', { enzyme: 'trypsin' });

    expect(result).toStrictEqual(['HLysOH$D1>1', 'HAlaOH$D2>2']);
  });

  //  Leu, Phe, Val, Ile, Ala, Met
  it('HLysLeuValOH digest by thermolysin', () => {
    let result = digestPeptide('HLysLeuProValOH', {
      enzyme: 'thermolysin',
      minMissed: 0,
      maxMissed: 0,
    });

    expect(result).toStrictEqual([
      'HLysOH$D1>1',
      'HLeuProOH$D2>3',
      'HValOH$D4>4',
    ]);
  });

  it('HLysLeu(H-1OH)ValOH digest at all amide bonds', () => {
    let result = digestPeptide('HLysLeu(H-1OH)ValOH', {
      enzyme: 'any',
      minMissed: 1,
      maxMissed: 1,
    });

    expect(result).toStrictEqual([
      'HLysLeu(H-1OH)OH$D1>2',
      'HLeu(H-1OH)ValOH$D2>3',
    ]);
  });

  it('maxDigestions=1 limits to single cleavage combinations', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      maxDigestions: 1,
    });

    // With 2 cleavage sites, using 1 site gives C(2,1)=2 combinations
    // Each combination produces 2 fragments, giving 4 total results
    expect(result).toHaveLength(4);
    expect(result).toContain('HLysOH$D1>1');
    expect(result).toContain('HLysLysOH$D1>2');
    expect(result).toContain('HLysAlaAlaLysOH$D2>5');
    expect(result).toContain('HAlaAlaLysOH$D3>5');
  });

  it('maxDigestions=2 with trypsin enzyme', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      maxDigestions: 2,
    });

    // Using all 2 cleavage sites gives the same result as default (all cleavages)
    expect(result).toStrictEqual([
      'HLysOH$D1>1',
      'HLysOH$D2>2',
      'HAlaAlaLysOH$D3>5',
    ]);
  });

  it('minDigestions=2 requires at least 2 cleavages', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minDigestions: 2,
    });

    // With only 2 cleavage sites total, minDigestions=2 means use all sites
    expect(result).toStrictEqual([
      'HLysOH$D1>1',
      'HLysOH$D2>2',
      'HAlaAlaLysOH$D3>5',
    ]);
  });

  it('minDigestions=1, maxDigestions=1 gives exactly 1 cleavage', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minDigestions: 1,
      maxDigestions: 1,
    });

    // Using exactly 1 cleavage site, same as maxDigestions=1
    expect(result).toHaveLength(4);
    expect(result).toContain('HLysOH$D1>1');
    expect(result).toContain('HLysLysOH$D1>2');
    expect(result).toContain('HLysAlaAlaLysOH$D2>5');
    expect(result).toContain('HAlaAlaLysOH$D3>5');
  });

  it('combinatorial digestion with enzyme=any', () => {
    let result = digestPeptide('HLysLysOH', {
      enzyme: 'any',
      maxDigestions: 1,
    });

    // With 'any' enzyme on HLysLysOH, there are 2 cleavage sites
    // With maxDigestions=1, we should get 2 possible single cleavages
    expect(result).toHaveLength(2);
    expect(result).toContain('HLysOH$D1>1');
    expect(result).toContain('HLysOH$D2>2');
  });

  it('no enzyme parameter returns empty array', () => {
    let result = digestPeptide('HLysLysOH', {});

    expect(result).toStrictEqual([]);
  });
});
