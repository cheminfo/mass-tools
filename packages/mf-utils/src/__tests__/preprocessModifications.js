'use strict';

const preprocessModifications = require('../preprocessModifications');

describe('preprocessModifications', () => {
    it('check modifications', () => {
        let modifications = preprocessModifications('H+,Na+,(H+)2, K+');
        expect(modifications).toHaveLength(4);
        expect(modifications[0]).toMatchObject({ mf: 'H+', em: 1.00782503223, charge: 1 });
    });


});
