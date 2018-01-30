'use strict';

const preprocessIonizations = require('../preprocessIonizations');

describe('preprocessIonizations', () => {
    it('check ionizations', () => {
        let ionizations = preprocessIonizations('H+,Na+,(H+)2, K+');
        expect(ionizations).toHaveLength(4);
        expect(ionizations[0]).toMatchObject({ mf: 'H+', em: 1.00782503223, charge: 1 });
        expect(ionizations[2]).toMatchObject({ mf: '(H+)2', em: 2.01565006446, charge: 2 });
    });
});
