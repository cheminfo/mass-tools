import { xFindClosestIndex } from 'ml-spectra-processing';

const NEUTRON_MASS = 1;

/**
 * Group the peaks into isotopologue clusters and give a charge to each cluster.
 *
 * The charge of a single peak can not be evaluated: an isotopologue in the
 * middle of an envelope looks the same whatever the charge, and the last one of
 * an envelope has nothing after it. What carries the charge is the series: a
 * run of peaks separated by NEUTRON_MASS / charge. So the series are searched
 * first, and the charge of a series is given to all the peaks it holds.
 *
 * A series of charge 1 is always a subseries of a series of charge 2, which is
 * one of a series of charge 4: the clusters are therefore assigned from the one
 * explaining the most intensity to the one explaining the least, and a peak
 * only takes the charge of the first cluster that claims it.
 * @param {Array<{x: number, y: number}>} peaks - sorted by mass
 * @param {object} [options={}]
 * @param {number} [options.minCharge=1]
 * @param {number} [options.maxCharge=10]
 * @param {number} [options.precision=20] - tolerance on the position of an
 * isotopologue, in ppm. It is never allowed to reach half of the distance
 * between two isotopologues, otherwise a series could jump from one to another.
 * @param {number} [options.minLength=3] - two peaks that happen to be at the
 * right distance are common, three in a row much less
 * @returns {Array<{charge: number, peaks: Array}>} the clusters, from the one
 * holding the most intensity to the one holding the least
 */
export function getChargeClusters(peaks, options = {}) {
  const clusters = buildClusters(peaks, options);
  const result = [];
  for (const cluster of clusters) {
    const clusterPeaks = [];
    for (let i = 0; i < cluster.indexes.length; i++) {
      clusterPeaks.push(peaks[cluster.indexes[i]]);
    }
    result.push({ charge: cluster.charge, peaks: clusterPeaks });
  }
  return result;
}

/**
 * The clusters as the two functions above need them: the position of the peaks
 * rather than the peaks, and the intensity they hold to be able to sort them.
 * @param {Array<{x: number, y: number}>} peaks
 * @param {object} [options={}]
 * @returns {Array<{charge: number, indexes: number[], intensity: number}>}
 */
function buildClusters(peaks, options = {}) {
  const {
    minCharge = 1,
    maxCharge = 10,
    precision = 20,
    minLength = 3,
  } = options;

  const nbPeaks = peaks.length;
  if (nbPeaks < minLength) return [];

  const masses = new Float64Array(nbPeaks);
  for (let i = 0; i < nbPeaks; i++) masses[i] = peaks[i].x;

  // the charge is evaluated on its magnitude: a negative range describes the
  // same isotopologue distances as the positive one
  const first = Math.abs(Math.round(minCharge));
  const last = Math.abs(Math.round(maxCharge));
  const from = Math.max(1, Math.min(first, last));
  const to = Math.max(1, Math.max(first, last));

  // a series is grown from the most intense peak first: an envelope must claim
  // its own isotopologues before a weak neighbour builds a series out of them
  const byIntensity = [];
  for (let i = 0; i < nbPeaks; i++) byIntensity.push(i);
  const sorted = byIntensity.toSorted((a, b) => peaks[b].y - peaks[a].y);

  const clusters = [];
  const claimed = new Uint8Array(nbPeaks);

  for (let charge = from; charge <= to; charge++) {
    const spacing = NEUTRON_MASS / charge;
    claimed.fill(0);
    for (const start of sorted) {
      if (claimed[start]) continue;
      // the most intense peak of an envelope is rarely its first isotopologue,
      // so the series grows on both sides of it
      const before = [];
      let expected = masses[start] - spacing;
      let previousIndex = start;
      let next = xFindClosestIndex(masses, expected);
      while (next < previousIndex) {
        // that peak already belongs to another series of the same charge
        if (claimed[next]) break;
        if (!isOnPosition(masses, next, expected, spacing, charge, precision)) {
          break;
        }
        before.push(next);
        claimed[next] = 1;
        previousIndex = next;
        expected = masses[next] - spacing;
        next = xFindClosestIndex(masses, expected);
      }
      before.reverse();
      const series = before;
      series.push(start);
      claimed[start] = 1;
      expected = masses[start] + spacing;
      previousIndex = start;
      next = xFindClosestIndex(masses, expected);
      while (next > previousIndex) {
        if (claimed[next]) break;
        if (!isOnPosition(masses, next, expected, spacing, charge, precision)) {
          break;
        }
        series.push(next);
        claimed[next] = 1;
        previousIndex = next;
        expected = masses[next] + spacing;
        next = xFindClosestIndex(masses, expected);
      }
      if (series.length >= minLength) {
        let intensity = 0;
        for (let i = 0; i < series.length; i++) intensity += peaks[series[i]].y;
        clusters.push({ charge, indexes: series, intensity });
      }
    }
  }

  clusters.sort((a, b) => b.intensity - a.intensity);
  return clusters;
}

/**
 * Give to each peak the charge of the cluster that explains it.
 * @param {Array<{x: number, y: number}>} peaks - sorted by mass
 * @param {object} [options={}] - same as `getChargeClusters`
 * @returns {Array} copy of the peaks, with a `charge` when one was found
 */
export function getPeaksWithClusterCharge(peaks, options = {}) {
  const clusters = buildClusters(peaks, options);
  const charges = new Int8Array(peaks.length);

  for (const cluster of clusters) {
    const { indexes, charge } = cluster;
    // a cluster whose peaks are already explained by a more intense one brings
    // nothing: it is the same series read with a lower charge
    let free = 0;
    for (let i = 0; i < indexes.length; i++) {
      if (charges[indexes[i]] === 0) free++;
    }
    if (free < indexes.length) continue;
    for (let i = 0; i < indexes.length; i++) {
      charges[indexes[i]] = charge;
    }
  }

  const result = [];
  for (let i = 0; i < peaks.length; i++) {
    result.push(
      charges[i] === 0 ? { ...peaks[i] } : { ...peaks[i], charge: charges[i] },
    );
  }
  return result;
}

/**
 * Is the peak at `index` where the next isotopologue is expected?
 *
 * The isotopologues of the charges `z` and `z + 1` are only `spacing / (z + 1)`
 * apart, and that distance shrinks fast: 0.5 Da between the charges 1 and 2,
 * but 0.024 Da between 6 and 7. A tolerance that reaches it would let the same
 * peaks be read with either charge, so it is capped well under.
 * @param {Float64Array} masses
 * @param {number} index
 * @param {number} expected
 * @param {number} spacing
 * @param {number} charge
 * @param {number} precision - in ppm
 * @returns {boolean}
 */
function isOnPosition(masses, index, expected, spacing, charge, precision) {
  const tolerance = Math.min(
    precision * 1e-6 * masses[index],
    (0.4 * spacing) / (charge + 1),
  );
  return Math.abs(masses[index] - expected) <= tolerance;
}
