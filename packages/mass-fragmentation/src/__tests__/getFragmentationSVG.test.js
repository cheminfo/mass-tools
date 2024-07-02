import OCL, { Molecule } from 'openchemlib';

import { getFragmentationSVG } from '../getFragmentationSVG';
import { reactionFragmentation } from '../reactionFragmentation.js';

test('getFragmentationSVG', () => {
  const molecule = Molecule.fromSmiles('C[NH2+]C(C)Cc2ccc1OCOc1c2');
  const { trees } = reactionFragmentation(molecule);
  const svg = getFragmentationSVG(trees, {
    OCL,
    peaks: [
      { mass: 97.5624, intensity: 100 },
      { mass: 105.0697, intensity: 100 },
      { mass: 58.065, intensity: 100 },
      { mass: 194.1173, intensity: 100 },
      { mass: 163.0752, intensity: 100 },
      { mass: 133.0647, intensity: 100 },
      { mass: 135.0439, intensity: 100 },
    ],
    accuracy: 50,
  });

  expect(svg).toMatchSnapshot();
});
