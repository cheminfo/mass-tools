'use strict';

const preprocessRanges = require('../preprocessRanges');

describe('preprocessRanges', () => {
    it('check the result and the order', () => {
        let possibilities = preprocessRanges(
            [
                { mf: 'C', min: 0, max: 2 },
                { mf: 'H+', min: 0, max: 2 },
                { mf: 'O', min: 0, max: 0 },
                { mf: 'Cl', min: 0, max: 3 },
                { mf: 'Me', min: 0, max: 1 },
                { mf: 'Ca++', min: 0, max: 1 },
            ]
        );
        expect(Array.isArray(possibilities)).toBeTruthy();
        expect(possibilities).toHaveLength(5);
        expect(possibilities[1]).toMatchObject({ mf: 'H+', isGroup: true, charge: 1, unsaturation: -2 });
    });

    it('check strange parts', () => {
        let possibilities = preprocessRanges(
            [
                { mf: 'H', min: 0, max: 2 },
                { mf: 'H+', min: -2, max: 2 },
                { mf: 'Cl(-)', min: 0, max: 2 },
                { mf: '(C-1H)2', min: 0, max: 2 },
            ]
        );

        expect(Array.isArray(possibilities)).toBeTruthy();
        expect(possibilities[0]).toMatchObject({
            minCharge: -4,
            maxCharge: 2,
            minInnerCharge: -2,
            maxInnerCharge: 2,
        });
    });
});
