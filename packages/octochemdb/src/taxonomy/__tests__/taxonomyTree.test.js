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
  console.log(JSON.stringify(tree[1], null, 2));
  expect(tree[1].children).toHaveLength(2);
  expect(tree[1].children[0].name).toBe('');
  expect(tree[1].children[1].name).toBe('Fungi');
  expect(tree[0].children[0].children[0].name).toBe('Ascomycota');
  expect(tree[0].children[0].children[0].children).toHaveLength(2);

  expect(tree).toMatchSnapshot();
});
test('only one entry', () => {
  const taxonomies = [
    {
      superKingdom: 'Eukaryota',
    },
  ];

  let tree = taxonomyTree(taxonomies);

  expect(tree[0].name).toBe('Eukaryota');
  expect(tree[0].count).toBe(1);

  expect(tree).toMatchSnapshot();
});
test('multiple undefined fields', () => {
  const taxonomies = [
    {
      kingdom: 'bacteria',
    },
    {
      superKingdom: 'Eukaryota',
    },
    {
      kingdom: 'bacteria',
      phylum: 'Ascomycota',
    },
    {
      kingdom: 'bacteria',
      phylum: 'Ascomycota',
    },
    {
      superKingdom: 'Eukaryota',
      kingdom: 'bacteria',
      phylum: 'Ascomycota',
    },
  ];

  let tree = taxonomyTree(taxonomies);
  expect(tree[1].name).toBe('Eukaryota');
  expect(tree[1].count).toBe(2);
  expect(tree[1].children[0].name).toBe('bacteria');
  expect(tree[1].children[0].count).toBe(1);
  expect(tree[0].children[0].name).toBe('bacteria');
  expect(tree[0].children[0].count).toBe(3);
  expect(tree).toMatchSnapshot();
});
