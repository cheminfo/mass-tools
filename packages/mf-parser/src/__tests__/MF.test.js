'use strict';

const MF = require('../MF');

describe('MF', () => {
  it('C', () => {
    let mf = new MF('C');
    let parts = mf.toParts();

    expect(parts).toStrictEqual([
      [{ kind: 'atom', value: 'C', multiplier: 1 }],
    ]);

    let newMF = mf.toMF();
    expect(newMF).toBe('C');

    mf.canonize();
    let html = mf.toHtml();

    expect(html).toBe('C');

    let info = mf.getInfo();

    expect(info).toStrictEqual({
      monoisotopicMass: 12,
      mass: 12.010735896735248,
      charge: 0,
      unsaturation: 2,
      mf: 'C',
      atoms: { C: 1 },
    });
  });

  it('[11C][11C]', () => {
    let mf = new MF('[11C][11C]');
    let parts = mf.toParts();

    expect(parts).toStrictEqual([
      [
        {
          kind: 'isotope',
          value: {
            atom: 'C',
            isotope: 11,
          },
          multiplier: 2,
        },
      ],
    ]);

    let newMF = mf.toMF();
    expect(newMF).toBe('[11C]2');

    mf.canonize();
    let html = mf.toHtml();

    expect(html).toBe('<sup>11</sup>C<sub>2</sub>');

    let info = mf.getInfo();

    expect(info).toStrictEqual({
      monoisotopicMass: 22.0228672,
      mass: 22.0228672,
      charge: 0,
      unsaturation: 3,
      mf: '[11C]2',
      atoms: { C: 2 },
    });
  });

  it('D', () => {
    let mfD = new MF('D');
    let infoD = mfD.getInfo();
    let mf2H = new MF('[2H]');
    let info2H = mf2H.getInfo();
    expect(infoD).toStrictEqual(info2H);
    expect(infoD).toStrictEqual({
      atoms: { H: 1 },
      charge: 0,
      mass: 2.01410177812,
      mf: '[2H]',
      monoisotopicMass: 2.01410177812,
      unsaturation: 0.5,
    });
  });

  it('H2Si(OH)2', () => {
    let mf = new MF('H2Si(OH)2');
    expect(mf.getInfo()).toStrictEqual({
      mass: 64.11607157056562,
      monoisotopicMass: 63.99805590271001,
      charge: 0,
      mf: 'H4O2Si',
      atoms: { H: 4, O: 2, Si: 1 },
      unsaturation: 0,
    });
  });

  it('Et3N.HCl', () => {
    let mf = new MF('Et3N.HCl');
    let parts = mf.toParts();

    expect(parts).toStrictEqual([
      [
        { kind: 'atom', value: 'C', multiplier: 6 },
        { kind: 'atom', value: 'H', multiplier: 15 },
        { kind: 'atom', value: 'N', multiplier: 1 },
      ],
      [
        { kind: 'atom', value: 'H', multiplier: 1 },
        { kind: 'atom', value: 'Cl', multiplier: 1 },
      ],
    ]);

    let newMF = mf.toMF();
    expect(newMF).toBe('C6H15N . HCl');

    mf.canonize();
    let html = mf.toHtml();

    expect(html).toBe('C<sub>6</sub>H<sub>15</sub>N • HCl');

    let info = mf.getInfo();
    expect(info).toStrictEqual({
      parts: [
        {
          mass: 101.19022990269394,
          monoisotopicMass: 101.12044948788001,
          charge: 0,
          mf: 'C6H15N',
          unsaturation: 0,
          atoms: { C: 6, H: 15, N: 1 },
        },
        {
          mass: 36.460878336663775,
          monoisotopicMass: 35.97667771423,
          charge: 0,
          mf: 'HCl',
          unsaturation: 0,
          atoms: { H: 1, Cl: 1 },
        },
      ],
      monoisotopicMass: 137.09712720211002,
      mass: 137.6511082393577,
      charge: 0,
      mf: 'C6H15N.HCl',
    });
  });

  it('(ch3ch2)3n', () => {
    let mf = new MF('(ch3ch2)3n', { ensureCase: true });
    expect(mf.toMF()).toBe('C6H15N');
  });

  it('(Me2CH)3N no expand', () => {
    let mf = new MF('(Me2CH)3N');
    let parts = mf.toParts({ expand: false });

    expect(parts).toStrictEqual([
      [
        { kind: 'atom', value: 'C', multiplier: 3 },
        { kind: 'atom', value: 'H', multiplier: 3 },
        { kind: 'atom', value: 'Me', multiplier: 6 },
        { kind: 'atom', value: 'N', multiplier: 1 },
      ],
    ]);

    let newMF = mf.toMF();
    expect(newMF).toBe('C3H3Me6N');

    let info = mf.getInfo();
    expect(info).toStrictEqual({
      mass: 143.27008211723435,
      monoisotopicMass: 143.16739968126,
      charge: 0,
      mf: 'C3H3Me6N',
      unsaturation: 0,
      atoms: { C: 3, H: 3, Me: 6, N: 1 },
    });
  });

  it('(Me2CH)3N with expand', () => {
    let mf = new MF('(Me2CH)3N');
    let parts = mf.toParts({ expand: true });

    expect(parts).toStrictEqual([
      [
        { kind: 'atom', value: 'C', multiplier: 9 },
        { kind: 'atom', value: 'H', multiplier: 21 },
        { kind: 'atom', value: 'N', multiplier: 1 },
      ],
    ]);

    let newMF = mf.toMF();
    expect(newMF).toBe('C9H21N');

    let info = mf.getInfo();
    expect(info).toStrictEqual({
      mass: 143.27008211723435,
      monoisotopicMass: 143.16739968126,
      charge: 0,
      mf: 'C9H21N',
      unsaturation: 0,
      atoms: { C: 9, H: 21, N: 1 },
    });
  });

  it('(+)SO4(+)(-2)2', () => {
    let mf = new MF('(+)SO4(+)(-2)2');
    let parts = mf.toParts();

    expect(parts).toStrictEqual([
      [
        { kind: 'atom', value: 'O', multiplier: 4 },
        { kind: 'atom', value: 'S', multiplier: 1 },
        { kind: 'charge', value: -2 },
      ],
    ]);

    let newMF = mf.toMF();
    expect(newMF).toBe('O4S(-2)');

    let neutralMF = mf.toNeutralMF();
    expect(neutralMF).toBe('O4S');

    let info = mf.getInfo({ customUnsaturations: { S: 4 } });
    expect(info).toStrictEqual({
      monoisotopicMass: 95.95172965268,
      mass: 96.06240710340018,
      charge: -2,
      observedMonoisotopicMass: 47.97641340624907,
      mf: 'O4S(-2)',
      unsaturation: 4,
      atoms: { O: 4, S: 1 },
    });
  });

  it('unsaturation with charges', () => {
    expect(new MF('CH4').getInfo().unsaturation).toBe(0);
    expect(new MF('C10H22O').getInfo().unsaturation).toBe(0);
    expect(new MF('H+').getInfo().unsaturation).toBe(0);
    expect(new MF('CO3(--)').getInfo().unsaturation).toBe(3);
    expect(new MF('HO(-)').getInfo().unsaturation).toBe(1);
    expect(new MF('F(-)').getInfo().unsaturation).toBe(1);
    expect(new MF('Na+').getInfo().unsaturation).toBe(0);
    expect(new MF('NH4+').getInfo().unsaturation).toBe(-1);

    expect(new MF('H(+)').toHtml()).toBe('H<sup>+</sup>');
  });

  it('NC[13C][15N]2NN2', () => {
    let mf = new MF('NC[13C][15N]2NN2');
    let parts = mf.toParts();
    expect(parts).toStrictEqual([
      [
        { kind: 'atom', value: 'C', multiplier: 1 },
        { kind: 'isotope', value: { atom: 'C', isotope: 13 }, multiplier: 1 },
        { kind: 'atom', value: 'N', multiplier: 4 },
        { kind: 'isotope', value: { atom: 'N', isotope: 15 }, multiplier: 2 },
      ],
    ]);

    let info = mf.getInfo();
    expect(info).toStrictEqual({
      monoisotopicMass: 111.01586865055,
      mass: 111.04112137534844,
      charge: 0,
      mf: 'C[13C]N4[15N]2',
      unsaturation: 6,
      atoms: { C: 2, N: 6 },
    });

    let newMF = mf.toMF();
    expect(newMF).toBe('C[13C]N4[15N]2');
  });

  it('DNA HODampDtmpDcmpDgmpH', () => {
    let mf = new MF('HODampDtmpDgmpDcmpH');
    let info = mf.getInfo();
    expect(info).toStrictEqual({
      mass: 1253.8043977028433,
      monoisotopicMass: 1253.21310019311,
      charge: 0,
      mf: 'C39H51N15O25P4',
      atoms: { C: 39, H: 51, N: 15, O: 25, P: 4 },
      unsaturation: 24,
    });
  });

  it('RNA HOAmpUmpH', () => {
    let mf = new MF('HOAmpUmpH');
    let info = mf.getInfo();
    expect(info).toStrictEqual({
      mass: 653.388021231099,
      monoisotopicMass: 653.08838712715,
      charge: 0,
      mf: 'C19H25N7O15P2',
      atoms: { C: 19, H: 25, N: 7, O: 15, P: 2 },
      unsaturation: 12,
    });
  });

  it('CC{50,50}H', () => {
    let mf = new MF('HC{50,50}C');
    let parts = mf.toParts();
    expect(parts).toStrictEqual([
      [
        { kind: 'atom', value: 'C', multiplier: 1 },
        {
          kind: 'isotopeRatio',
          value: { atom: 'C', ratio: [50, 50] },
          multiplier: 1,
        },
        { kind: 'atom', value: 'H', multiplier: 1 },
      ],
    ]);

    let newMF = mf.toMF();
    expect(newMF).toBe('CC{50,50}H');

    let info = mf.getInfo();
    expect(info).toStrictEqual({
      monoisotopicMass: 25.00782503223,
      mass: 25.520354068326025,
      charge: 0,
      mf: 'CC{50,50}H',
      unsaturation: 2.5,
      atoms: { C: 2, H: 1 },
    });
  });

  it('H(+)(H+)-1H', () => {
    let mf = new MF('H(+)(H+)-1H');

    let newMF = mf.toMF();
    expect(newMF).toBe('H');

    let info = mf.getInfo();
    expect(info).toStrictEqual({
      atoms: { H: 1 },
      charge: 0,
      mass: 1.0079407540557772,
      mf: 'H',
      monoisotopicMass: 1.00782503223,
      unsaturation: 0.5,
    });
  });

  it('C10#1H20', () => {
    let mf = new MF('C10#1H20');

    let newMF = mf.toMF();
    expect(newMF).toBe('C10H20');

    let info = mf.getInfo();
    expect(info).toStrictEqual({
      mass: 140.26617404846803,
      monoisotopicMass: 140.1565006446,
      charge: 0,
      mf: 'C10H20',
      atoms: { C: 10, H: 20 },
      unsaturation: 1,
    });
  });

  it('2NH3 . 2HCl', () => {
    let mf = new MF('2NH3 . 2HCl');

    let newMF = mf.toMF();
    expect(newMF).toBe('H6N2 . H2Cl2');
  });
});
