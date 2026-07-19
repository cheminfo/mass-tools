import { gsd } from 'ml-gsd';
import {
  xNoiseStandardDeviation,
  xyEnsureGrowingX,
} from 'ml-spectra-processing';

/**
 * Filter the array of peaks
 * @param {import('./Spectrum')} spectrum - array of all the peaks
 * @returns {array}
 */

export function peakPicking(spectrum) {
  if (!spectrum.peaks || spectrum.peaks.length === 0) {
    spectrum.peaks = [];
    const keys = Object.keys(spectrum.data).filter(
      (key) => key !== 'x' && key !== 'y',
    );
    if (spectrum.isContinuous()) {
      // some experimental data are really problematic and we need to add this line
      const data = xyEnsureGrowingX(spectrum.data);
      const gsdPeaks = gsd(data, {
        minMaxRatio: spectrum.options.threshold || 0.00025, // Threshold to determine if a given peak should be considered as a noise
        noiseLevel: getNoiseLevel(data.y, spectrum.options.noiseFactor),
        realTopDetection: true,
        smoothY: false,
        sgOptions: { windowSize: 7, polynomial: 3 },
      });
      for (let gsdPeak of gsdPeaks) {
        const peak = { x: gsdPeak.x, y: gsdPeak.y, width: gsdPeak.width };
        for (let key of keys) {
          peak[key] = spectrum.data[key][gsdPeak.index];
        }
        spectrum.peaks.push(peak);
      }
    } else {
      spectrum.peaks = [];
      let data = spectrum.data;
      for (let i = 0; i < data.x.length; i++) {
        const peak = {
          x: data.x[i],
          y: data.y[i],
          width: 0,
        };
        for (let key of keys) {
          peak[key] = spectrum.data[key][i];
        }
        spectrum.peaks.push(peak);
      }
    }
  }
  return spectrum.peaks;
}

/**
 * Intensity under which a maximum is considered to be noise.
 *
 * We have to compute it ourselves: left alone, gsd only estimates a noise level
 * when the x values are equally spaced within 5%, and falls back to 0 otherwise.
 * A mass spectrum is sampled in time or in frequency, so over a wide m/z range
 * the steps grow by far more than that and the noise would not be filtered.
 * @param {import('cheminfo-types').NumberArray} y
 * @param {number} [noiseFactor=3] - 0 leaves the decision to gsd
 * @returns {number|undefined}
 */
function getNoiseLevel(y, noiseFactor = 3) {
  if (!noiseFactor) return undefined;
  const { median, sd } = xNoiseStandardDeviation(y);
  return median + noiseFactor * sd;
}
