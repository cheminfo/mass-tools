import { writeFileSync } from 'fs';

import OCL, { Molecule } from 'openchemlib';

import { getFragmentationSVG } from '../getFragmentationSVG';
import { reactionFragmentation } from '../reactionFragmentation.js';

test('getFragmentationSVG', () => {
  const molecule = Molecule.fromSmiles('C[NH2+]C(C)Cc2ccc1OCOc1c2');
  const { trees } = reactionFragmentation(molecule);
  const svg = getFragmentationSVG(trees, {
    OCL,
    masses: [97.5624, 105.0697, 58.065, 194.1173, 163.0752, 133.0647, 135.0439],
    accuracy: 50,
  });

  // could be previewed on https://www.svgviewer.dev/
  writeFileSync('/tmp/test.svg', svg, 'utf8');
  return svg;
});
