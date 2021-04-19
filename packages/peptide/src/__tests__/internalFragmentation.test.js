'use strict';

let PEP = require('..');

// http://www.matrixscience.com/help/fragmentation_help.html

['HLysNH3(+1)$c2y3', 'HLysAspNH3(+1)$c3y3', 'HAspNH3(+1)$c3y2'];

let allowed = [
  'Lys$b2y3',
  'LysAsp$b3y3',
  'Asp$b3y2',
  'Lys$c2y3',
  'LysAsp$c3y3',
  'Asp$c3y2',
  'Lys$c2z3',
  'LysAsp$c3z3',
  'Asp$c3z2',
];

describe('Check internal fragmentation', () => {
  it('Check AKDR', () => {
    let sequence = PEP.convertAASequence('AKDR');
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: true,
      ya: false,
    });
    expect(result).toHaveLength(3);
    checkAllowed(result);
  });

  it('Check AKDR ph=1', () => {
    let sequence = PEP.convertAASequence('AKDR');
    sequence = PEP.chargePeptide(sequence, { pH: 1 });
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: true,
      ya: false,
    });
    expect(result).toHaveLength(3);
    checkAllowed(result);
  });

  it('Check AKLRCSTY ph=13', () => {
    let sequence = PEP.convertAASequence('AKDR');
    sequence = PEP.chargePeptide(sequence, { pH: 13 });
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: true,
      ya: false,
    });
    expect(result).toHaveLength(3);
    checkAllowed(result);
  });

  it('Check AKDR neutral loss ph=1', () => {
    let sequence = PEP.convertAASequence('AKDR');
    sequence = PEP.allowNeutralLoss(sequence);
    sequence = PEP.chargePeptide(sequence, { pH: 1 });
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: true,
      ya: false,
    });
    expect(result).toHaveLength(3);
    checkAllowed(result);
  });

  it('Check AKDR neutral loss ph=13', () => {
    let sequence = PEP.convertAASequence('AKDR');
    sequence = PEP.allowNeutralLoss(sequence);
    sequence = PEP.chargePeptide(sequence, { pH: 13 });
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: true,
      ya: false,
    });
    expect(result).toHaveLength(3);
    checkAllowed(result);
  });

  it('Check AKDR neutral loss  internal fragment yb', () => {
    let sequence = PEP.convertAASequence('AKDR');
    sequence = PEP.allowNeutralLoss(sequence);
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      yb: true,
      ya: false,
    });
    expect(result).toHaveLength(3);
    checkAllowed(result);
  });

  it('Check AKDR internal fragment yc', () => {
    let sequence = PEP.convertAASequence('AKDR');
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      ya: false,
      yb: false,
      yc: true,
      zc: false,
    });
    expect(result).toHaveLength(3);
    checkAllowed(result);
  });

  it('Check AKDR internal fragment zc', function () {
    let sequence = PEP.convertAASequence('AKDR');
    sequence = PEP.allowNeutralLoss(sequence);
    let result = PEP.generatePeptideFragments(sequence, {
      a: false,
      b: false,
      c: false,
      x: false,
      y: false,
      z: false,
      ya: false,
      yb: false,
      yc: false,
      zc: true,
    });
    expect(result).toHaveLength(3);
    checkAllowed(result);
  });
});

function clean(mfs) {
  for (let i = 0; i < mfs.length; i++) {
    let mf = mfs[i];
    mfs[i] = mfs[i].replace(/\([^\(]*\)[0-9-]*/g, '');
    mfs[i] = mfs[i].replace(/^[H\d+]*(?=[A-Z])/, '');
    mfs[i] = mfs[i].replace(/^N-1/, '');
    mfs[i] = mfs[i].replace(/O[H-]\$/, '$');
    mfs[i] = mfs[i].replace(/NH3\$/, '$');
  }
}

function checkAllowed(mfs) {
  clean(mfs);
  for (let mf of mfs) {
    expect(allowed).toContain(mf);
  }
}
