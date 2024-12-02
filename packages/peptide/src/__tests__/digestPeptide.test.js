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
    let result = digestPeptide('HLysAlaOH');
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
});
