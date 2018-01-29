'use strict';

const matcher = require('../msemMatcher');

test('test mfFilter', () => {
    let entry = {
        mf: 'C10',
        em: 120,
        msem: 0,
        charge: 0,
        unsaturation: 11,
        atoms: {
            C: 10
        }
    };

    expect(matcher(entry, 120, { minCharge: 1 })).toBeFalsy();
    expect(matcher(entry, 120, { maxCharge: -1 })).toBeFalsy();
    expect(matcher(entry, 120, { maxCharge: 0, modification: { mf: 'H+', charge: 1, em: 0 } })).toEqual({
        msem: 119.99945142009094,
        delta: -0.0005485799090649834,
        ppm: 4.571499242208195,
        modification: 'H+',
        charge: 1 });
    expect(matcher(entry, 120, { modification: { charge: 1, em: 0 }, atoms: {
        N: { min: 10, max: 20 }
    } })).toBeFalsy();
    expect(matcher(entry, 120, { atoms: {
        C: { min: 5, max: 9 }
    } })).toBeFalsy();
    expect(matcher(entry, 120, { modification: { charge: 1, em: 0 }, atoms: {
        C: { min: 10, max: 20 },
        N: { min: 0, max: 10 }
    } })).toBeTruthy();
});
