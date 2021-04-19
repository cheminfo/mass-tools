'use strict';

let PEP = require('..');

// http://www.matrixscience.com/help/fragmentation_help.html

let allowed = [
  'Ala$b1',
  'AlaLys$b2',
  'AlaLysLeu$b3',
  'AlaLysLeuArg$b4',
  'AlaLysLeuArgCys$b5',
  'AlaLysLeuArgCysSer$b6',
  'AlaLysLeuArgCysSerThr$b7',
  'Tyr$y1',
  'ThrTyr$y2',
  'SerThrTyr$y3',
  'CysSerThrTyr$y4',
  'ArgCysSerThrTyr$y5',
  'LeuArgCysSerThrTyr$y6',
  'LysLeuArgCysSerThrTyr$y7',
];

describe('Check fragmentation', () => {
  it('Check KA', () => {
    let sequence = PEP.convertAASequence('KAA');
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(4);
  });

  it('Check AKLRCSTY', () => {
    let sequence = PEP.convertAASequence('AKLRCSTY');
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(14);
    checkAllowed(result);
  });

  it('Check HLysAlaOH', () => {
    let result = PEP.generatePeptideFragments('HLysAlaOH', {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual(['HLys(+1)$b1', 'H2(+1)AlaOH$y1']);
  });

  it('Check HLys(COH)AlaOH side chain modified', () => {
    let result = PEP.generatePeptideFragments('HLys(COH)AlaOH', {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual(['HLys(COH)(+1)$b1', 'H2(+1)AlaOH$y1']);
  });

  it('Check AKLRCSTY ph=1', () => {
    let sequence = PEP.convertAASequence('AKLRCSTY');
    sequence = PEP.chargePeptide(sequence, { pH: 1 });
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(14);
    checkAllowed(result);
  });

  it('Check AKLRCSTY ph=13', () => {
    let sequence = PEP.convertAASequence('AKLRCSTY');
    sequence = PEP.chargePeptide(sequence, { pH: 13 });
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(14);
    checkAllowed(result);
  });

  it('Check AKLRCSTY neutral loss ph=1', () => {
    let sequence = PEP.convertAASequence('AKLRCSTY');
    sequence = PEP.allowNeutralLoss(sequence);
    sequence = PEP.chargePeptide(sequence, { pH: 1 });
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(14);
    checkAllowed(result);
  });

  it('Check AKLRCSTY neutral loss ph=13', () => {
    let sequence = PEP.convertAASequence('AKLRCSTY');
    sequence = PEP.allowNeutralLoss(sequence);
    sequence = PEP.chargePeptide(sequence, { pH: 13 });
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(14);
    checkAllowed(result);
  });

  it('Check AKLRCSTY neutral loss', () => {
    let sequence = PEP.convertAASequence('AKLRCSTY');
    sequence = PEP.allowNeutralLoss(sequence);
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: true,
      c: false,
      x: false,
      y: true,
      z: false,
      yb: false,
      ya: false,
    });
    expect(result).toHaveLength(14);
    checkAllowed(result);
  });

  it('ALP versus (H)ALP(OH) versus HAlaLeuProOH versus (H)AlaLeuPro(OH)', () => {
    let sequence1 = PEP.convertAASequence('ALP');
    let sequence2 = PEP.convertAASequence('(H)ALP(OH)');
    let sequence3 = PEP.convertAASequence('HAlaLeuProOH');
    let sequence4 = PEP.convertAASequence('(H)AlaLeuPro(OH)');
    let result1 = PEP.generatePeptideFragments(sequence1);
    let result2 = PEP.generatePeptideFragments(sequence2);
    let result3 = PEP.generatePeptideFragments(sequence3);
    let result4 = PEP.generatePeptideFragments(sequence4);
    expect(result1).toStrictEqual([
      'HAla(+1)$b1',
      'H2(+1)ProOH$y1',
      'HAlaLeu(+1)$b2',
      'H2(+1)LeuProOH$y2',
    ]);
    expect(result2).toStrictEqual([
      '(H)Ala(+1)$b1',
      'H2(+1)Pro(OH)$y1',
      '(H)AlaLeu(+1)$b2',
      'H2(+1)LeuPro(OH)$y2',
    ]);
    expect(result1).toStrictEqual(result3);
    expect(result2).toStrictEqual(result4);
  });
});

function clean(mfs) {
  for (let i = 0; i < mfs.length; i++) {
    mfs[i] = mfs[i].replace(/\([^(]*\)[0-9-]*/g, '');
    mfs[i] = mfs[i].replace(/^[H\d+]*(?=[A-Z])/, '');
    mfs[i] = mfs[i].replace(/O[H-]\$/, '$');
  }
}

function checkAllowed(mfs) {
  clean(mfs);
  for (let mf of mfs) {
    expect(allowed).toContain(mf);
  }
}
