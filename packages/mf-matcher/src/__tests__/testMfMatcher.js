'use strict';

const matcher = require('..');

test('test mfFilter', () => {
    let entry = {
        mf: 'C10',
        mw: 120.11,
        em: 120,
        msem: 0,
        charge: 0,
        unsaturation: 11,
        atoms: {
            C: 10
        }
    };

    expect(matcher(entry, { minCharge: 1 })).toBeFalsy();
    expect(matcher(entry, { maxCharge: -1 })).toBeFalsy();
    expect(matcher(entry, { maxCharge: 0 })).toBeTruthy();
    expect(matcher(entry, { minCharge: -1 })).toBeTruthy();
    expect(matcher(entry, { atoms: {
        C: { min: 10, max: 20 }
    } })).toBeTruthy();
    expect(matcher(entry, { atoms: {
        N: { min: 10, max: 20 }
    } })).toBeFalsy();
    expect(matcher(entry, { atoms: {
        C: { min: 5, max: 9 }
    } })).toBeFalsy();
    expect(matcher(entry, { atoms: {
        C: { min: 10, max: 20 },
        N: { min: 0, max: 10 }
    } })).toBeTruthy();
});
