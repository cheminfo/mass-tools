'use strict';

const ELECTRON_MASS = require('chemical-elements').ELECTRON_MASS;
const SpectrumGenerator = require('spectrum-generator').SpectrumGenerator;
const MF = require('mf-parser').MF;
const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');
const getMsInfo = require('mf-utilities/src/getMsInfo');

const Distribution = require('./Distribution');

/**
 * An object containing two arrays
 * @typedef {object} XY
 * @property {Array<number>} x - The x array
 * @property {Array<number>} y - The y array
 */

class IsotopicDistribution {
  /**
   * Class that manage isotopic distribution
   * @param {string|array} value - Molecular formula or an array of parts
   * @param {object} [options={}]
   * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
   * @param {number} [options.fwhm=0.01] - Amount of Dalton under which 2 peaks are joined
   * @param {number} [options.maxLines=5000] - Maximal number of lines during calculations
   * @param {number} [options.minY=1e-8] - Minimal signal height during calculations
   * @param {number} [options.allowNeutral=true] - Should we keep the distribution if the molecule has no charge
   */

  constructor(value, options = {}) {
    if (Array.isArray(value)) {
      this.parts = JSON.parse(JSON.stringify(value));
      for (let part of this.parts) {
        part.confidence = 0;
        part.isotopesInfo = new MF(
          `${part.mf}(${part.ionization.mf})`
        ).getIsotopesInfo();
      }
    } else {
      let mf = new MF(value);
      let mfInfo = mf.getInfo();
      let ionizations = preprocessIonizations(options.ionizations);
      let parts = mfInfo.parts || [mfInfo];
      this.parts = [];
      for (let partOriginal of parts) {
        // we calculate information for each part
        for (const ionization of ionizations) {
          let part = JSON.parse(JSON.stringify(partOriginal));
          part.em = part.monoisotopicMass; // TODO: To remove !!! we change the name !?
          part.isotopesInfo = new MF(
            `${part.mf}(${ionization.mf})`
          ).getIsotopesInfo();
          part.confidence = 0;
          let msInfo = getMsInfo(part, {
            ionization
          });
          part.ionization = msInfo.ionization;
          part.ms = msInfo.ms;
          this.parts.push(part);
        }
      }
    }

    this.cachedDistribution = undefined;
    this.fwhm = options.fwhm === undefined ? 0.01 : options.fwhm;
    // if fwhm is under 1e-8 there are some artifacts in the spectra
    if (this.fwhm < 1e-8) this.fwhm = 1e-8;
    this.minY = options.minY === undefined ? 1e-8 : options.minY;
    this.maxLines = options.maxLines || 5000;
    this.allowNeutral =
      options.allowNeutral === undefined ? true : options.allowNeutral;
  }

  getParts() {
    return this.parts;
  }

  /**
   * @return {Distribution} returns the total distribution (for all parts)
   */
  getDistribution() {
    if (this.cachedDistribution) return this.cachedDistribution;
    let options = {
      maxLines: this.maxLines,
      minY: this.minY,
      deltaX: this.fwhm
    };
    let finalDistribution = new Distribution();
    this.confidence = 0;
    // TODO need to cache each part without ionization
    // in case of many ionization we don't need to recalculate everything !
    for (let part of this.parts) {
      let totalDistribution = new Distribution([
        {
          x: 0,
          y: 1
        }
      ]);
      let charge = part.ms.charge;
      let absoluteCharge = Math.abs(charge);
      if (charge || this.allowNeutral) {
        for (let isotope of part.isotopesInfo.isotopes) {
          if (isotope.number) {
            let isotopeDistribution = new Distribution(isotope.distribution);
            isotopeDistribution.power(isotope.number, options);
            totalDistribution.multiply(isotopeDistribution, options);
          }
        }
        this.confidence += totalDistribution.array.reduce(
          (sum, value) => sum + value.y,
          0
        );

        // we finally deal with the charge

        if (charge) {
          totalDistribution.array.forEach((e) => {
            e.x = (e.x - ELECTRON_MASS * charge) / absoluteCharge;
          });
        }

        if (totalDistribution.array) {
          totalDistribution.sortX();
          part.fromX = totalDistribution.array[0].x;
          part.toX =
            totalDistribution.array[totalDistribution.array.length - 1].x;
        }

        if (
          part.ms.target &&
          part.ms.target.intensity &&
          part.ms.target.intensity !== 1
        ) {
          // intensity is the value of the monoisotopic mass !
          // need to find the intensity of the peak corresponding
          // to the monoisotopic mass
          if (part.ms.target.mass) {
            let target = totalDistribution.closestPointX(part.ms.target.mass);
            totalDistribution.multiplyY(part.ms.target.intensity / target.y);
          } else {
            totalDistribution.multiplyY(part.ms.target.intensity);
          }
        } else if (part.intensity && part.intensity !== 1) {
          totalDistribution.multiplyY(part.intensity);
        }

        part.isotopicDistribution = totalDistribution.array;

        if (finalDistribution.array.length === 0) {
          finalDistribution = totalDistribution;
        } else {
          finalDistribution.append(totalDistribution);
        }
      }
    }
    if (finalDistribution) finalDistribution.join(this.fwhm);
    this.confidence /= this.parts.length;
    this.cachedDistribution = finalDistribution;
    return finalDistribution;
  }

  getCSV() {
    return this.getText(',');
  }

  getTSV() {
    return this.getText('\t');
  }

  getTable() {
    return this.getDistribution().array;
  }

  getText(delimiter = '\t') {
    let points = this.getDistribution().array;
    let csv = [];
    for (let point of points) {
      csv.push(
        `${point.x.toFixed(5)}${delimiter}${(point.y * 100).toFixed(3)}`
      );
    }
    return csv.join('\n');
  }

  /**
   * Returns the isotopic distirubtion
   * @return {XY} an object containing 2 properties: x:[] and y:[]
   */
  getXY(options = {}) {
    const { maxValue = 100 } = options;
    let points = this.getDistribution().array;
    if (points.length === 0) return [];
    let factor = 1;
    if (maxValue) {
      let maxY = points[0].y;
      for (let point of points) {
        if (point.y > maxY) maxY = point.y;
      }
      factor = maxY / maxValue;
    }

    return {
      x: points.map((a) => a.x),
      y: points.map((a) => a.y / factor)
    };
  }

  /**
   * Returns the isotopic distribution as the sum of gaussian
   *  @return {XY} isotopic distribution as an object containing 2 properties: x:[] and y:[]
   */

  getGaussian(options = {}) {
    let distribution = this.getDistribution();
    const {
      gaussianWidth = 10,
      peakWidthFct = () => this.fwhm,
      threshold = 0.0001
    } = options;

    let points = distribution.array;

    let pointsPerUnit = Math.round(gaussianWidth / this.fwhm);
    if (points.length === 0) return [];
    let gaussianOptions = {
      start: Math.floor(options.from || distribution.minX - 2),
      end: Math.ceil(options.to || distribution.maxX + 2),
      pointsPerUnit,
      peakWidthFct
    };

    let spectrumGenerator = new SpectrumGenerator(gaussianOptions);
    for (let point of points) {
      spectrumGenerator.addPeak([point.x, point.y]);
    }
    let spectrum = spectrumGenerator.getSpectrum({ threshold });
    return spectrum;
  }
}

module.exports = IsotopicDistribution;
