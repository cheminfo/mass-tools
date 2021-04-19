'use strict';

let PEP = require('..');

describe('Checking digest sequence', () => {
  it('Normal sequence digest', () => {
    let result = PEP.digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 0,
    });
    expect(result).toEqual(['HLysOH$D1>1', 'HLysOH$D2>2', 'HAlaAlaLysOH$D3>5']);
  });

  it('Normal sequence digest, minMissed:0, maxMissed:1', () => {
    let result = PEP.digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 0,
      maxMissed: 1,
    });
    expect(result).toEqual([
      'HLysOH$D1>1',
      'HLysLysOH$D1>2',
      'HLysOH$D2>2',
      'HLysAlaAlaLysOH$D2>5',
      'HAlaAlaLysOH$D3>5',
    ]);
  });

  it('Normal sequence digest, minMissed:1, maxMissed:1', () => {
    let result = PEP.digestPeptide('HLysLysAlaAlaLysOH', {
      enzyme: 'trypsin',
      minMissed: 1,
      maxMissed: 1,
    });
    expect(result).toEqual(['HLysLysOH$D1>2', 'HLysAlaAlaLysOH$D2>5']);
  });

  it('Normal small sequence digest, default value', () => {
    let result = PEP.digestPeptide('HLysAlaOH');
    expect(result).toEqual(['HLysOH$D1>1', 'HAlaOH$D2>2']);
  });

  //  Leu, Phe, Val, Ile, Ala, Met
  it('HLysLeuValOH digest by thermolysin', () => {
    let result = PEP.digestPeptide('HLysLeuProValOH', {
      enzyme: 'thermolysin',
      minMissed: 0,
      maxMissed: 0,
    });
    expect(result).toEqual(['HLysOH$D1>1', 'HLeuProOH$D2>3', 'HValOH$D4>4']);
  });

  it('HLysLeu(H-1OH)ValOH digest at all amide bonds', () => {
    let result = PEP.digestPeptide('HLysLeu(H-1OH)ValOH', {
      enzyme: 'any',
      minMissed: 1,
      maxMissed: 1,
    });

    expect(result).toEqual(['HLysLeu(H-1OH)OH$D1>2', 'HLeu(H-1OH)ValOH$D2>3']);
  });
});
