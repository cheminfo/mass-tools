'use strict';

const generateMFs = require('..');

test('generateMFs from array of array with comment', function () {
    var mfsArray = [['C', 'H$YY'], [], [''], ['Cl', 'Br$XX']];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('HCl');
    expect(result[0].comment).toBe('YY');
    expect(result).toHaveLength(4);
});

test('generateMFs from array of string with comment', function () {
    var mfsArray = ['C.H.O', '+,++', ['Cl', 'Br$XX']];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('HCl(+2)');
    expect(result).toHaveLength(12);
});

test('generateMFs from  array of string with some range and non range', function () {
    var mfsArray = ['CN0-2'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('C');
    expect(result[1].mf).toBe('CN');
    expect(result[2].mf).toBe('CN2');
    expect(result).toHaveLength(3);
});

test('From array of string with some range and non range CN0-2O00-1K', function () {
    var mfsArray = ['CN0-2O00-1K'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('CK');
    expect(result[1].mf).toBe('CKN');
    expect(result[2].mf).toBe('CKO');
    expect(result[3].mf).toBe('CKN2');
    expect(result[4].mf).toBe('CKNO');
    expect(result[5].mf).toBe('CKN2O');
    expect(result).toHaveLength(6);
});

test('From array of string with some range and non range NaK0-2', function () {
    var mfsArray = ['NaK0-2'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('Na');
    expect(result[1].mf).toBe('KNa');
    expect(result[2].mf).toBe('K2Na');
    expect(result).toHaveLength(3);
});

test('From array of string with some range and non range C(Me(N2))0-2(CH3)0-1K', function () {
    var mfsArray = ['C(Me(N2))0-2(CH3)0-1K'];
    var result = generateMFs(mfsArray, {
        canonizeMF: false,
        uniqueMFs: false });
    expect(result[0].mf).toBe('CK');
    expect(result[1].mf).toBe('C(CH3)K');
    expect(result[2].mf).toBe('C(Me(N2))K');
    expect(result[3].mf).toBe('C(Me(N2))(CH3)K');
    expect(result[4].mf).toBe('C(Me(N2))2K');
    expect(result[5].mf).toBe('C(Me(N2))2(CH3)K');
    expect(result).toHaveLength(6);
});

test('From array of string with some range', function () {
    var mfsArray = ['C1-3N0-2Cl0-0BrO1-1.C2-3H3-4', ['C', 'O']];
    var result = generateMFs(mfsArray, { canonizeMF: true });
    expect(result[0].mf).toBe('C3H3');
    expect(result).toHaveLength(26);
});

test('From array of string chem em and msem', function () {
    var mfsArray = ['C0-2.O', ['+', '(-)', '++', '(--)']];

    var result = generateMFs(mfsArray);
    expect(result[0].mf).toMatch(/^(.*)$/);
    expect(result[0].charge).not.toBe(0);
    expect(result).toHaveLength(16);
});

test('From array of string to large array', function () {
    var mfsArray = ['C0-100', 'O0-100'];
    var result = generateMFs(mfsArray);
    expect(result).toHaveLength(101 * 101);
});

test('From array of string to large array and filter', function () {
    var mfsArray = ['C0-100', 'O0-100'];
    var result = generateMFs(mfsArray, {
        filter: {
            minEM: 0.1,
            maxEM: 13
        }
    }
    );
    expect(result).toHaveLength(1);
});

test('From array of string to large array and filter unsaturation', function () {
    var mfsArray = ['C0-100', 'H0-100'];
    var result = generateMFs(mfsArray, {
        filter: {
            minUnsaturation: 0,
            maxUnsaturation: 1
        }
    });
    expect(result).toHaveLength(151);
});

test('From array of string to large array and filter unsaturation min/max and integer unsaturation', function () {
    var mfsArray = ['C0-100', 'H0-100'];
    var result = generateMFs(mfsArray, {
        filter: {
            minUnsaturation: 0,
            maxUnsaturation: 1,
            onlyIntegerUnsaturation: true
        }
    });
    expect(result).toHaveLength(101);
});

test('Combine with ionizations', function () {
    var result = generateMFs(['C1-2'], { ionizations: 'H+,Na+,H++' });
    expect(result.map((a) => a.ms.em).sort((a, b) => a - b)).toEqual([
        6.50336393620593,
        12.503363936205929,
        13.00727645232093,
        25.00727645232093,
        34.989220702090925,
        46.989220702090925,
    ]);
});

test('Strange comments', function () {
    var mfsArray = ['C$1>10', 'O$D2>20'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('CO');
    expect(result[0].comment).toBe('1>10 D2>20');
});

test('Check info', function () {
    var mfsArray = ['C', '', 'C5(C)2'];
    var result = generateMFs(mfsArray, { canonizeMF: true })[0];
    expect(result).toEqual({ mf: 'C8',
        em: 96,
        ms: {
            em: 0,
            charge: 0,
            ionization: ''
        },
        mw: 96.08588717388199,
        charge: 0,
        ionization: {
            mf: '',
            charge: 0,
            em: 0
        },
        parts: ['C', undefined, 'C5(C)2'],
        atoms: { C: 8 },
        unsaturation: 9
    });
});
