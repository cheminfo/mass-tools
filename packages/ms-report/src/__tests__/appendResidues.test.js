const appendResidues = require('../appendResidues');

describe('appendResidues', () => {
  it('AA(Ph)A(Ph)A(Ts)A(Ph)U', () => {
    let data = {};
    appendResidues(data, 'AA(Ph)A(Ph)A(Ts)A(Ph)U');
    expect(data).toMatchSnapshot();
  });

  it('HAlaAlaAlaOH', () => {
    let data = {};
    appendResidues(data, 'HAlaAlaAlaOH');
    expect(data).toMatchSnapshot();
  });

  it('HAlaAla(H-1OH)AlaOH', () => {
    let data = {};
    appendResidues(data, 'HAlaAla(H-1OH)AlaOH');
    expect(data).toMatchSnapshot();
  });

  it('H(+)AlaAla(H-1OH)AlaOH', () => {
    let data = {};
    appendResidues(data, 'H(+)AlaAla(H-1OH)AlaOH');
    expect(data).toMatchSnapshot();
  });

  it('ForAlaAla(H-1OH)AlaOH', () => {
    let data = {};
    appendResidues(data, '(For)AlaAla(H-1OH)AlaOH');
    expect(data).toMatchSnapshot();
  });

  it('(MeO)AA(H-1NH2)AA rna', () => {
    let data = {};
    appendResidues(data, '(MeO)AA(H-1NH2)AA', { kind: 'rna' });
    expect(data).toMatchSnapshot();
  });

  it('(C5H5O)IleLeuAspAspLeuCys(C26H30N2OSi)AlaAsnGlnLeuGlnProLeuLeuLeuLysOH', () => {
    let data = {};
    appendResidues(
      data,
      '(C5H5O)IleLeuAspAspLeuCys(C26H30N2OSi)AlaAsnGlnLeuGlnProLeuLeuLeuLysOH',
      { kind: 'peptide' },
    );
    expect(data).toMatchSnapshot();
  });
});
