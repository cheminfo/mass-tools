'use strict';

const getEutrophicationPotential = require('../getEutrophicationPotential');

describe('getEutrophicationPotential', () => {
  it('result for C5 H10 O2 P N3', () => {
    var resultEP = getEutrophicationPotential('C5 H10 O2 P N3');

    expect(resultEP.v).toBe(1.2182971014492754);
    expect(resultEP.thOD).toBe(4.25);
    expect(resultEP.ep).toBeCloseTo(0.6606776206950749, 0.0000001);
    expect(resultEP.mw).toBeCloseTo(175.125768, 0.000001);
    expect(resultEP.mf).toBe('C5H10N3O2P');
    expect(resultEP.log).toBe('Successful calculation');
  });
});
