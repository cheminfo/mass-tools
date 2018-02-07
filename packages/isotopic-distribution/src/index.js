'use strict';

const Distribution = require('./Distribution');


// for each element we need to find the isotopes

const MF = require('mf-parser').MF;

class IsotopicDistribution {
    constructor(mf) {
        this.mf = new MF(mf);
        this.isotopesInfo = this.mf.getIsotopesInfo();
        this.cache = {};
        console.log(this.isotopes);
    }

    getDistribution() {
        if (this.cache.distribution) return this.cache.distribution;
        let totalDistribution = new Distribution([{ x: 0, y: 1 }]);
        console.log(this.isotopes);

        for (let isotope of this.isotopesInfo.isotopes) {
            let isotopeDistribution = new Distribution(isotope.distribution);
            isotopeDistribution.power(isotope.number);
            totalDistribution.multiply(isotopeDistribution);
        }
        console.log(totalDistribution);
        this.cache.distribution = totalDistribution;
        return this.cache.distribution;
    }
}

module.exports = IsotopicDistribution;
