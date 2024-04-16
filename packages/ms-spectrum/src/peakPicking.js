import { gsd } from 'ml-gsd';
import { xyEnsureGrowingX } from 'ml-spectra-processing';

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
