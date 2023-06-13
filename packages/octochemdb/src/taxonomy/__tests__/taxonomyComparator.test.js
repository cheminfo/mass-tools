import { taxonomyComparator } from '../taxonomyComparator.js';

test('taxonomyComparator', () => {
  const tax1 = {
    superKingdom: 'Bacteria',
    kingdom: 'Bacteria',
    phylum: 'Proteobacteria',
    class: 'Gammaproteobacteria',
    order: 'Enterobacterales',
  };
  const tax2 = {
    superKingdom: 'Bacteria',
    phylum: 'Phylum',
  };

  const tax3 = {
    superKingdom: 'Bacteria',
    kingdom: '',
    phylum: 'Phylum',
  };

  expect(taxonomyComparator(tax1, tax2)).toBe(1);
  expect(taxonomyComparator(tax2, tax1)).toBe(-1);
  expect(taxonomyComparator(tax2, tax3)).toBe(0);
});
