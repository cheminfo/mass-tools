'use strict';

const findMFs = require('mf-finder');

module.exports = function appendFragmentsInfo(
  experimentalSpectrum,
  database,
  options = {},
) {
  if (!experimentalSpectrum) {
    throw new Error('Experimental spectrum is not defined');
  }
  if (!database) {
    throw new Error('Database is not defined');
  }

  const peaks = experimentalSpectrum.getPeaks();
  for (let entry of database) {
    const ranges = Object.keys(entry.atoms)
      .map((atom) => `${atom}0-${entry.atoms[atom]}`)
      .join(' ');

    entry.fragments = {
      nbFound: 0,
      intensityFound: 0,
      assignments: [],
    };

    for (let peak of peaks) {
      const possibleMFs = findMFs(peak.x, {
        ionizations: options.ionizations,
        precision: options.precision,
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
};
