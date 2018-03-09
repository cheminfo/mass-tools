'use strict';

const IsotopicDistribution = require('../IsotopicDistribution.js');

describe('test isotopicDistribution', () => {

    it('create distribution of C1 and getGaussian', () => {
        let isotopicDistribution = new IsotopicDistribution('C');
        let gaussian = isotopicDistribution.getGaussian({
            from: 11.00,
            to: 13.00,
            getWidth: () => 0.1,
            pointsPerUnit: 10,
        });
        expect(Math.min(...gaussian.x)).toBe(11);
        expect(Math.max(...gaussian.x)).toBe(13);
        expect(Math.min(...gaussian.y)).toBe(0);
        expect(Math.max(...gaussian.y)).toBe(0.9893);
    });

});
