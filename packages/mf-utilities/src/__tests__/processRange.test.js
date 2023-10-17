import { processRange } from '../processRange';

const tests = [
  ['C1-3', ['C', 'C2', 'C3']],
  ['C-1-3', ['C-1', '', 'C', 'C2', 'C3']],
  ['C-1--3', ['C-3', 'C-2', 'C-1']],
  ['(H+)-1--3', ['(H+)-3', '(H+)-2', '(H+)-1']],
];

describe('processRange', () => {
  it.each(tests)('%s', (mf, value) => {
    expect(processRange(mf)).toStrictEqual(value);
  });

  it('C1-10 H1-10 C1-10 H1-10 C1-10', () => {
    const result = processRange('C1-10 H1-10 C1-10 H1-10 C1-9 C0-1 C', '', {
      optimization: true,
    });
    expect(result).toHaveLength(532);
  });

  it('C0-1 C0-1', () => {
    const result = processRange('C0-1 C0-1', '', {
      optimization: true,
    });
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(['', 'C', 'C2'])
  });

  it('C C', () => {
    const result = processRange('C C', '', {
      optimization: true,
    });
    expect(result).toHaveLength(1);
    expect(result).toStrictEqual(['C C'])
  });

});
