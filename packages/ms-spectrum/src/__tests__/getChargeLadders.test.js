import { readFileSync } from 'node:fs';
import path from 'node:path';

import { MF } from 'mf-parser';
import { expect, test } from 'vitest';

import { Spectrum, fromText } from '../Spectrum';
import { getChargeLadders } from '../getChargeLadders';
import { getPeaksWithCharge } from '../getPeaksWithCharge';

// the m/z shift of one charge carrier is its observed monoisotopic mass
const PROTON_SHIFT = new MF('H+').getInfo().observedMonoisotopicMass;
const SODIUM_SHIFT = new MF('Na+').getInfo().observedMonoisotopicMass;

/**
 * The peaks of a protein of neutral mass `mass` seen at each charge of `charges`.
 * @param {number} mass
 * @param {number[]} charges
 * @param {number} [intensity=100]
 * @param {number} [delta=PROTON_SHIFT] - m/z shift of the charge carrier
 * @returns {Array<{x: number, y: number}>}
 */
function ladderPeaks(mass, charges, intensity = 100, delta = PROTON_SHIFT) {
  return charges.map((charge) => ({
    x: mass / charge + delta,
    y: intensity,
  }));
}

test('a clean synthetic ladder reconstructs its mass and charges', () => {
  const peaks = ladderPeaks(20000, [10, 11, 12, 13, 14, 15]);

  const ladders = getChargeLadders(peaks);

  expect(ladders).toHaveLength(1);
  expect(ladders[0].mass).toBeCloseTo(20000, 6);
  expect(ladders[0].peaks.map((peak) => peak.charge)).toStrictEqual([
    15, 14, 13, 12, 11, 10,
  ]);
});

test('fewer than five peaks show no charge', () => {
  // four charge states respect the rule but the series is too short to trust
  expect(getChargeLadders(ladderPeaks(20000, [11, 12, 13, 14]))).toStrictEqual(
    [],
  );
  expect(
    getChargeLadders(ladderPeaks(20000, [11, 12, 13, 14, 15])),
  ).toHaveLength(1);
});

test('minLength can be tuned', () => {
  const peaks = ladderPeaks(20000, [11, 12, 13]);

  expect(getChargeLadders(peaks)).toStrictEqual([]);
  expect(getChargeLadders(peaks, { minLength: 3 })).toHaveLength(1);
});

test('getPeaksWithCharge falls back to the ladder charge', () => {
  const peaks = [
    ...ladderPeaks(20000, [10, 11, 12, 13, 14]),
    { x: 1234.5, y: 100 },
    { x: 1500.25, y: 100 },
  ];
  // no resolved isotopologues here, so the charge can only come from the ladder
  const withCharge = getPeaksWithCharge(peaks);
  const charged = withCharge.filter((peak) => peak.charge !== undefined);

  expect(charged).toHaveLength(5);
  expect(withCharge.find((peak) => peak.x === 1234.5).charge).toBeUndefined();
});

test('two proteins give two ladders, sorted by intensity', () => {
  const peaks = [
    ...ladderPeaks(20000, [10, 11, 12, 13, 14], 100),
    ...ladderPeaks(27000, [18, 19, 20, 21, 22], 40),
  ];
  const ladders = getChargeLadders(peaks);

  expect(ladders).toHaveLength(2);
  expect(ladders[0].mass).toBeCloseTo(20000, 6);
  expect(ladders[1].mass).toBeCloseTo(27000, 6);
});

test('the charge is evaluated on the magnitude, whatever the sign of maxCharge', () => {
  const peaks = ladderPeaks(20000, [10, 11, 12, 13, 14]);
  const ladders = getChargeLadders(peaks, { maxCharge: -20 });

  expect(ladders).toHaveLength(1);
  expect(ladders[0].peaks.map((peak) => peak.charge)).toStrictEqual([
    14, 13, 12, 11, 10,
  ]);
});

