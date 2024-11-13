import { ELECTRON_MASS } from 'chemical-elements';
import { MF } from 'mf-parser';
import { preprocessIonizations, getMsInfo } from 'mf-utilities';
import { SpectrumGenerator } from 'spectrum-generator';

import { Distribution } from './Distribution';
import { getDerivedCompositionInfo } from './utils/getDerivedCompositionInfo';

const MINIMAL_FWHM = 1e-8;

/** @typedef {import('mf-parser').IsotopesInfo} IsotopesInfo */
/** @typedef {import('mf-parser').PartInfo} PartInfo */

/** @typedef {import('./IsotopicDistribution.types').XY} XY */
/** @typedef {import('./IsotopicDistribution.types').IsotopicDistributionPart} IsotopicDistributionPart */
/** @typedef {import('./IsotopicDistribution.types').IsotopicDistributionOptions} IsotopicDistributionOptions */

/**
 * A class that allows to manage isotopic distribution
 */
export class IsotopicDistribution {
  /**
   * Class that manages isotopic distribution
   * @param {string|Array<any>} value - Molecular formula or an array of parts.
   * @param {IsotopicDistributionOptions} [options]
   */
  constructor(value, options = {}) {
    this.threshold = options.threshold;
    this.limit = options.limit;
    if (Array.isArray(value)) {
      this.parts = structuredClone(value);
      for (let part of this.parts) {
        part.confidence = 0;
        part.isotopesInfo = new MF(
          `${part.mf}(${part.ionization.mf})`,
        ).getIsotopesInfo();
      }
    } else {
      let mf = new MF(value, { ensureCase: options.ensureCase });
      let mfInfo = mf.getInfo();
      const ionizations = preprocessIonizations(options.ionizations);
      /** @type {PartInfo} */
      const parts = 'parts' in mfInfo ? mfInfo.parts : [mfInfo];
      this.parts = [];
      for (let partOriginal of parts) {
        // we calculate information for each part
        for (const ionization of ionizations) {
          let part = structuredClone(partOriginal);
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

  /**
   * @returns {Array<IsotopicDistributionPart>}
   */
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
          composition: this.fwhm === MINIMAL_FWHM ? {} : undefined, // should we calculate composition in isotopes of each peak
        },
      ]);
      let charge = part.ms.charge;
      let absoluteCharge = Math.abs(charge);
      if (charge || this.allowNeutral) {
        for (let isotope of part.isotopesInfo.isotopes) {
          if (isotope.number < 0) return { array: [] };
          if (isotope.number > 0) {
            const newDistribution = structuredClone(isotope.distribution);
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
        this.confidence = 0;
        for (const item of totalDistribution.array) {
          this.confidence += item.y;
        }

        // we finally deal with the charge

        if (charge) {
          for (const e of totalDistribution.array) {
            e.x = (e.x - ELECTRON_MASS * charge) / absoluteCharge;
          }
        }

        if (totalDistribution.array && totalDistribution.array.length > 0) {
          totalDistribution.sortX();
          part.fromX = totalDistribution.array[0].x;
          part.toX = totalDistribution.array.at(-1).x;
        }

        if (part?.ms.similarity?.factor) {
          totalDistribution.multiplyY(part.ms.similarity.factor);
        } else if (
          part.ms?.target?.intensity &&
          part.ms?.target?.intensity !== 1
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
        } else if (part?.intensity && part?.intensity !== 1) {
          totalDistribution.multiplyY(part.intensity);
        }

        part.isotopicDistribution = totalDistribution.array;

        const absoluteChargeOrOne = absoluteCharge || 1;

        for (let entry of totalDistribution.array) {
          if (!entry.composition) continue;
          const deltaNeutrons =
            Math.round(entry.x * absoluteChargeOrOne - part.monoisotopicMass) +
            0; // +0 to avoid -0
          Object.assign(entry, {
            ...getDerivedCompositionInfo(entry.composition),
            deltaNeutrons,
          });
        }

        if (finalDistribution.array.length === 0) {
          finalDistribution = totalDistribution;
        } else {
          finalDistribution.append(totalDistribution);
        }
      }
    }
    if (finalDistribution) finalDistribution.joinX(this.fwhm);

    // if there is a threshold we will deal with it
    // and we will correct the confidence
    if (this.threshold || this.limit) {
      const sumBefore = finalDistribution.sumY;
      if (this.threshold) finalDistribution.threshold(this.threshold);
      if (this.limit) {
        finalDistribution.topY(this.limit);
        finalDistribution.sortX();
      }
      const sumAfter = finalDistribution.sumY;
      this.confidence = (this.confidence * sumAfter) / sumBefore;
    }

    this.confidence /= this.parts.length;
    this.cachedDistribution = finalDistribution;
    return finalDistribution;
  }

  /**
   *
   * @param {object} options
   * @param {string} [options.delimiter=', ']
   * @param {number} [options.numberXDecimals=4]
   * @param {number} [options.numberYDecimals=4]
   * @returns
   */
  getCSV(options) {
    return this.getText({ ...options, delimiter: ', ' });
  }

  /**
   *
   * @param {object} options
   * @param {string} [options.delimiter='\t']
   * @param {number} [options.numberXDecimals=4]
   * @param {number} [options.numberYDecimals=4]
   * @returns
   */
  getTSV(options) {
    return this.getText({ ...options, delimiter: '\t' });
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

  /**
   *
   * @param {object} options
   * @param {string} [options.delimiter='\t']
   * @param {number} [options.numberXDecimals=4]
   * @param {number} [options.numberYDecimals=4]
   * @returns
   */
  getText(options = {}) {
    const {
      delimiter = '\t',
      numberXDecimals = 5,
      numberYDecimals = 3,
    } = options;
    let points = this.getDistribution().array;
    let csv = [];
    for (let point of points) {
      csv.push(
        `${point.x.toFixed(numberXDecimals)}${delimiter}${(
          point.y * 100
        ).toFixed(numberYDecimals)}`,
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
   * Returns the isotopic distribution as an array of peaks
   * @param {object} [options={}]
   * @param {number} [options.maxValue=100]
   * @param {number} [options.sumValue] // if sumValue is defined, maxValue is ignored
   * @return {Array<{x:number,y:number}|{x:number,y:number,label:string,shortComposition:string,shortLabel:string,deltaNeutrons:number}>}
   */
  getPeaks(options = {}) {
    const { maxValue = 100, sumValue } = options;
    let peaks = this.getDistribution().array;
    if (peaks.length === 0) return [];
    let factor = 1;
    if (sumValue) {
      let sumY = this.getSumY(peaks);
      factor = sumY / sumValue;
    } else if (maxValue) {
      let maxY = this.getMaxY(peaks);
      factor = maxY / maxValue;
    }
    if (factor !== 1) {
      // we need to copy the array because we prefer no side effects
      peaks = structuredClone(peaks);
      for (const peak of peaks) {
        peak.y = peak.y / factor;
      }
    }
    return peaks;
  }

  /**
   * Returns the isotopic distirubtion
   * @param {object} [options={}]
   * @param {number} [options.maxValue=100]
   * @param {number} [options.sumValue] // if sumValue is defined, maxValue is ignored
   * @return {{x:number[],y:number[]}|{x:number[],y:number[],label:string[],shortComposition:string[],shortLabel:string[],deltaNeutrons:[]}}
   */
  getXY(options = {}) {
    let peaks = this.getPeaks(options);

    if (peaks.length === 0) {
      return { x: [], y: [] };
    }

    const result = {
      x: peaks.map((a) => a.x),
      y: peaks.map((a) => a.y),
    };

    for (let key of Object.keys(peaks[0]).filter(
      (k) => k !== 'x' && k !== 'y',
    )) {
      result[key] = peaks.map((a) => a[key]);
    }

    return result;
  }

  /**
   * Returns the isotopic distirubtion
   * @param {object} [options={}]
   * @param {number} [options.maxValue=100]
   * @param {number} [options.sumValue] // if sumValue is defined, maxValue is ignored
   * @return {import('cheminfo-types').MeasurementXYVariables} an object containing at least the 2 properties: x:[] and y:[]
   */
  getVariables(options = {}) {
    const xy = this.getXY(options);

    return {
      x: { data: xy.x, label: 'm/z', units: 'u' },
      y: { data: xy.y, label: 'Relative intensity', units: '%' },
    };
  }

  /**
   * Returns the isotopic distribution as the sum of gaussian
   * @param {object} [options={}]
   * @param {number} [options.gaussianWidth=10] // how good should look the gaussian ? By default we take 10 times the fwhm as number of points
   * @param {number} [options.threshold=0.00001] // minimal height to return point
   * @param {number} [options.maxLength=1e6] // minimal height to return point
   * @param {number} [options.maxValue] // rescale Y to reach maxValue
   * @param {number} [options.from] // minimal x value, default to the first point - 2
   * @param {number} [options.to] // maximal x value, default to the last point + 2
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
    const to = Math.ceil(options.to || points.at(-1).x + 2);
    const nbPoints = Math.round(((to - from) * gaussianWidth) / this.fwhm + 1);
    if (nbPoints > maxLength) {
      throw new Error(
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
