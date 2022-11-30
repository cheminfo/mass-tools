import {
  calculateIEP,
  calculateIEPChart,
  getColorForIEP,
  calculateCharge,
  generatePeptideFragments,
} from '..';

describe('generatePeptideFragments', () => {
  it('Natural peptide, default options', () => {
    let result = generatePeptideFragments('HAlaGlySerOH');
    expect(result).toHaveLength(4);
    expect(result).toHaveProperty('0', 'HAla(+1)$b1');
  });
  it('Non natural peptide fragments default options', () => {
    let result = generatePeptideFragments('HAla(H-1Ph)Gly(Ts)SerOH');
    expect(result).toHaveLength(4);
    expect(result).toHaveProperty('0', 'HAla(H-1Ph)(+1)$b1');
  });
  it('All fragments', () => {
    let result = generatePeptideFragments('HAlaGlySerOH', {
      a: true,
      b: true,
      c: true,
      x: true,
      y: true,
      z: true,
    });
    expect(result).toHaveLength(12);
  });
});

describe('isoelectric point', () => {
  it('One point', () => {
    let result = calculateIEP('HAlaGlySerLysLysHisOH');
    expect(result).toBe(10.744);
  });

  it('calculateIEPChart', () => {
    let result = calculateIEPChart('HAlaGlySerLysLysHisOH');
    expect(result.y).toHaveLength(1401);
    expect(result.yAbs).toHaveLength(1401);
  });

  it('getColorForIEP', () => {
    let result = getColorForIEP(4);
    expect(result).toBe('rgb(105,105,255)');
  });

  it('calculateCharge', () => {
    let result = calculateCharge('HAlaGlySerLysLysHisOH', 2.0);
    expect(result).toBe(3.334);
  });
});
