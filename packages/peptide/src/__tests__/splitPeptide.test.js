'use strict';

var PEP = require('..');

describe('Checking split peptide', () => {
  test('Normal sequence split', () => {
    var result = PEP.splitPeptide('HAlaGlyLysHisAspOH');
    expect(result).toEqual(['Ala', 'Gly', 'Lys', 'His', 'Asp']);
  });

  test('Sequence split : nothing on N-term', () => {
    var result = PEP.splitPeptide('AlaGlyLysHisAspOH');
    expect(result).toEqual(['Ala', 'Gly', 'Lys', 'His', 'Asp']);
  });

  test('Sequence split : nothing on C-term', () => {
    var result = PEP.splitPeptide('HAlaGlyLysHisAsp');
    expect(result).toEqual(['Ala', 'Gly', 'Lys', 'His', 'Asp']);
  });
});
