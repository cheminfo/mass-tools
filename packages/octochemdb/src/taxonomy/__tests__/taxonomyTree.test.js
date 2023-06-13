import { taxonomyTree } from '../taxonomyTree';

test('taxonomyTree', () => {
  const taxonomies = [
    {
      superKingdom: 'Eukaryota',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Saccharomycetes',
      order: 'Saccharomycetales',
      family: 'Debaryomycetaceae',
      genus: 'Candida',
      species: 'Candida albicans',
    },
    {
      superKingdom: 'bacteria',
      phylum: 'Apicomplexa',
      class: 'Aconoidasida',
      order: 'Haemosporida',
      family: 'Plasmodiidae',
      genus: 'Plasmodium',
      species: 'Plasmodium falciparum',
    },
    {
      superKingdom: 'Eukaryota',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Sordariomycetes',
      order: 'Hypocreales',
      family: 'Stachybotryaceae',
      genus: 'Stachybotrys',
      species: 'Stachybotrys chartarum',
    },
    {
      superKingdom: 'bacteria',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Sordariomycetes',
      order: 'Hypocreales',
      family: 'Stachybotryaceae',
      genus: 'Stachybotrys',
      species: 'Stachybotrys cylindrospora',
    },
  ];

  let tree = taxonomyTree(taxonomies);
  expect(tree[0].children).toHaveLength(2);
  expect(tree[0].children[1].name).toBe('Fungi');
  expect(tree[0].children[0].name).toBe('Apicomplexa');
});
