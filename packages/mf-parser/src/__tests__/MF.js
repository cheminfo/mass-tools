'use strict';

var MF = require('../MF');

test('MF of C', () => {
    var mf = new MF('C');
    var parts = mf.toParts();

    expect(parts).toEqual([[{ kind: 'atom', value: 'C', multiplier: 1 }]]);

    var newMF = mf.toMF();
    expect(newMF).toBe('C');

    mf.canonize();
    let html = mf.toHtml();

    expect(html).toBe('C');

    let info = mf.getInfo();

    expect(info).toEqual({
        monoisotopicMass: 12,
        mass: 12.010735896735248,
        charge: 0,
        unsaturation: 2,
        mf: 'C',
        atoms: {
            C: 1
        }
    });
});

test('MF of Et3N.HCl', () => {
    var mf = new MF('Et3N.HCl');
    var parts = mf.toParts();

    expect(parts).toEqual([
        [
            { kind: 'atom', value: 'C', multiplier: 6 },
            { kind: 'atom', value: 'H', multiplier: 15 },
            { kind: 'atom', value: 'N', multiplier: 1 }
        ],
        [
            { kind: 'atom', value: 'H', multiplier: 1 },
            { kind: 'atom', value: 'Cl', multiplier: 1 }
        ]
    ]);

    var newMF = mf.toMF();
    expect(newMF).toBe('C6H15N.HCl');

    mf.canonize();
    let html = mf.toHtml();

    expect(html).toBe('C<sub>6</sub>H<sub>15</sub>N•HCl');

    let info = mf.getInfo();
    expect(info).toEqual({
        parts: [
            {
                mass: 101.19022990269394,
                monoisotopicMass: 101.12044948788001,
                charge: 0,
                mf: 'C6H15N',
                unsaturation: 0,
                atoms: { C: 6, H: 15, N: 1 }
            },
            {
                mass: 36.460878336663775,
                monoisotopicMass: 35.97667771423,
                charge: 0,
                mf: 'HCl',
                unsaturation: 0,
                atoms: { H: 1, Cl: 1 }
            }
        ],
        monoisotopicMass: 137.09712720211002,
        mass: 137.6511082393577,
        charge: 0,
        mf: 'C6H15N.HCl'
    });
});

test('MF of (Me2CH)3N no expand', () => {
    var mf = new MF('(Me2CH)3N');
    var parts = mf.toParts({ expand: false });

    expect(parts).toEqual([
        [
            { kind: 'atom', value: 'C', multiplier: 3 },
            { kind: 'atom', value: 'H', multiplier: 3 },
            { kind: 'atom', value: 'Me', multiplier: 6 },
            { kind: 'atom', value: 'N', multiplier: 1 }
        ]
    ]);

    var newMF = mf.toMF();
    expect(newMF).toBe('C3H3Me6N');

    let info = mf.getInfo();
    expect(info).toEqual({
        mass: 143.27008211723435,
        monoisotopicMass: 143.16739968126,
        charge: 0,
        mf: 'C3H3Me6N',
        unsaturation: 0,
        atoms: { C: 3, H: 3, Me: 6, N: 1 }
    });
});

test('MF of (Me2CH)3N with expand', () => {
    var mf = new MF('(Me2CH)3N');
    var parts = mf.toParts({ expand: true });

    expect(parts).toEqual([
        [
            { kind: 'atom', value: 'C', multiplier: 9 },
            { kind: 'atom', value: 'H', multiplier: 21 },
            { kind: 'atom', value: 'N', multiplier: 1 }
        ]
    ]);

    var newMF = mf.toMF();
    expect(newMF).toBe('C9H21N');

    let info = mf.getInfo();
    expect(info).toEqual({
        mass: 143.27008211723435,
        monoisotopicMass: 143.16739968126,
        charge: 0,
        mf: 'C9H21N',
        unsaturation: 0,
        atoms: { C: 9, H: 21, N: 1 }
    });
});

