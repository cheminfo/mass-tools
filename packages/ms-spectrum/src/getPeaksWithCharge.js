import { xFindClosestIndex } from 'ml-spectra-processing';

import { getPeaksWithClusterCharge } from './getChargeClusters.js';
import { assignLadderCharge, getChargeLadders } from './getChargeLadders.js';

/**
 * Evaluate the charge of every peak.
 *
 * A peak takes the charge of the isotopologue cluster it belongs to. On an
 * unresolved spectrum (see `maxClusteredFraction`) the charge-state ladders
 * take precedence, because an unresolved envelope forms spurious charge-1
 * clusters. A peak that belongs to neither gets no `charge`.
 * @param {Array} peaks - all the peaks of the spectrum, sorted by mass
 * @param {object} [options={}]
 * @param {number} [options.min=1] - lowest charge the isotopologue clusters
 * consider
 * @param {number} [options.max=100] - highest charge to consider, shared by the
 * isotopologue clusters and the charge-state ladders
 * @param {number} [options.precision=20] - tolerance on the position of an
 * isotopologue, in ppm
 * @param {number} [options.minLength=3] - shortest isotopologue series that
 * shows a charge, the ladders have their own in `options.ladder`
 * @param {number} [options.minIntensity=0] - peaks under it take no part in the
 * series
 * @param {number} [options.minRelativeIntensity=0.001] - same, as a fraction of
 * the tallest peak. The higher of the two floors applies
 * @param {number} [options.neutronMass] - the step from one isotopologue to the
 * next of a singly charged species, see `getChargeClusters`
 * @param {number} [options.minRatio] - shortest drop between two consecutive
 * isotopologues of a series, see `getChargeClusters`
 * @param {number} [options.daltonPerCarbon] - the chemistry the envelope width
 * assumes, `Infinity` to switch that rule off, see `getChargeClusters`
 * @param {string|Array} [options.ionizations='H+'] - the charge carriers a
 * charge-state ladder may show, see `getChargeLadders`
 * @param {number} [options.maxClusteredFraction=0.2] - the charge-state ladders
 * are ignored when the isotopologue clusters already explain more than this
 * fraction of the significant peaks
 * @param {object} [options.ladder={}] - options forwarded to `getChargeLadders`
 * @param {number} [options.ladder.tolerance=500] - tolerance on the position of
 * the next charge state, in ppm
 * @param {number} [options.ladder.minLength=5] - shortest ladder that shows a
 * charge
 * @param {number} [options.ladder.minRelativeIntensity=0.05] - peaks under this
 * fraction of the most intense one take no part in the ladders
 * @returns {Array} copy of `peaks`, with a `charge` when one was found
 */
export function getPeaksWithCharge(peaks, options = {}) {
  const {
    precision = 20,
    min: minCharge = 1,
    max: maxCharge = 100,
    minLength = 3,
    minIntensity = 0,
    minRelativeIntensity = 0.001,
    ionizations = 'H+',
    ladder = {},
    maxClusteredFraction = 0.2,
    neutronMass,
    minRatio,
    daltonPerCarbon,
  } = options;

  let tallest = 0;
  for (const peak of peaks) {
    if (peak.y > tallest) tallest = peak.y;
  }
  const floor = Math.max(minIntensity, minRelativeIntensity * tallest);

  const significant = [];
  for (const peak of peaks) {
    if (peak.y >= floor) significant.push(peak);
  }

  const clustered = getPeaksWithClusterCharge(significant, {
    minCharge,
    maxCharge,
    precision,
    minLength,
    neutronMass,
    minRatio,
    daltonPerCarbon,
  });

  const masses = new Float64Array(clustered.length);
  for (let i = 0; i < clustered.length; i++) masses[i] = clustered[i].x;

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
