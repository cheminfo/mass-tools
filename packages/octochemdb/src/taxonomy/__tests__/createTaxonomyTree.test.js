import { readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from 'vitest';

import { createTaxonomyTree } from '../createTaxonomyTree';

test('createTaxonomyTree', () => {
  const taxonomies = [
    {
      superkingdom: 'Eukaryota',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Saccharomycetes',
      order: 'Saccharomycetales',
      family: 'Debaryomycetaceae',
      genus: 'Candida',
      species: 'Candida albicans',
    },
    {
      superkingdom: 'bacteria',
      phylum: 'Apicomplexa',
      class: 'Aconoidasida',
      order: 'Haemosporida',
      family: 'Plasmodiidae',
      genus: 'Plasmodium',
      species: 'Plasmodium falciparum',
    },
    {
      superkingdom: 'Eukaryota',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Sordariomycetes',
      order: 'Hypocreales',
      family: 'Stachybotryaceae',
      genus: 'Stachybotrys',
      species: 'Stachybotrys chartarum',
    },
    {
      superkingdom: 'bacteria',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Sordariomycetes',
      order: 'Hypocreales',
      family: 'Stachybotryaceae',
      genus: 'Stachybotrys',
      species: 'Stachybotrys cylindrospora',
    },
  ];

  let tree = createTaxonomyTree(taxonomies);

  expect(tree[1].children).toHaveLength(2);
  expect(tree[1].children[0].name).toBe('');
  expect(tree[1].children[0].rank).toBe('kingdom');
  expect(tree[1].children[1].name).toBe('Fungi');
  expect(tree[0].children[0].children[0].name).toBe('Ascomycota');
  expect(tree[0].children[0].children[0].children).toHaveLength(2);

  expect(tree).toMatchSnapshot();
});

test('only one entry', () => {
  const taxonomies = [
    {
      superkingdom: 'Eukaryota',
    },
  ];

  let tree = createTaxonomyTree(taxonomies);

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
      superkingdom: 'Eukaryota',
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
      superkingdom: 'Eukaryota',
      kingdom: 'bacteria',
      phylum: 'Ascomycota',
    },
  ];

  let tree = createTaxonomyTree(taxonomies);

  expect(tree[1].name).toBe('Eukaryota');
  expect(tree[1].count).toBe(2);
  expect(tree[1].children[0].name).toBe('bacteria');
  expect(tree[1].children[0].count).toBe(1);
  expect(tree[0].children[0].name).toBe('bacteria');
  expect(tree[0].children[0].count).toBe(3);
  expect(tree).toMatchSnapshot();
});

test('Rank Limit', () => {
  const taxonomies = [
    {
      superkingdom: 'Eukaryota',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Saccharomycetes',
      order: 'Saccharomycetales',
      family: 'Debaryomycetaceae',
      genus: 'Candida',
      species: 'Candida albicans',
    },
    {
      superkingdom: 'bacteria',
      phylum: 'Apicomplexa',
      class: 'Aconoidasida',
      order: 'Haemosporida',
      family: 'Plasmodiidae',
      genus: 'Plasmodium',
      species: 'Plasmodium falciparum',
    },
    {
      superkingdom: 'Eukaryota',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Sordariomycetes',
      order: 'Hypocreales',
      family: 'Stachybotryaceae',
      genus: 'Stachybotrys',
      species: 'Stachybotrys chartarum',
    },
    {
      superkingdom: 'bacteria',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Sordariomycetes',
      order: 'Hypocreales',
      family: 'Stachybotryaceae',
      genus: 'Stachybotrys',
      species: 'Stachybotrys cylindrospora',
    },
  ];
  const options = {
    rankLimit: 'Class',
  };
  let tree = createTaxonomyTree(taxonomies, options);

  expect(tree).toMatchSnapshot();
});

test('True data', () => {
  const taxonomies = [
    {
      species: 'plants',
    },
    {
      superkingdom: 'Bacteria',
      phylum: 'Bacillota',
      class: 'Bacilli',
      order: 'Bacillales',
      family: 'Bacillaceae',
      genus: 'Bacillus',
      species: 'Bacillus subtilis',
    },
    {
      superkingdom: 'Eukaryota',
      kingdom: 'Viridiplantae',
      phylum: 'Streptophyta',
      class: 'Magnoliopsida',
      order: 'Asterales',
      family: 'Asteraceae',
      genus: 'Aster',
      species: 'Aster altaicus',
    },
    {
      superkingdom: 'Eukaryota',
      kingdom: 'Viridiplantae',
      phylum: 'Streptophyta',
      class: 'Magnoliopsida',
      order: 'Asterales',
      family: 'Asteraceae',
      genus: 'Heteropappus',
      species: 'Heteropappus altaicus',
    },
    {
      superkingdom: 'Eukaryota',
      kingdom: 'Viridiplantae',
      phylum: 'Streptophyta',
      class: 'Magnoliopsida',
      order: 'Fabales',
      family: 'Fabaceae',
      genus: 'Cassia',
      species: 'Cassia roxburghii',
    },
  ];

  let tree = createTaxonomyTree(taxonomies);

  expect(tree).toMatchSnapshot();
});

test('over 200 entries', () => {
  const filePath = path.join(__dirname, 'data/manyTaxonomies.json');
  const taxonomies = JSON.parse(readFileSync(filePath, 'utf8'));
  let tree = createTaxonomyTree(taxonomies);

  expect(tree).toMatchSnapshot();
});

test('full data', () => {
  const filePath = path.join(__dirname, 'data/fullData.json');
  const taxonomies = JSON.parse(readFileSync(filePath, 'utf8'));
  let tree = createTaxonomyTree(taxonomies);

  expect(tree).toMatchSnapshot();
});
