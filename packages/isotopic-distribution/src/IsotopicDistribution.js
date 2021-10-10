'use strict';

const ELECTRON_MASS = require('chemical-elements').ELECTRON_MASS;
const SpectrumGenerator = require('spectrum-generator').SpectrumGenerator;
const MF = require('mf-parser').MF;
const getMsInfo = require('mf-utilities/src/getMsInfo');
const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');

const Distribution = require('./Distribution');
const getDerivedCompositionInfo = require('./utils/getDerivedCompositionInfo');

const MINIMAL_FWHM = 1e-8;

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
   * @param {number} [options.ensureCase=false] - Ensure uppercase / lowercase
   * @param {number} [options.allowNeutral=true] - Should we keep the distribution if the molecule has no charge
   */

  constructor(value, options = {}) {
    if (Array.isArray(value)) {
      this.parts = JSON.parse(JSON.stringify(value));
      for (let part of this.parts) {
        part.confidence = 0;
        part.isotopesInfo = new MF(
          `${part.mf}(${part.ionization.mf})`,
        ).getIsotopesInfo();
      }
    } else {
      let mf = new MF(value, { ensureCase: options.ensureCase });
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
            `${part.mf}(${ionization.mf})`,
          ).getIsotopesInfo();
          part.confidence = 0;
          let msInfo = getMsInfo(part, {
            ionization,
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
    if (this.fwhm < MINIMAL_FWHM) this.fwhm = MINIMAL_FWHM;
    this.minY = options.minY === undefined ? MINIMAL_FWHM : options.minY;
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
      deltaX: this.fwhm,
    };
    let finalDistribution = new Distribution();
    this.confidence = 0;
    // TODO need to cache each part without ionization
    // in case of many ionization we don't need to recalculate everything !
    for (let part of this.parts) {
      let totalDistribution = new Distribution([
        {
          x: 0,
          y: 1,
          composition: this.fwhm === MINIMAL_FWHM ? {} : undefined,
        },
      ]);
      let charge = part.ms.charge;
      let absoluteCharge = Math.abs(charge);
      if (charge || this.allowNeutral) {
        for (let isotope of part.isotopesInfo.isotopes) {
          if (isotope.number < 0) return [];
          if (isotope.number > 0) {
            const newDistribution = JSON.parse(
              JSON.stringify(isotope.distribution),
            );
            if (this.fwhm === MINIMAL_FWHM) {
              // add composition
              for (const entry of newDistribution) {
                entry.composition = { [Math.round(entry.x) + isotope.atom]: 1 };
              }
            }
            let distribution = new Distribution(newDistribution);
            distribution.power(isotope.number, options);
            totalDistribution.multiply(distribution, options);
          }
        }
        this.confidence += totalDistribution.array.reduce(
          (sum, value) => sum + value.y,
          0,
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
    if (finalDistribution) finalDistribution.joinX(this.fwhm);

    for (let entry of finalDistribution.array) {
      if (!entry.composition) continue;
      Object.assign(entry, getDerivedCompositionInfo(entry.composition));
    }

    this.confidence /= this.parts.length;
    this.cachedDistribution = finalDistribution;
    return finalDistribution;
  }

  getCSV() {
    return this.getText({ delimiter: ', ' });
  }

  getTSV() {
    return this.getText({ delimiter: '\t' });
  }

  getTable(options = {}) {
    const { maxValue, xLabel = 'x', yLabel = 'y' } = options;
    let points = this.getDistribution().array;
    let factor = 1;
    if (maxValue) {
      let maxY = this.getMaxY(points);
      factor = maxValue / maxY;
    }
    return points.map((point) => {
      let newPoint = {};
      newPoint[xLabel] = point.x;
      newPoint[yLabel] = point.y * factor;
      return newPoint;
    });
  }

  getText(options = {}) {
    const { delimiter = '\t', numberDecimals = 3 } = options;
    let points = this.getDistribution().array;
    let csv = [];
    for (let point of points) {
      csv.push(
        `${point.x.toFixed(5)}${delimiter}${(point.y * 100).toFixed(
          numberDecimals,
        )}`,
      );
    }
    return csv.join('\n');
  }

  getMaxY(points) {
    let maxY = points[0].y;
    for (let point of points) {
      if (point.y > maxY) maxY = point.y;
    }
    return maxY;
  }

  getSumY(points) {
    let sumY = 0;
    for (let point of points) {
      sumY += point.y;
    }
    return sumY;
  }

  /**
   * Returns the isotopic distirubtion
   * @param {object} [options={}]
   * @param {number} [options.maxValue=100]
   * @param {number} [options.sumValue] // if sumValue is defined, maxValue is ignored
   * @return {XY} an object containing 2 properties: x:[] and y:[]
   */
  getXY(options = {}) {
    const { maxValue = 100, sumValue } = options;
    let points = this.getDistribution().array;
    if (points.length === 0) return [];
    let factor = 1;
    if (sumValue) {
      let sumY = this.getSumY(points);
      factor = sumY / sumValue;
    } else if (maxValue) {
      let maxY = this.getMaxY(points);
      factor = maxY / maxValue;
    }

    return {
      x: points.map((a) => a.x),
      y: points.map((a) => a.y / factor),
    };
  }

  /**
   * Returns the isotopic distribution as the sum of gaussian
   * @param {object} [options={}]
   * @param {number} [options.gaussianWidth=10]
   * @param {number} [options.threshold=0.00001] // minimal height to return point
   * @param {number} [options.maxLength=1e6] // minimal height to return point
   * @param {number} [options.maxValue] // rescale Y to reach maxValue
   * @param {function} [options.peakWidthFct=(mz)=>(this.fwhm)]
   * @return {XY} isotopic distribution as an object containing 2 properties: x:[] and y:[]
   */

  getGaussian(options = {}) {
    const {
      peakWidthFct = () => this.fwhm,
      threshold = 0.00001,
      gaussianWidth = 10,
      maxValue,
      maxLength = 1e6,
    } = options;

    let points = this.getTable({ maxValue });
    if (points.length === 0) return { x: [], y: [] };
    const from = Math.floor(options.from || points[0].x - 2);
    const to = Math.ceil(options.to || points[points.length - 1].x + 2);
    const nbPoints = Math.round(((to - from) * gaussianWidth) / this.fwhm + 1);
    if (nbPoints > maxLength) {
      throw Error(
        `Number of points is over the maxLength: ${nbPoints}>${maxLength}`,
      );
    }
    let gaussianOptions = {
      from,
      to,
      nbPoints,
      peakWidthFct,
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
