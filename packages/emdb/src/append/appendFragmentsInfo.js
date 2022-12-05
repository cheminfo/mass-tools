import { findMFs } from 'mf-finder';

/**
 *
 * @param {object}   experimentalSpectrum
 * @param {object}   database
 * @param {object}   [options={}]
 * @param {function} [options.onStep] - Callback to do after each step
 * @param {string}   [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {number}   [options.precision=100] - Allowed mass range based on precision
 */
export async function appendFragmentsInfo(
  experimentalSpectrum,
  database,
  options = {},
) {
  const { ionizations, onStep, precision } = options;
  if (!experimentalSpectrum) {
    throw new Error('Experimental spectrum is not defined');
  }
  if (!database) {
    throw new Error('Database is not defined');
  }

  const peaks = experimentalSpectrum.getPeaks({ sumValue: 1 });
  for (let entry of database) {
    const ranges = Object.keys(entry.atoms)
      .map((atom) => `${atom}0-${entry.atoms[atom]}`)
      .join(' ');

    entry.fragments = {
      nbFound: 0,
      intensityFound: 0,
      assignments: [],
    };
    for (let i = 0; i < peaks.length; i++) {
      if (onStep) await onStep(i);
      const peak = peaks[i];
      const possibleMFs = await findMFs(peak.x, {
        ionizations,
        precision,
        ranges,
      });
      if (possibleMFs.mfs.length > 0) {
        entry.fragments.nbFound++;
        entry.fragments.intensityFound += peak.y;
        entry.fragments.assignments.push({
          peak,
          bestMF: possibleMFs.mfs[0],
        });
      }
    }
  }
}
