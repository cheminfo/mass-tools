import { elementsAndStableIsotopesObject } from 'chemical-elements';
import { xFindClosestIndex } from 'ml-spectra-processing';

const [CARBON_12, CARBON_13] = elementsAndStableIsotopesObject.C.isotopes;

/** 13C - 12C, the step from one isotopologue to the next of a singly charged species. */
export const NEUTRON_MASS = CARBON_13.mass - CARBON_12.mass;

/** Share of the tallest isotopologue under which one is no longer counted. */
const ENVELOPE_FLOOR = 0.1;

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
 *
 * A series is also asked to be as long as the mass its charge implies would
 * make it, see `envelopeWidth`, which is what keeps a noisy region from being
 * handed a large charge.
 * @param {Array<{x: number, y: number}>} peaks - sorted by mass
 * @param {object} [options={}]
 * @param {number} [options.minCharge=1]
 * @param {number} [options.maxCharge=10]
 * @param {number} [options.precision=20] - tolerance on the position of an
 * isotopologue, in ppm. It is never allowed to reach half of the distance
 * between two isotopologues, otherwise a series could jump from one to another.
 * @param {number} [options.minLength=3] - two peaks that happen to be at the
 * right distance are common, three in a row much less. A floor: a series is
 * also held to the width its own charge implies
 * @param {number} [options.neutronMass=NEUTRON_MASS] - the step from one
 * isotopologue to the next of a singly charged species
 * @param {number} [options.minRatio=0.05] - a peak standing under this fraction
 * of the isotopologue it extends ends the series: two neighbours an order of
 * magnitude apart do not belong to the same envelope
 * @param {number} [options.daltonPerCarbon=27] - how many daltons of the
 * species one carbon stands for, the only chemistry `envelopeWidth` assumes.
 * The default is a carbohydrate (CH2O), the carbon-poorest common case, so
 * richer molecules are never refused. `Infinity` switches the rule off, which
 * is what a carbon-free sample (perfluorinated, inorganic) needs
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
    neutronMass = NEUTRON_MASS,
    daltonPerCarbon = 27,
    minRatio = 0.05,
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
    const spacing = neutronMass / charge;
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
        if (peaks[next].y < minRatio * peaks[previousIndex].y) break;
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
        if (peaks[next].y < minRatio * peaks[previousIndex].y) break;
        series.push(next);
        claimed[next] = 1;
        previousIndex = next;
        expected = masses[next] + spacing;
        next = xFindClosestIndex(masses, expected);
      }
      if (
        series.length >= minLength &&
        series.length >=
          envelopeWidth(charge * peaks[series[0]].x, daltonPerCarbon)
      ) {
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
    if (hasChargedPeak(charges, indexes)) continue;
    if (stepsOverAHigherCharge(charges, indexes, charge)) continue;
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
 * Does one of those peaks already carry a charge?
 *
 * A more intense cluster came first and explained it, so this one is the same
 * series read again with another charge.
 * @param {Int8Array} charges - the charge of every peak, 0 when it has none yet
 * @param {number[]} indexes - the peaks of the cluster
 * @returns {boolean}
 */
function hasChargedPeak(charges, indexes) {
  for (let i = 0; i < indexes.length; i++) {
    if (charges[indexes[i]] !== 0) return true;
  }
  return false;
}

/**
 * Does the series leave a more charged peak between two of its members?
 *
 * Then it is one isotopologue out of z of that envelope rather than a species
 * of its own: the peaks it skips over are the ones its spacing left out, and a
 * charge 1 read on every third peak of a charge 3 envelope is the common case.
 * @param {Int8Array} charges - the charge of every peak, 0 when it has none yet
 * @param {number[]} indexes - the peaks of the cluster, sorted by mass
 * @param {number} charge - the charge the cluster claims
 * @returns {boolean}
 */
function stepsOverAHigherCharge(charges, indexes, charge) {
  for (let i = 1; i < indexes.length; i++) {
    for (let index = indexes[i - 1] + 1; index < indexes[i]; index++) {
      if (charges[index] > charge) return true;
    }
  }
  return false;
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

/**
 * How many isotopologues an envelope of that neutral mass spreads over.
 *
 * The 13C count is Poisson with a mean of `carbons * 0.0107`, walked here with
 * the recurrence P(k + 1) = P(k) * mean / (k + 1).
 * @param {number} mass - the neutral mass the charge implies
 * @param {number} daltonPerCarbon
 * @returns {number} the shortest series that mass could have produced
 */
function envelopeWidth(mass, daltonPerCarbon) {
  const mean = (mass * CARBON_13.abundance) / daltonPerCarbon;
  let probability = Math.exp(-mean);
  let tallest = probability;
  let width = 1;
  for (let k = 0; k < 1000; k++) {
    probability = (probability * mean) / (k + 1);
    if (probability > tallest) tallest = probability;
    if (probability < tallest * ENVELOPE_FLOOR) break;
    width++;
  }
  return width;
}
