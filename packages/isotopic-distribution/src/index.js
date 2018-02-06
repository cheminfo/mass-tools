'use strict';

const Distribution = require('./Distribution');


// for each element we need to find the isotopes

class IsotopicDistribution {
    constructor(mf) {
        this.mf = mf;
    }

    calculateDistribution() {

        this.distribution = new Distribution();
    }
}

module.exports = IsotopicDistribution;
