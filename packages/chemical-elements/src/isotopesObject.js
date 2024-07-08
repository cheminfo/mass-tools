import { elementsAndIsotopesObject as elements } from './elementsAndIsotopesObject';

export const isotopesObject = {};
for (const key of Object.keys(elements)) {
  let e = elements[key];
  for (const i of e.isotopes) {
    isotopesObject[i.nominal + key] = {
      abundance: i.abundance,
      mass: i.mass,
    };
  }
}
