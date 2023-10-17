import { MF } from '..';

const tests = [
  ['C1-3', ['C', 'C2', 'C3']],
  ['C-1-3', ['C-1', '', 'C', 'C2', 'C3']],
  ['C-1--3', ['C-3', 'C-2', 'C-1']],
  ['(H+)-1--3', ['(H+)-3', '(H+)-2', '(H+)-1']],
  ['(H(2+))1-3', ['(H(+2))', '(H(+2))2', '(H(+2))3']],
];

describe('MF Flatten', () => {
  it.each(tests)('%s', (mf, value) => {
    const mfObject = new MF(mf);
    expect(mfObject.flatten()).toStrictEqual(value);
  });

  it('HAlaOH', () => {
    const mf = new MF('HAlaOH');
    const flatten = mf.flatten();
    expect(flatten).toStrictEqual(['HAlaOH']);
  });

  it('C0-2 O0-2', () => {
    const mf = new MF('C0-2 O0-2');
    const flatten = mf.flatten();
    expect(flatten).toStrictEqual([
      '',
      'C',
      'C2',
      'O',
      'CO',
      'C2O',
      'O2',
      'CO2',
      'C2O2',
    ]);
  });

  it('(CH2(C)2)0-2', () => {
    const mf = new MF('CH3(CH2(C)2)0-2Me2$comment');
    const flatten = mf.flatten();
    expect(flatten).toStrictEqual([
      'CH3Me2$comment',
      'CH3(CH2(C)2)Me2$comment',
      'CH3(CH2(C)2)2Me2$comment',
    ]);
  });

  it('C0-1 C0-1', () => {
    const mf = new MF('C0-1 C0-1');
    const flatten = mf.flatten({ groupIdentical: true });
    expect(flatten).toStrictEqual(['', 'C', 'C2']);
  });
  it('C1-10 H1-10 C1-10 H1-10 C1-10', () => {
    const mf = new MF('C1-10 H1-10 C1-10 H1-10 C1-9 C0-1 C');
    const flatten = mf.flatten({ groupIdentical: true });
    expect(flatten).toHaveLength(532);
  });
});