test('MF of (+)SO4(+)(-2)2', () => {
    var mf = new MF('(+)SO4(+)(-2)2');
    var parts = mf.toParts();

    expect(parts).toEqual([
        [
            { kind: 'atom', value: 'O', multiplier: 4 },
            { kind: 'atom', value: 'S', multiplier: 1 },
            { kind: 'charge', value: -2 }
        ]
    ]);

    var newMF = mf.toMF();
    expect(newMF).toBe('O4S(-2)');

    let info = mf.getInfo({
        customUnsaturations: {
            S: 4
        }
    });
    expect(info).toEqual({
        monoisotopicMass: 95.95172965268,
        mass: 96.06240710340018,
        charge: -2,
        observedMonoisotopicMass: 47.97641340624907,
        mf: 'O4S(-2)',
        unsaturation: 4,
        atoms: { O: 4, S: 1 }
    });
});

test('test unsaturation with charges', () => {
    expect(new MF('CH4').getInfo().unsaturation).toBe(0);
    expect(new MF('C10H22O').getInfo().unsaturation).toBe(0);
    expect(new MF('H+').getInfo().unsaturation).toBe(0);
    expect(new MF('CO3(--)').getInfo().unsaturation).toBe(3);
    expect(new MF('HO(-)').getInfo().unsaturation).toBe(1);
    expect(new MF('F(-)').getInfo().unsaturation).toBe(1);
    expect(new MF('Na+').getInfo().unsaturation).toBe(0);
    expect(new MF('NH4+').getInfo().unsaturation).toBe(-1);
});

test('MF of NC[13C][15N]2NN2', () => {
    var mf = new MF('NC[13C][15N]2NN2');
    var parts = mf.toParts();
    expect(parts).toEqual([
        [
            { kind: 'atom', value: 'C', multiplier: 1 },
            {
                kind: 'isotope',
                value: { atom: 'C', isotope: 13 },
                multiplier: 1
            },
            { kind: 'atom', value: 'N', multiplier: 4 },
            {
                kind: 'isotope',
                value: { atom: 'N', isotope: 15 },
                multiplier: 2
            }
        ]
    ]);

    let info = mf.getInfo();
    expect(info).toEqual({
        monoisotopicMass: 111.01586865055,
        mass: 111.04112137534844,
        charge: 0,
        mf: 'C[13C]N4[15N]2',
        unsaturation: 6,
        atoms: { C: 2, N: 6 }
    });

    var newMF = mf.toMF();
    expect(newMF).toBe('C[13C]N4[15N]2');
});

test('MF of DNA HODampDtmpDcmpDgmpH  ', () => {
    var mf = new MF('HODampDtmpDgmpDcmpH');
    var info = mf.getInfo();
    expect(info).toEqual({ mass: 1253.8043977028433,
        monoisotopicMass: 1253.21310019311,
        charge: 0,
        mf: 'C39H51N15O25P4',
        atoms: { C: 39, H: 51, N: 15, O: 25, P: 4 },
        unsaturation: 24 });
});

test('MF of RNA HOAmpUmpH  ', () => {
    var mf = new MF('HOAmpUmpH');
    var info = mf.getInfo();
    expect(info).toEqual({ mass: 653.388021231099,
        monoisotopicMass: 653.08838712715,
        charge: 0,
        mf: 'C19H25N7O15P2',
        atoms: { C: 19, H: 25, N: 7, O: 15, P: 2 },
        unsaturation: 12 });
});

test('MF of CC{50,50}H', () => {
    var mf = new MF('HC{50,50}C');
    var parts = mf.toParts();
    expect(parts).toEqual([
        [
            { kind: 'atom', value: 'C', multiplier: 1 },
            {
                kind: 'isotopeRatio',
                value: { atom: 'C', ratio: [50, 50] },
                multiplier: 1
            },
            { kind: 'atom', value: 'H', multiplier: 1 }
        ]
    ]);

    var newMF = mf.toMF();
    expect(newMF).toBe('CC{50,50}H');

    let info = mf.getInfo();
    expect(info).toEqual({
        monoisotopicMass: 25.00782503223,
        mass: 25.520354068326025,
        charge: 0,
        mf: 'CC{50,50}H',
        unsaturation: 2.5,
        atoms: { C: 2, H: 1 }
    });
});