test('a real protein electrospray: calmodulin on a quadrupole', () => {
  const text = readFileSync(
    path.join(__dirname, 'data/esiCalmodulin.jdx'),
    'utf8',
  );
  const spectrum = fromText(text);

  const ladders = spectrum.getChargeLadders();

  // the protein and its sodium adduct series, ~22 Da apart
  expect(ladders).toHaveLength(2);

  const [protein, adduct] = ladders;

  expect(protein.ionization).toBe('H+');
  expect(protein.mass).toBeCloseTo(16985.6, 0);
  expect(protein.peaks.map((peak) => peak.charge)).toStrictEqual([
    19, 18, 17, 16, 15, 14, 13,
  ]);
  expect(adduct.mass).toBeCloseTo(17007.3, 0);
  expect(adduct.mass - protein.mass).toBeCloseTo(21.7, 0);

  // the base peak of the envelope is at charge 16
  const basePeak = protein.peaks.find((peak) => peak.charge === 16);

  expect(basePeak.x).toBeCloseTo(1062.57, 1);

  // the same charge is surfaced by getSelectedPeaksWithCharge, the method the
  // viewers already use for the isotopologue charge
  const annotated = spectrum.getSelectedPeaksWithCharge(spectrum.getPeaks());
  const chargeAt = (mz) =>
    annotated.find((peak) => Math.abs(peak.x - mz) < 0.5)?.charge;

  expect(chargeAt(1307.63)).toBe(13);
  expect(chargeAt(1062.57)).toBe(16);
  expect(chargeAt(1000.14)).toBe(17);
  expect(chargeAt(894.88)).toBe(19);
});

test('calmodulin: the isotopologue algorithm alone finds no charge', () => {
  const text = readFileSync(
    path.join(__dirname, 'data/esiCalmodulin.jdx'),
    'utf8',
  );
  const spectrum = fromText(text);

  // the instrument does not resolve the isotopologues, so the cluster-based
  // algorithm sees no series at all: this is exactly why the charge-state
  // ladders are needed to read the charge of this protein
  expect(spectrum.getChargeClusters()).toStrictEqual([]);

  // disabling the ladders (a resolved spectrum would keep them off) leaves the
  // envelope peaks with no charge
  const peaks = spectrum.getPeaks();
  const withoutLadder = spectrum.getSelectedPeaksWithCharge(peaks, {
    maxClusteredFraction: -1,
  });
  const charged = withoutLadder.filter((peak) => peak.charge !== undefined);

  expect(charged).toHaveLength(0);
});

test('the charge carrier is configurable: a sodiated envelope', () => {
  const peaks = ladderPeaks(20000, [10, 11, 12, 13, 14], 100, SODIUM_SHIFT);

  // read with protons the spacing is inconsistent, so no ladder is found
  expect(getChargeLadders(peaks)).toStrictEqual([]);

  const asSodium = getChargeLadders(peaks, { ionizations: 'Na+' });

  expect(asSodium).toHaveLength(1);
  expect(asSodium[0].ionization).toBe('Na+');
  expect(asSodium[0].mass).toBeCloseTo(20000, 5);
  expect(asSodium[0].peaks.map((peak) => peak.charge)).toStrictEqual([
    14, 13, 12, 11, 10,
  ]);
});

test('several carriers: each envelope takes the one that explains it', () => {
  const peaks = [
    ...ladderPeaks(20000, [10, 11, 12, 13, 14], 100, PROTON_SHIFT),
    ...ladderPeaks(30000, [15, 16, 17, 18, 19], 40, SODIUM_SHIFT),
  ];
  const ladders = getChargeLadders(peaks, { ionizations: 'H+,Na+' });

  expect(ladders).toHaveLength(2);

  const proton = ladders.find((ladder) => ladder.ionization === 'H+');
  const sodium = ladders.find((ladder) => ladder.ionization === 'Na+');

  expect(proton.mass).toBeCloseTo(20000, 5);
  expect(sodium.mass).toBeCloseTo(30000, 5);
});

test('setIonizations changes the result and clears only its cache', () => {
  const peaks = ladderPeaks(20000, [10, 11, 12, 13, 14], 100, SODIUM_SHIFT);
  const spectrum = new Spectrum({
    x: peaks.map((peak) => peak.x),
    y: peaks.map((peak) => peak.y),
  });

  // the default carrier is a proton and does not explain a sodiated envelope
  const asProton = spectrum.getChargeLadders();

  expect(asProton).toStrictEqual([]);
  // a second call returns the very same cached array
  expect(spectrum.getChargeLadders()).toBe(asProton);

  spectrum.setIonizations('Na+');
  const asSodium = spectrum.getChargeLadders();

  expect(asSodium).not.toBe(asProton);
  expect(asSodium[0].ionization).toBe('Na+');
  expect(asSodium[0].mass).toBeCloseTo(20000, 5);
});
