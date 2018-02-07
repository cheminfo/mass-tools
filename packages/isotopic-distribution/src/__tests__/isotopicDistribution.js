'use strict';

const IsotopicDistribution = require('../index.js');

describe('test isotopicDistribution', () => {

    it('create distribution', () => {
        let distribution = new IsotopicDistribution('C10');
        distribution.getDistribution();
    });


});
