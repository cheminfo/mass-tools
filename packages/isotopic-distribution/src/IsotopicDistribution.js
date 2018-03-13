'use strict';

const Distribution = require('./Distribution');
const ELECTRON_MASS = require('chemical-elements').ELECTRON_MASS;
const SpectrumGenerator = require('spectrum-generator').SpectrumGenerator;

// for each element we need to find the isotopes

const MF = require('mf-parser').MF;
const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');
const getMsInfo = require('mf-utilities/src/getMsInfo');

/**
    * An object containing two arrays
    * @typedef {object} XY
    * @property {Array<number>} x - The x array
    * @property {Array<number>} y - The y array
*/


class IsotopicDistribution {


    /**
     * Class that manage isotopic distribution
     * @param {string} mf - Molecular formula
     * @param {object} [options={}]
     * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
     * @param {number} [options.fwhm=0.01] - Amount of Dalton under which 2 peaks are joined
     * @param {number} [options.maxLines=5000] - Maximal number of lines during calculations
     * @param {number} [options.minY=1e-8] - Minimal signal height during calculations
     */

    constructor(mf, options = {}) {
        this.ionizations = preprocessIonizations(options.ionizations);
        this.mf = new MF(mf);
        this.mfInfo = this.mf.getInfo();
        let parts = this.mfInfo.parts || [this.mfInfo];
        this.parts = [];
        for (let partOriginal of parts) { // we calculate informations for each part
            for (const ionization of this.ionizations) {
                let part = JSON.parse(JSON.stringify(partOriginal));
                part.isotopesInfo = (new MF(part.mf)).getIsotopesInfo();
                part.confidence = 0;
                part.ionization = ionization;
                part.ms = getMsInfo(part, {
                    ionization,
                });
                this.parts.push(part);
            }
        }
        this.options = options;
        this.fwhm = options.fwhm || 0.01;
        this.minY = options.minY || 1e-8;
        this.maxLines = options.maxLines || 5000;
    }

    getParts() {
        return this.parts;
    }

    /**
     * @return {Distribution} returns the total distribution (for all parts)
     */

    getDistribution() {
        let options = {
            maxLines: this.maxLines,
            minY: this.minY,
            deltaX: this.fwhm,
        };
        let finalDistribution;
        this.confidence = 0;
        for (let i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            let totalDistribution = new Distribution([{ x: 0, y: 1 }]);

            for (let isotope of part.isotopesInfo.isotopes) {
                if (isotope.number) {
                    let isotopeDistribution = new Distribution(isotope.distribution);
                    isotopeDistribution.power(isotope.number, options);
                    totalDistribution.multiply(isotopeDistribution, options);
                }
            }
            this.confidence += totalDistribution.array.reduce((sum, value) => (sum + value.y), 0);

            // we finally deal with the charge
            let charge = part.isotopesInfo.charge + part.ionization.charge;
            let absoluteCharge = Math.abs(charge);
            if (charge) {
                totalDistribution.array.forEach((e) => {
                    e.x = (e.x + part.ionization.em - ELECTRON_MASS * charge) / absoluteCharge;
                });
            }
            if (i === 0) {
                finalDistribution = totalDistribution;
            } else {
                finalDistribution.append(totalDistribution);
            }
        }
        finalDistribution.join(this.fwhm);
        this.confidence /= this.parts.length;
        return finalDistribution;
    }

    /**
     * Returns the isotopic distirubtion
     * @return {XY} an object containing 2 properties: x:[] and y:[]
     */
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

    /**
     * Returns the isotopic distirubtion as the sum of gaussians
     *  @return {XY} isotopic distribution as an object containing 2 properties: x:[] and y:[]
     */

    getGaussian(options = {}) {
        let distribution = this.getDistribution();
        let points = distribution.array;
        let pointsPerUnit = 10 / this.fwhm;
        if (points.length === 0) return [];
        let gaussianOptions = {
            start: Math.floor(options.from || distribution.minX - 10),
            end: Math.ceil(options.to || distribution.maxX + 10),
            pointsPerUnit,
            getWidth: options.getWidth ? options.getWidth : () => this.fwhm,
            maxSize: options.maxSize
        };

        let spectrumGenerator = new SpectrumGenerator(gaussianOptions);
        for (let point of points) {
            spectrumGenerator.addPeak([point.x, point.y]);
        }
        let spectrum = spectrumGenerator.getSpectrum();
        return spectrum;
    }

}

module.exports = IsotopicDistribution;
