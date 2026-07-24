import { xFindClosestIndex } from 'ml-spectra-processing';

import { getPeaksWithClusterCharge } from './getChargeClusters.js';
import { assignLadderCharge, getChargeLadders } from './getChargeLadders.js';

/**
 * Evaluate the charge of every peak.
 *
 * The charge comes from the isotopologue clusters: a peak takes the charge of
 * the series it belongs to. Evaluating a peak on its own can not work, because
 * an isotopologue in the middle of an envelope looks the same whatever the
 * charge and the last one of an envelope has nothing after it.
 *
 * A multiply charged species (a protein electrospray, ...) shows no resolved
 * isotopologues but a ladder of charge states. When such ladders are present
 * (an unresolved spectrum, see `maxClusteredFraction`) they take precedence: an
 * unresolved envelope peak often forms a spurious charge-1 cluster from its
 * neighbours, and the ladder gives the real, much higher charge. A peak that
 * belongs to neither gets no `charge` at all.
 * @param {Array} peaks - all the peaks of the spectrum, sorted by mass
 * @param {object} [options={}]
 * @param {number} [options.min=1] - lowest charge the isotopologue clusters
 * consider
 * @param {number} [options.max=100] - highest charge to consider; shared by the
 * isotopologue clusters and the charge-state ladder (which spans `1` to `max`)
 * @param {number} [options.precision=20] - tolerance on the position of an
 * isotopologue, in ppm (isotopologue clusters)
 * @param {number} [options.minLength=3] - shortest isotopologue series that
 * shows a charge. This is the cluster length, not the ladder's: a ladder has its
 * own `minLength` (default 5) inside `options.ladder`
 * @param {number} [options.minIntensity=0] - peaks under it are noise and take
 * no part in the series
 * @param {string|Array} [options.ionizations='H+'] - the charge carriers a
 * charge-state ladder may show, see `getChargeLadders`
 * @param {number} [options.maxClusteredFraction=0.2] - the charge-state ladders
 * are ignored when the isotopologue clusters already explain more than this
 * fraction of the significant peaks: a resolved spectrum (where the ladders
 * would only be coincidences) is read from its isotopologues alone
 * @param {object} [options.ladder={}] - options forwarded to `getChargeLadders`,
 * kept apart because a ladder is broader than an isotopologue and needs its own
 * tolerances. The `min`/`precision`/`minLength` above are the isotopologue
 * cluster parameters and do not reach the ladder; `max` is shared and caps both,
 * so the ladder has no `maxCharge` of its own
 * @param {number} [options.ladder.tolerance=500] - tolerance on the position of
 * the next charge state, in ppm. Larger than for isotopologues because the charge
 * states of a protein are broad and rarely mass resolved
 * @param {number} [options.ladder.minLength=5] - shortest ladder that shows a
 * charge
 * @param {number} [options.ladder.minRelativeIntensity=0.05] - peaks under this
 * fraction of the most intense one are satellites, adducts or noise and take no
 * part in the ladders

 * @returns {Array} copy of `peaks`, with a `charge` when one was found
 */
export function getPeaksWithCharge(peaks, options = {}) {
  const {
    precision = 20,
    min: minCharge = 1,
    max: maxCharge = 100,
    minLength = 3,
    minIntensity = 0,
    ionizations = 'H+',
    ladder = {},
    maxClusteredFraction = 0.2,
  } = options;

  const significant = [];
  for (const peak of peaks) {
    if (peak.y >= minIntensity) significant.push(peak);
  }

  const clustered = getPeaksWithClusterCharge(significant, {
    minCharge,
    maxCharge,
    precision,
    minLength,
  });

  const masses = new Float64Array(clustered.length);
  for (let i = 0; i < clustered.length; i++) masses[i] = clustered[i].x;

  // calculate the percentage of peaks that were clustered with a charge:
  // when it is too high, the spectrum is resolved and the ladders are only coincidences
  let clusteredWithCharge = 0;
  for (const peak of clustered) {
    if (peak.charge !== undefined) clusteredWithCharge++;
  }
  const clusteredFraction =
    clustered.length > 0 ? clusteredWithCharge / clustered.length : 0;

  let withLadderCharge = null;
  if (clusteredFraction <= maxClusteredFraction) {
    const ladders = getChargeLadders(peaks, {
      ionizations,
      ...ladder,
      maxCharge,
    });
    withLadderCharge = assignLadderCharge(peaks, ladders, precision);
  }

  const peaksWithCharge = [];
  for (let i = 0; i < peaks.length; i++) {
    const peak = peaks[i];
    // when a ladder explains the peak it wins over the isotopologue clusters,
    // which on an unresolved envelope only see a spurious low charge
    let charge =
      withLadderCharge === null ? undefined : withLadderCharge[i].charge;
    if (charge === undefined) {
      charge = getChargeAtMass(clustered, masses, peak.x, precision);
    }
    peaksWithCharge.push(
      charge === undefined ? { ...peak } : { ...peak, charge },
    );
  }
  return peaksWithCharge;
}

/**
 * Charge of the clustered peak lying at a mass, if there is one there.
 * @param {Array} clustered - peaks carrying their charge, sorted by mass
 * @param {import('cheminfo-types').NumberArray} masses - their masses
 * @param {number} targetMass
 * @param {number} precision - in ppm
 * @returns {number|undefined}
 */
export function getChargeAtMass(clustered, masses, targetMass, precision) {
  if (masses.length === 0) return undefined;
  const index = xFindClosestIndex(masses, targetMass);
  const peak = clustered[index];
  const tolerance = precision * 1e-6 * targetMass;
  if (Math.abs(peak.x - targetMass) > tolerance) return undefined;
  return peak.charge;
}
