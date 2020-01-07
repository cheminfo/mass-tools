'use strict';

const appendResidues = require('../appendResidues');

describe('appendResidues', () => {
  it('AA(Ph)A(Ph)A(Ts)A(Ph)U', () => {
    let result = appendResidues('AA(Ph)A(Ph)A(Ts)A(Ph)U');
    expect(result).toMatchSnapshot();
    p;
  });

  it('HAlaAlaAlaOH', () => {
    let result = appendResidues('HAlaAlaAlaOH');
    expect(result).toMatchSnapshot();
  });

  it('HAlaAla(H-1OH)AlaOH', () => {
    let result = appendResidues('HAlaAla(H-1OH)AlaOH');
    expect(result).toMatchSnapshot();
  });

  it('H(+)AlaAla(H-1OH)AlaOH', () => {
    let result = appendResidues('H(+)AlaAla(H-1OH)AlaOH');
    expect(result).toMatchSnapshot();
  });

  it('ForAlaAla(H-1OH)AlaOH', () => {
    let result = appendResidues('(For)AlaAla(H-1OH)AlaOH');
    expect(result).toMatchSnapshot();
  });

  it('(MeO)AA(H-1NH2)AA rna', () => {
    let result = appendResidues('(MeO)AA(H-1NH2)AA', { kind: 'rna' });
    expect(result).toMatchSnapshot();
  });
});
