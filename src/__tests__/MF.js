'use strict';

var MF = require('../MF');

test('MF of Et3N.HCl', () => {
    var mf = new MF('Et3N.HCl');
    var parts = mf.toParts();

    expect(parts).toEqual(
        [[
            {kind: 'atom', value: 'C', multiplier: 6},
            {kind: 'atom', value: 'H', multiplier: 15},
            {kind: 'atom', value: 'N', multiplier: 1}
        ], [
            {kind: 'atom', value: 'H', multiplier: 1},
            {kind: 'atom', value: 'Cl', multiplier: 1}
        ]]
    );

    var newMF = mf.toMF();
    expect(newMF).toBe('C6H15N.HCl');

    mf.canonize();
    let html = mf.toHtml();

    expect(html).toBe('C<sub>6</sub>H<sub>15</sub>N<sub>1</sub> • H<sub>1</sub>Cl<sub>1</sub>');

    let info = mf.getInfo();
    expect(info).toEqual({parts:
        [{mass: 101.19022990269394,
            monoisotopicMass: 101.12044948788001,
            charge: 0,
            mf: 'C6H15N'},
        {mass: 36.460878336663775,
            monoisotopicMass: 35.97667771423,
            charge: 0,
            mf: 'HCl'}],
    monoisotopicMass: 137.09712720211002,
    mass: 137.6511082393577,
    charge: 0,
    mf: 'C6H15N.HCl'}
    );
});

test('MF of (-)SO4(-)(+2)2', () => {
    var mf = new MF('(-)SO4(-)(+2)2');
    var parts = mf.toParts();

    expect(parts).toEqual(
        [[
            {kind: 'atom', value: 'O', multiplier: 4},
            {kind: 'atom', value: 'S', multiplier: 1},
            {kind: 'charge', value: 2},
        ]]
    );

    var newMF = mf.toMF();
    expect(newMF).toBe('O4S(+2)');

    let info = mf.getInfo();
    expect(info).toEqual([]);

});

test('MF of NC[13C][15N]2NN2', () => {
    var mf = new MF('NC[13C][15N]2NN2');
    var parts = mf.toParts();
    expect(parts).toEqual(
        [[
            {kind: 'atom', value: 'C', multiplier: 1},
            {kind: 'isotope', value: {atom: 'C', isotope: 13}, multiplier: 1},
            {kind: 'atom', value: 'N', multiplier: 4},
            {kind: 'isotope', value: {atom: 'N', isotope: 15}, multiplier: 2}
        ]]
    );

    var newMF = mf.toMF();
    expect(newMF).toBe('C[13C]N4[15N]2');
});
