import { elementsAndIsotopesObject as elements } from './elementsAndIsotopesObject';

export const isotopesObject = {};
Object.keys(elements).forEach((key) => {
  let e = elements[key];
  e.isotopes.forEach((i) => {
    isotopesObject[i.nominal + key] = {
      abundance: i.abundance,
      mass: i.mass,
    };
  });
});

module.exports = isotopesObject;
