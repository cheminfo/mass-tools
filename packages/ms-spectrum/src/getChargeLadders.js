import { ELECTRON_MASS } from 'chemical-elements';
import { preprocessIonizations } from 'mf-utilities';
import { xFindClosestIndex, xyObjectMaxYPoint } from 'ml-spectra-processing';

/**
 * Group the peaks of a multiply charged species into charge-state ladders.
 *
 * An electrospray of a protein does not show its isotopologues but a ladder of
 * charge states: the same molecule of neutral mass `M` ionized a growing number
 * of times by a charge carrier (a proton, a sodium, ...). A peak of charge `z`
 * sits at `m/z = M / z + delta`, where `delta` is the m/z shift of one charge
 * carrier, so a whole series shares one `M` while each of its peaks has its own
 * charge. The charge of a single peak can therefore not be read on its own:
 * what shows it is the ladder it belongs to.
 *
 * A ladder is grown from its most intense peak by predicting, one charge state
 * at a time, where the next one must lie, and it is kept only when it spans at
 * least `minLength` consecutive charge states. Ladders are assigned from the one
 * holding the most intensity to the one holding the least, and a peak only takes
 * the charge of the first ladder that claims it, so a harmonic (every other
 * state of a real ladder) can not steal the peaks of the series it mimics.
 * @param {Array<{x: number, y: number}>} peaks - the peaks of the spectrum
 * @param {object} [options={}]
 * @param {string|Array} [options.ionizations='H+'] - the charge carriers to try,
 * as a comma separated list (`'H+,Na+,K+'`) or an array of preprocessed
 * ionizations. Each envelope is assigned the carrier that explains it best.
 * @param {number} [options.maxCharge=100] - highest charge state to consider;
 * the ladder is grown over the states `1` to `maxCharge` (its magnitude is used,
 * so a negative-mode range such as `-100` behaves like `100`)
 * @param {number} [options.tolerance=500] - tolerance on the position of the
 * next charge state, in ppm. Larger than for isotopologues because the charge
 * states of a protein are broad and rarely mass resolved.
 * @param {number} [options.minLength=5] - shortest ladder that shows a charge
 * @param {number} [options.minRelativeIntensity=0.05] - peaks under this
 * fraction of the most intense one are satellites, adducts or noise and take no
 * part in the ladders
 * @returns {Array<{mass: number, ionization: string, peaks: Array}>} the
 * ladders, from the one holding the most intensity to the one holding the
 * least. `mass` is the neutral mass they reconstruct, `ionization` the carrier
 * that explains them and each peak carries its `charge`.
 */
export function getChargeLadders(peaks, options = {}) {
  const ladders = buildLadders(peaks, options);
  const results = [];
  for (const ladder of ladders) {
    const ladderPeaks = [];
    for (const { claim, ...peak } of ladder.peaks) {
      ladderPeaks.push(peak);
    }
    ladderPeaks.sort((a, b) => a.x - b.x);
    results.push({
      mass: ladder.mass,
      ionization: ladder.ionization,
      peaks: ladderPeaks,
    });
  }
  return results;
}

/**
 * Give to each of `selectedPeaks` the charge of the ladder peak at its mass.
 *
 * A peak that matches no ladder peak gets no `charge`. Used by
 * `getPeaksWithCharge` to complete the charge the isotopologue clusters can not
 * give to a multiply charged species.
 * @param {Array} selectedPeaks - peaks to evaluate
 * @param {Array<{peaks: Array}>} ladders - as returned by `getChargeLadders`
 * @param {number} [tolerance=20] - tolerance, in ppm, to match a selected peak
 * to a ladder peak
 * @returns {Array} copy of `selectedPeaks`, carrying a `charge` when matched
 */
export function assignLadderCharge(selectedPeaks, ladders, tolerance = 20) {
  const members = [];
  for (const ladder of ladders) {
    for (const peak of ladder.peaks) members.push(peak);
  }
  members.sort((a, b) => a.x - b.x);

  if (members.length === 0) {
    return selectedPeaks.map((peak) => ({ ...peak }));
  }

  const masses = new Float64Array(members.length);
  for (let i = 0; i < members.length; i++) masses[i] = members[i].x;

  const relativeTolerance = tolerance * 1e-6;
  const results = [];
  for (const peak of selectedPeaks) {
    const index = xFindClosestIndex(masses, peak.x);
    const absoluteTolerance = relativeTolerance * peak.x;
    if (Math.abs(members[index].x - peak.x) <= absoluteTolerance) {
      results.push({ ...peak, charge: members[index].charge });
    } else {
      results.push({ ...peak });
    }
  }
  return results;
}

/**
 * The ladders the exported functions need, each with its reconstructed neutral
 * mass, its carrier and its peaks (carrying their charge), sorted from the one
 * holding the most intensity to the one holding the least.
 * @param {Array<{x: number, y: number}>} peaks
 * @param {object} [options={}]
 * @returns {Array<{mass: number, ionization: string, intensity: number, peaks: Array}>}
 */
