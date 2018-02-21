'use strict';

const Distribution = require('./Distribution');
const ELECTRON_MASS = require('chemical-elements').ELECTRON_MASS;

// for each element we need to find the isotopes

const MF = require('mf-parser').MF;

class IsotopicDistribution {
    constructor(mf, options = {}) {
        this.mf = new MF(mf);
        this.isotopesInfo = this.mf.getIsotopesInfo();
        this.charge = this.isotopesInfo.charge;
        this.absoluteCharge = Math.abs(this.isotopesInfo.charge);
        this.cache = {};
        this.options = options;
        this.fwhm = options.fwhm || 0.001;
        this.confidence = 0;
    }

    getDistribution() {
        let options = {
            threshold: this.fwhm
        };
        if (this.cache.distribution) return this.cache.distribution;
        let totalDistribution = new Distribution([{ x: 0, y: 1 }]);

        for (let isotope of this.isotopesInfo.isotopes) {
            let isotopeDistribution = new Distribution(isotope.distribution);
            isotopeDistribution.power(isotope.number, options);
            totalDistribution.multiply(isotopeDistribution, options);
        }
        this.cache.distribution = totalDistribution;
        this.confidence = this.cache.distribution.array.reduce((sum, value) => (sum + value.y), 0);

        // we finally deal with the charge
        if (this.isotopesInfo.charge) {
            this.cache.distribution.array.forEach((e) => {
                e.x = (e.x - ELECTRON_MASS * this.charge) / this.absoluteCharge;
            });
        }

        return this.cache.distribution;
    }

    getXY() {
        let points = this.getDistribution().array;
        if (points.length === 0) return [];
        let maxY = points[0].y;
        for (let point of points) {
            if (point.y > maxY) maxY = point.y;
        }
        maxY /= 100;

        return {
            x: points.map((a) => a.x),
            y: points.map((a) => a.y / maxY)
        };
    }

}

module.exports = IsotopicDistribution;
