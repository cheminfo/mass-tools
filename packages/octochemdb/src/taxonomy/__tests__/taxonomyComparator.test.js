import { taxonomyComparator } from '../taxonomyComparator.js';

test('taxonomyComparator', () => {
  const tax1 = {
    superkingdom: 'Bacteria',
    kingdom: 'Bacteria',
    phylum: 'Proteobacteria',
    class: 'Gammaproteobacteria',
    order: 'Enterobacterales',
  };
  const tax2 = {
    superkingdom: 'Bacteria',
    phylum: 'Phylum',
  };

  const tax3 = {
    superkingdom: 'Bacteria',
    kingdom: '',
    phylum: 'Phylum',
  };

  expect(taxonomyComparator(tax1, tax2)).toBe(1);
  expect(taxonomyComparator(tax2, tax1)).toBe(-1);
  expect(taxonomyComparator(tax2, tax3)).toBe(0);
});
