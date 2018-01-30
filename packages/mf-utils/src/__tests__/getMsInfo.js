'use strict';

const getMsInfo = require('../getMsInfo');


test('getMsInfo', () => {

    let mf = {
        mf: 'C10',
        em: 120,
        charge: 0
    };
    expect(getMsInfo(mf)).toMatchObject({
        ionization: '',
        em: 0,
        charge: 0
    });

    expect(getMsInfo(mf, { allowNeutralMolecules: true })).toMatchObject({
        ionization: '',
        em: 120,
        charge: 0
    });

    expect(getMsInfo(mf, { ionization: { mf: 'H+', charge: 1, em: 1 } })).toMatchObject({
        ionization: 'H+',
        em: 120.99945142009094,
        charge: 1
    });

});

test('getMsInfo with targetMass', () => {

    let mf = {
        mf: 'C10',
        em: 120,
        charge: 0,
    };

    expect(getMsInfo(mf, {
        allowNeutralMolecules: true,
        targetMass: 120,
    })).toMatchObject({
        ionization: '',
        em: 120,
        charge: 0,
        ppm: 0,
        delta: 0
    });

    expect(getMsInfo(mf, {
        ionization: { mf: 'H+', charge: 1, em: 1 }, // we use one as exact mass to test
        targetMass: 121,
    })).toMatchObject({
        ionization: 'H+',
        em: 120.99945142009094,
        charge: 1,
        ppm: 4.5337182567354,
        delta: -0.0005485799090649834,
    });

});