function buildLadders(peaks, options = {}) {
  const {
    ionizations = 'H+',
    maxCharge = 100,
    tolerance = 500,
    minLength = 5,
    minRelativeIntensity = 0.05,
  } = options;

  // delta: the m/z shift of one charge carrier, the `delta` of `m/z = M / z + delta`
  const preprocessedIonizations = preprocessIonizations(ionizations).map(
    (ionization) => ({
      mf: ionization.mf,
      delta:
        (ionization.em - ionization.charge * ELECTRON_MASS) /
        Math.abs(ionization.charge),
    }),
  );

  const sorted = peaks.toSorted((a, b) => a.x - b.x);

  const floor = minRelativeIntensity * xyObjectMaxYPoint(sorted).y;

  // a copy carrying `claim`, the flag a ladder sets on the peaks it takes so a
  // later, weaker ladder can not reuse them
  const significantPeaks = sorted
    .filter((peak) => peak.y >= floor)
    .map((peak) => ({ ...peak, claim: false }));

  if (significantPeaks.length < minLength) return [];

  const masses = new Float64Array(significantPeaks.length);
  for (let i = 0; i < significantPeaks.length; i++) {
    masses[i] = significantPeaks[i].x;
  }

  // the ladder spans charge 1 to maxCharge; its magnitude is used so a
  // negative-mode range (maxCharge = -100) behaves like the positive one
  const from = 1;
  const to = Math.max(1, Math.abs(Math.round(maxCharge)));

  // ppm turned into a plain factor once, so growth only scales it by the mass
  const relativeTolerance = tolerance * 1e-6;

  const ladders = [];
  for (const anchor of significantPeaks.toSorted((a, b) => b.y - a.y)) {
    if (anchor.claim) continue;
    // neither the carrier nor the charge of the anchor is known, so every
    // hypothesis is grown and the one spanning the most consecutive states is
    // kept; a tie goes to the lowest charge, the fundamental rather than one of
    // its harmonics
    let best = null;
    for (const ionization of preprocessedIonizations) {
      if (anchor.x - ionization.delta <= 0) continue;
      for (let charge = from; charge <= to; charge++) {
        const members = growLadder(significantPeaks, masses, anchor, charge, {
          from,
          to,
          relativeTolerance,
          delta: ionization.delta,
        });
        if (
          best === null ||
          members.length > best.members.length ||
          (members.length === best.members.length && charge < best.charge)
        ) {
          best = { members, charge, ionization };
        }
      }
    }
    if (best === null || best.members.length < minLength) continue;

    const { delta, mf } = best.ionization;
    const ladderPeaks = [];
    let massSum = 0;
    let weightSum = 0;
    let intensity = 0;
    for (const { peak, charge } of best.members) {
      peak.claim = true;
      peak.charge = charge;
      massSum += peak.y * charge * (peak.x - delta);
      weightSum += peak.y;
      intensity += peak.y;
      ladderPeaks.push(peak);
    }
    ladders.push({
      mass: massSum / weightSum,
      ionization: mf,
      intensity,
      peaks: ladderPeaks,
    });
  }

  ladders.sort((a, b) => b.intensity - a.intensity);
  return ladders;
}

/**
 * Grow a ladder around an anchor peak assumed to carry `charge`.
 *
 * The next charge state is predicted from the last matched peak rather than from
 * the anchor, so the error of a broad, unresolved peak never accumulates over
 * the whole ladder. Growth stops at the first state that is missing or already
 * claimed by a more intense ladder.
 * @param {Array<{x: number, claim: boolean}>} significant - the significant peaks, sorted by mass
 * @param {Float64Array} masses - their masses, for the closest-peak search
 * @param {{x: number}} anchor - the peak to grow from
 * @param {number} charge - hypothesised charge of the anchor
 * @param {object} bounds
 * @param {number} bounds.from - lowest charge state
 * @param {number} bounds.to - highest charge state
 * @param {number} bounds.relativeTolerance - tolerance as a plain factor (ppm * 1e-6)
 * @param {number} bounds.delta - m/z shift of one charge carrier
 * @returns {Array<{peak: object, charge: number}>}
 */
function growLadder(significant, masses, anchor, charge, bounds) {
  const { from, to, relativeTolerance, delta } = bounds;
  const members = [{ peak: anchor, charge }];
  const used = new Set([anchor]);

  let localMass = anchor.x;
  for (let state = charge - 1; state >= from; state--) {
    const predicted = ((state + 1) * (localMass - delta)) / state + delta;
    const peak = significant[xFindClosestIndex(masses, predicted)];
    if (peak.claim || used.has(peak)) break;
    if (Math.abs(peak.x - predicted) > relativeTolerance * predicted) break;
    members.push({ peak, charge: state });
    used.add(peak);
    localMass = peak.x;
  }

  localMass = anchor.x;
  for (let state = charge + 1; state <= to; state++) {
    const predicted = ((state - 1) * (localMass - delta)) / state + delta;
    const peak = significant[xFindClosestIndex(masses, predicted)];
    if (peak.claim || used.has(peak)) break;
    if (Math.abs(peak.x - predicted) > relativeTolerance * predicted) break;
    members.push({ peak, charge: state });
    used.add(peak);
    localMass = peak.x;
  }

  return members;
}
