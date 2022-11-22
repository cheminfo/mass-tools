import { splitPeptide } from '..';

describe('Checking split peptide', () => {
  it('Normal sequence split', () => {
    let result = splitPeptide('HAlaGlyLysHisAspOH');
    expect(result).toStrictEqual(['Ala', 'Gly', 'Lys', 'His', 'Asp']);
  });

  it('Sequence split : nothing on N-term', () => {
    let result = splitPeptide('AlaGlyLysHisAspOH');
    expect(result).toStrictEqual(['Ala', 'Gly', 'Lys', 'His', 'Asp']);
  });

  it('Sequence split : nothing on C-term', () => {
    let result = splitPeptide('HAlaGlyLysHisAsp');
    expect(result).toStrictEqual(['Ala', 'Gly', 'Lys', 'His', 'Asp']);
  });
});
