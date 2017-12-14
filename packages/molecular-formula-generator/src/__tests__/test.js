'use strict';

const generateMFs = require('..');

test('generateMFs from array of array with comment', function () {
    var mfsArray = [['C', 'H$YY'], [], [''], ['Cl', 'Br$XX']];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('CCl');
    expect(result.length).toBe(4);
});

test('generateMFs from array of string with comment', function () {
    var mfsArray = ['C.H.O', '+,++', ['Cl', 'Br$XX']];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('C+Cl');
    expect(result.length).toBe(12);
});

test('generateMFs from  array of string with some range and non range', function () {
    var mfsArray = ['CN0-2'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('C');
    expect(result[1].mf).toBe('CN');
    expect(result[2].mf).toBe('CN2');
    expect(result.length).toBe(3);
});


test('From array of string with some range and non range CN0-2O00-1K', function () {
    var mfsArray = ['CN0-2O00-1K'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('CK');
    expect(result[1].mf).toBe('CNK');
    expect(result[2].mf).toBe('CN2K');
    expect(result[3].mf).toBe('COK');
    expect(result[4].mf).toBe('CNOK');
    expect(result[5].mf).toBe('CN2OK');
    expect(result.length).toBe(6);
});

test('From array of string with some range and non range NaK0-2', function () {
    var mfsArray = ['NaK0-2'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('Na');
    expect(result[1].mf).toBe('NaK');
    expect(result[2].mf).toBe('NaK2');
    expect(result.length).toBe(3);
});


test('From array of string with some range and non range C(Me(N2))0-2(CH3)0-1K', function () {
    var mfsArray = ['C(Me(N2))0-2(CH3)0-1K'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('CK');
    expect(result[1].mf).toBe('C(Me(N2))K');
    expect(result[2].mf).toBe('C(Me(N2))2K');
    expect(result[3].mf).toBe('C(CH3)K');
    expect(result[4].mf).toBe('C(Me(N2))(CH3)K');
    expect(result[5].mf).toBe('C(Me(N2))2(CH3)K');
    expect(result.length).toBe(6);
});


test('From array of string with some range', function () {
    var mfsArray = ['C1-3N0-2Cl0-0BrO1-1.C2-3H3-4', ['C', 'O']];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('CBrOC');
    expect(result.length).toBe(26);
});

test.only('From array of string chem em and msem', function () {
    var mfsArray = ['C0-2.O', ['+', '-', '++', '--']];
    var mfsArray = ['['-']];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('+');
    expect(result[0].charge).toBe(1);
    expect(result.length).toBe(16);
});


test('From array of string to large array', function () {
    var mfsArray = ['C0-100', 'O0-100'];
    var result = generateMFs(mfsArray);
    expect(result.length).toBe(101 * 101);
});

test('From array of string to large array and filter', function () {
    var mfsArray = ['C0-100', 'O0-100'];
    var result = generateMFs(mfsArray,
        {
            minMass: 0.1,
            maxMass: 13
        });
    expect(result.length).toBe(1);
});

test('Strange comments', function () {
    var mfsArray = ['C$1>10', 'O$D2>20'];
    var result = generateMFs(mfsArray);
    expect(result[0].mf).toBe('CO$1>10 D2>20');
});

