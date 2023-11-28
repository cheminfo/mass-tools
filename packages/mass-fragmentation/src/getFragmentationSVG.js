import { render, moleculeRenderer } from 'react-tree-svg';

/**
 * @typedef {object} MassPeak
 * @property {number} mass
 * @property {number} intensity
 */

/**
 * @param {object[]} trees
 * @param {object} [options={}]
 * @param {object} [options.OCL]
 * @param {number} [options.accuracy]
 * @param {MassPeak[]} [options.peaks]
 * @returns
 */
export function getFragmentationSVG(trees, options = {}) {
  const { OCL, accuracy, peaks = [] } = options;

  const maxIntensity =
    peaks?.length > 0
      ? Math.log(Math.max(...peaks.map((peak) => peak.intensity)) + 1)
      : 0;

  const rendererOptions = {
    nodeRenderer: moleculeRenderer,
    arrowRendererOptions: {
      getLabel: (node) => {
        return node?.reaction?.label;
      },
      labelPosition: 'center',
    },
    nodeRendererOptions: {
      getTopLabel: (node) => {
        const mz = node?.molecules[0]?.info?.mz;
        if (mz === undefined) return;
        return `${mz.toFixed(4)} m/z`;
      },
      getBoxStyle: (node) => {
        for (const molecule of node.molecules) {
          const peak = getPeakInRange(peaks, molecule?.info?.mz, accuracy);
          if (peak) {
            return {
              fillOpacity: maxIntensity
                ? (0.2 * Math.log(peak.intensity + 1)) / maxIntensity
                : 0.2,
              fill: 'red',
            };
          }
        }
      },
      getMolecules: (node) => {
        return node.molecules.map((molecule) =>
          OCL.Molecule.fromIDCode(molecule.idCode),
        );
      },
    },
    positionOptions: {
      spacingHorizontal: 150,
    },
  };

  return render(trees, rendererOptions);
}

function getPeakInRange(peaks, mass, accuracy) {
  if (!mass || !Array.isArray(peaks)) {
    return undefined;
  }
  const massAccuracy = (accuracy * mass) / 1e6;

  for (const peak of peaks) {
    if (Math.abs(peak.mass - mass) <= massAccuracy) {
      return peak;
    }
  }
  return undefined;
}
