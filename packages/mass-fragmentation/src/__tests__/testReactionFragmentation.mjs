import OCL from 'openchemlib';

import { reactionFragmentation } from '../reactionFragmentation.mjs';

const { Molecule } = OCL;

async function doAll() {
  let smiles = [
    'S2(SCC1(CC(CCC1)NC9(C(C2CC3(C=CC=CC3))OC8(=C(O)C6(=C%10(C5(C#CC4(NC(N)C=CC4C(CC7(C=CC=C(CC(C#C5)C(C(CNC6)CO)COC)C7))C%15(CC%13(C=%11(C=%14(OC(C%10(=C8C=C9))C(C=%14(C=CC=%11C%12(=C(OC)C=C(O)C=C%12C%13)))COC(=O)C)))(CC%15))))))))))',
  ];
  let count = 0;

  for (const smilesItem of smiles) {
    const molecule = Molecule.fromSmiles(smilesItem);
    const { masses, trees, validNodes } = reactionFragmentation(molecule, {
      ionizationKind: ['esiPositive'],
      maxDepth: 3,
      limitReactions: 500,
      minIonizations: 1,
      maxIonizations: 1,
      minReactions: 0,
      maxReactions: 2,
    });
    count++;
    console.log(smilesItem, `${count}/${smiles.length}`);
    console.log(masses.length, trees.length, validNodes.length);
  }
}

await doAll();
