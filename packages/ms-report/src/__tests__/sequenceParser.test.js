'use strict';

const sequenceParser = require('../sequenceParser');

describe('sequenceParser', () => {
  it('AA(Ph)A(Ph)A(Ts)A(Ph)U', () => {
    let result = sequenceParser('AA(Ph)A(Ph)A(Ts)A(Ph)U');
    expect(result).toMatchSnapshot();
  });

  it('HAlaAlaAlaOH', () => {
    let result = sequenceParser('HAlaAlaAlaOH');
    expect(result).toMatchSnapshot();
  });

  it('HAlaAla(H-1OH)AlaOH', () => {
    let result = sequenceParser('HAlaAla(H-1OH)AlaOH');
    expect(result).toMatchSnapshot();
  });

  it('H(+)AlaAla(H-1OH)AlaOH', () => {
    let result = sequenceParser('H(+)AlaAla(H-1OH)AlaOH');
    expect(result).toMatchSnapshot();
  });

  it('ForAlaAla(H-1OH)AlaOH', () => {
    let result = sequenceParser('(For)AlaAla(H-1OH)AlaOH');
    expect(result).toMatchSnapshot();
  });

  it('(MeO)AA(H-1NH2)AA rna', () => {
    let result = sequenceParser('(MeO)AA(H-1NH2)AA', { kind: 'rna' });
    expect(result).toMatchSnapshot();
  });
});
