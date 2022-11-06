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
});
