import { render, moleculeRenderer } from 'react-tree-svg';

export function getFragmentationSVG(trees, options = {}) {
  const { OCL, accuracy, masses = [] } = options;

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
          if (isInRange(masses, molecule?.info?.mz, accuracy)) {
            return {
              fillOpacity: 0.2,
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

function isInRange(masses, mass, accuracy) {
  if (!mass || !masses) {
    return false;
  }
  const massAccuracy = (accuracy * mass) / 1e6;

  for (const value of masses) {
    if (Math.abs(value - mass) <= massAccuracy) {
      return true;
    }
  }
  return false;
}
