import { preprocessIonizations } from 'mf-utilities';
import { xStandardDeviation } from 'ml-spectra-processing';

/**
 * Deconvolute peaks from large molecules where isotopic distribution is not resolved.
 * Groups peaks by charge state based on neutral mass agreement.
 * Useful for proteins and other large biomolecules measured by ESI-MS.
 *
 * @param {Array<{x: number, y: number, width: number}>} peaks - Array of picked peaks with x (m/z), y (intensity), width
 * @param {object} [options={}]
 * @param {string} [options.ionizations='(H+)1-50'] - Ionization possibilities (e.g., '(H+)1-5' or '(H+)10-50')
 * @param {number} [options.tolerance=100] - Tolerance in ppm for grouping peaks by neutral mass
 * @param {number} [options.minGroupSize=2] - Minimum number of peaks required to form a group
 * @returns {Array<{intensity: number, em: number, emError: number, ionizations: string[], peaks: Array}>} Array of deconvoluted groups sorted by intensity
 */
export function getDeconvolutedPeaks(peaks, options = {}) {
  const {
    ionizations: ionizationsString = '(H+)1-50',
    tolerance = 100,
    minGroupSize = 2,
  } = options;

  const ionizations = preprocessIonizations(ionizationsString);

  // For each peak × each ionization, calculate the neutral mass (em)
  const candidates = [];
  for (const peak of peaks) {
    for (const ionization of ionizations) {
      const charge = Math.abs(ionization.charge);
      if (charge === 0) continue;
      const em = peak.x * charge - ionization.em;
      if (em <= 0) continue;
      candidates.push({
        x: peak.x,
        y: peak.y,
        width: peak.width || 0,
        em,
        charge,
        ionization: ionization.mf,
        originalPeak: peak,
      });
    }
  }

  // Sort candidates by neutral mass
  candidates.sort((a, b) => a.em - b.em);

  // Group candidates whose neutral masses agree within tolerance (ppm)
  const groups = [];
  let currentGroup = [candidates[0]];

  for (let i = 1; i < candidates.length; i++) {
    const anchor = currentGroup[0];
    const candidate = candidates[i];
    const ppmDiff = (Math.abs(candidate.em - anchor.em) / anchor.em) * 1e6;

    if (ppmDiff <= tolerance) {
      // Don't add if this original peak is already in the group
      const isDuplicate = currentGroup.some(
        (c) => c.originalPeak === candidate.originalPeak,
      );
      if (!isDuplicate) {
        currentGroup.push(candidate);
      }
    } else {
      if (currentGroup.length >= minGroupSize) {
        groups.push(currentGroup);
      }
      currentGroup = [candidate];
    }
  }
  if (currentGroup.length >= minGroupSize) {
    groups.push(currentGroup);
  }

  // Build result objects from groups
  const results = [];
  for (const group of groups) {
    // Sort peaks by m/z
    group.sort((a, b) => a.x - b.x);

    const totalIntensity = group.reduce((sum, c) => sum + c.y, 0);

    // Weighted average of em values
    let weightedEm = 0;
    for (const candidate of group) {
      weightedEm += candidate.em * candidate.y;
    }
    weightedEm /= totalIntensity;

    // Standard deviation of em values
    const emValues = group.map((c) => c.em);
    const emError =
      emValues.length > 1 ? xStandardDeviation(emValues) : 0;

    // Unique ionization agents (strip charge count, e.g. '(H+)50' → '(H+)')
    const uniqueIonizations = [
      ...new Set(group.map((c) => c.ionization.replace(/\)\d+$/, ')'))),
    ];

    results.push({
      intensity: totalIntensity,
      em: weightedEm,
      emError,
      ionizations: uniqueIonizations,
      peaks: group.map((c) => ({
        x: c.x,
        y: c.y,
        width: c.width,
        em: c.em,
        charge: c.charge,
        ionization: c.ionization,
        originalPeak: c.originalPeak,
      })),
    });
  }

  // Deduplicate: prefer larger groups, remove groups whose peaks are all already covered
  results.sort(
    (a, b) => b.peaks.length - a.peaks.length || b.intensity - a.intensity,
  );

  const coveredPeaks = new Set();
  const deduplicated = [];
  for (const group of results) {
    const hasNewPeak = group.peaks.some(
      (p) => !coveredPeaks.has(p.originalPeak),
    );
    if (hasNewPeak) {
      deduplicated.push(group);
      for (const peak of group.peaks) {
        coveredPeaks.add(peak.originalPeak);
      }
    }
  }

  // Sort final results by intensity (descending)
  deduplicated.sort((a, b) => b.intensity - a.intensity);

  return deduplicated;
}
