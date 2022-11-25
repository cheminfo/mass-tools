const appendResults = require('../appendResults');

describe('appendResults', () => {
  let info = require('../../data/ACGGCTT(C8H14N2O)AGG');
  it('no merge', () => {
    let data = { residues: { residues: new Array(10) } };
    appendResults(data, info, 10);
    expect(data.results).toHaveLength(284);
  });
  it('merge charge', () => {
    let data = { residues: { residues: new Array(10) } };
    appendResults(data, info, { merge: { charge: true } });
    expect(data.results).toHaveLength(222);
  });
  it('filter minSimilarity', () => {
    let data = { residues: { residues: new Array(10) } };
    appendResults(data, info, {
      filter: { minSimilarity: 0.99, minQuantity: 0.0001 },
    });
    expect(data.results).toHaveLength(15);
  });
  it('filter minQuantity', () => {
    let data = { residues: { residues: new Array(10) } };
    appendResults(data, info, {
      filter: { minQuantity: 0.2 },
    });
    expect(data.results).toHaveLength(280);
  });
  it('filter minRelativeQuantity', () => {
    let data = { residues: { residues: new Array(10) } };
    appendResults(data, info, {
      filter: { minRelativeQuantity: 0.2 },
    });
    expect(data.results).toHaveLength(284);
  });
  it('filter showInternals', () => {
    let data = { residues: { residues: new Array(10) } };
    appendResults(data, info, { filter: { showInternals: false } });
    expect(data.results).toHaveLength(249);
  });
});
