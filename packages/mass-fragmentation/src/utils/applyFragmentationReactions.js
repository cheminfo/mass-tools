import OCL from 'openchemlib';
import { applyReactions } from 'openchemlib-utils';

export function applyFragmentationReactions(
  ionizedFragments,
  reactions,
  maxDepth,
) {
  const fragmentationReactions = reactions.filter(
    (reaction) => reaction.Label !== 'Ionization',
  );
  for (let ionizedMolecule of ionizedFragments.products) {
    if (ionizedMolecule.children?.length > 0) {
      for (let child of ionizedMolecule.children) {
        applyFragmentationReactions(child, fragmentationReactions, maxDepth);
      }
    } else {
      let moleculeToFragment = OCL.Molecule.fromIDCode(ionizedMolecule.idCode);
      let fragmentation = applyReactions(
        [moleculeToFragment],
        fragmentationReactions,
        {
          maxDepth,
        },
      );
      ionizedMolecule.children = fragmentation;
    }
  }
}
