import { optimizePeaks as gsdOptimizePeaks } from 'ml-gsd';
import { xyEnsureGrowingX } from 'ml-spectra-processing';

/**
 * Optimize peaks using least-squares fitting against a shape model (gaussian, lorentzian, or pseudovoigt).
 * Returns peaks with improved x, y, width, and shape information.
 * Requires continuous (profile) data — discrete (centroid) data is returned as-is.
 * @param {import('./Spectrum').Spectrum} spectrum - Spectrum instance with data and peaks
 * @param {import('ml-gsd').OptimizePeaksOptions} [options={}] - Options for optimization
 * @returns {import('ml-gsd').GSDPeakOptimized[]} Optimized peaks with shape information
 */
export function optimizePeaks(spectrum, options = {}) {
  if (!spectrum.isContinuous()) {
    return spectrum.peaks;
  }
  const data = xyEnsureGrowingX(spectrum.data);
  return gsdOptimizePeaks(data, spectrum.peaks, options);
}
