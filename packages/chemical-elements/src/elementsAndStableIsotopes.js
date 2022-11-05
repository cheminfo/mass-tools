import originalElements from './elements.json';

export const elementsAndStableIsotopes = JSON.parse(
  JSON.stringify(originalElements),
);

elementsAndStableIsotopes.forEach((element) => {
  element.isotopes = element.isotopes.filter((i) => i.abundance > 0);
});
