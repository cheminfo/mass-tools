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
      'HAlaAlaLysOH$D3>5',
      'HLysOH$D1>1',
      'HLysOH$D2>2',
    ]);
  });

  it('Normal sequence digest, minMissed:0, maxMissed:1', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 1,
    });

    expect(result).toStrictEqual([
      'HAlaAlaLysOH$D3>5',
      'HLysAlaAlaLysOH$D2>5',
      'HLysLysOH$D1>2',
      'HLysOH$D1>1',
      'HLysOH$D2>2',
    ]);
  });

  it('Normal sequence digest, minMissed:1, maxMissed:1', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 1,
      maxMissed: 1,
    });

    expect(result).toStrictEqual(['HLysAlaAlaLysOH$D2>5', 'HLysLysOH$D1>2']);
  });

  it('Normal small sequence digest, default value', () => {
    let result = digestPeptide('HLysAlaOH');

    expect(result).toStrictEqual(['HAlaOH$D2>2', 'HLysOH$D1>1']);
  });

  //  Leu, Phe, Val, Ile, Ala, Met
  it('HLysLeuValOH digest by thermolysin', () => {
    let result = digestPeptide('HLysLeuProValOH', {
      enzyme: 'thermolysin',
      minMissed: 0,
      maxMissed: 0,
    });

    expect(result).toStrictEqual([
      'HLeuProOH$D2>3',
      'HLysOH$D1>1',
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
      'HLeu(H-1OH)ValOH$D2>3',
      'HLysLeu(H-1OH)OH$D1>2',
    ]);
  });

  it('HLysLysAlaAlaLysOH with maxDigestions=1 (single hydrolysis)', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 0,
      maxDigestions: 1,
    });

    // With 2 possible cleavage sites, choosing 1 gives us 2 combinations:
    // - Cleave after 1st Lys: HLysOH + HLysAlaAlaLysOH
    // - Cleave after 2nd Lys: HLysLysOH + HAlaAlaLysOH
    expect(result).toStrictEqual([
      'HAlaAlaLysOH$D3>5',
      'HLysAlaAlaLysOH$D2>5',
      'HLysLysOH$D1>2',
      'HLysOH$D1>1',
    ]);
  });

  it('HLysLysAlaAlaLysOH with maxDigestions=2', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 0,
      maxDigestions: 2,
    });

    expect(result).toStrictEqual([
      'HAlaAlaLysOH$D3>5',
      'HLysOH$D1>1',
      'HLysOH$D2>2',
    ]);
  });

  it('HLysLysAlaAlaLysOH with minDigestions=2', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 0,
      minDigestions: 2,
    });

    expect(result).toStrictEqual([
      'HAlaAlaLysOH$D3>5',
      'HLysOH$D1>1',
      'HLysOH$D2>2',
    ]);
  });

  it('HLysLysAlaAlaLysOH with minDigestions=2, maxDigestions=2', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: ' trypsin',
      minMissed: 0,
      maxMissed: 0,
      minDigestions: 2,
      maxDigestions: 2,
    });

    expect(result).toStrictEqual([
      'HAlaAlaLysOH$D3>5',
      'HLysOH$D1>1',
      'HLysOH$D2>2',
    ]);
  });

  it('HLysLysAlaAlaLysOH with minDigestions=5 (impossible)', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 0,
      minDigestions: 5,
    });

    expect(result).toStrictEqual([]);
  });

  it('HLysLysAlaAlaLysOH with maxDigestions=1 and maxMissed=1', () => {
    let result = digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 1,
      maxDigestions: 1,
    });

    // With maxDigestions=1, we get 2 combinations, each can have missed cleavages:
    // Combination 1 (cleave after 1st Lys): HLysOH, HLysAlaAlaLysOH, HLysLysAlaAlaLysOH (with missed)
    // Combination 2 (cleave after 2nd Lys): HLysLysOH, HAlaAlaLysOH, HLysLysAlaAlaLysOH (with missed)
    expect(result).toStrictEqual([
      'HAlaAlaLysOH$D3>5',
      'HLysAlaAlaLysOH$D2>5',
      'HLysLysAlaAlaLysOH$D1>5',
      'HLysLysOH$D1>2',
      'HLysOH$D1>1',
    ]);
  });

  it('HLysAlaValOH with enzyme any and maxDigestions=1', () => {
    let result = digestPeptide('HLysAlaValOH', {
      enzyme: 'any',
      minMissed: 0,
      maxMissed: 0,
      maxDigestions: 1,
    });

    // With 2 possible cleavage sites (after Lys and after Ala), choosing 1 gives 2 combinations:
    // - Cleave after Lys: HLysOH + HAlaValOH
    // - Cleave after Ala: HLysAlaOH + HValOH
    expect(result).toStrictEqual([
      'HAlaValOH$D2>3',
      'HLysAlaOH$D1>2',
      'HLysOH$D1>1',
      'HValOH$D3>3',
    ]);
  });

  it('HLysAlaValOH with enzyme any and maxDigestions=2', () => {
    let result = digestPeptide('HLysAlaValOH', {
      enzyme: 'any',
      minMissed: 0,
      maxMissed: 0,
      maxDigestions: 2,
    });

    // With 2 possible cleavage sites, maxDigestions=2 uses all cleavages (default behavior)
    expect(result).toStrictEqual(['HAlaOH$D2>2', 'HLysOH$D1>1', 'HValOH$D3>3']);
  });
});
