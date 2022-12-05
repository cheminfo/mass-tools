import {
  generatePeptideFragments,
  sequenceToMF,
  chargePeptide,
  allowNeutralLoss,
} from '..';

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

describe('generatePeptideFragments', () => {
  it('Check KAA', () => {
    let sequence = sequenceToMF('KAA');
    let result = generatePeptideFragments(sequence, {
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
    let sequence = sequenceToMF('AKLRCSTY');
    let result = generatePeptideFragments(sequence, {
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
    let result = generatePeptideFragments('HLysAlaOH', {
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
    let result = generatePeptideFragments('HLys(COH)AlaOH', {
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
    let sequence = sequenceToMF('AKLRCSTY');
    sequence = chargePeptide(sequence, { pH: 1 });
    let result = generatePeptideFragments(sequence, {
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
    let sequence = sequenceToMF('AKLRCSTY');
    sequence = chargePeptide(sequence, { pH: 13 });
    let result = generatePeptideFragments(sequence, {
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
    let sequence = sequenceToMF('AKLRCSTY');
    sequence = allowNeutralLoss(sequence);
    sequence = chargePeptide(sequence, { pH: 1 });
    let result = generatePeptideFragments(sequence, {
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
    let sequence = sequenceToMF('AKLRCSTY');
    sequence = allowNeutralLoss(sequence);
    sequence = chargePeptide(sequence, { pH: 13 });
    let result = generatePeptideFragments(sequence, {
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
    let sequence = sequenceToMF('AKLRCSTY');
    sequence = allowNeutralLoss(sequence);
    let result = generatePeptideFragments(sequence, {
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
    let sequence1 = sequenceToMF('ALP');
    let sequence2 = sequenceToMF('(H)ALP(OH)');
    let sequence3 = sequenceToMF('HAlaLeuProOH');
    let sequence4 = sequenceToMF('(H)AlaLeuPro(OH)');
    let result1 = generatePeptideFragments(sequence1);
    let result2 = generatePeptideFragments(sequence2);
    let result3 = generatePeptideFragments(sequence3);
    let result4 = generatePeptideFragments(sequence4);
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

  it('AK(*1)T(H-1*2)Y', () => {
    let sequence = sequenceToMF('AK(*1)T(H-1*2)Y');
    let result = generatePeptideFragments(sequence);
    expect(result).toStrictEqual([
      'HAla(+1)$b1',
      'H2(+1)TyrOH$y1',
      'HAlaLys(*1)(+1)$b2',
      'H2(+1)Thr(H-1*2)TyrOH$y2',
      'HAlaLys(*1)Thr(H-1*2)(+1)$b3',
      'H2(+1)Lys(*1)Thr(H-1*2)TyrOH$y3',
    ]);
  });
  it('HAlaLys(*1)Thr(H-1*2)TyrOH', () => {
    let sequence = sequenceToMF('HAlaLys(*1)Thr(H-1*2)TyrOH');
    let result = generatePeptideFragments(sequence);
    expect(result).toStrictEqual([
      'HAla(+1)$b1',
      'H2(+1)TyrOH$y1',
      'HAlaLys(*1)(+1)$b2',
      'H2(+1)Thr(H-1*2)TyrOH$y2',
      'HAlaLys(*1)Thr(H-1*2)(+1)$b3',
      'H2(+1)Lys(*1)Thr(H-1*2)TyrOH$y3',
    ]);
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
