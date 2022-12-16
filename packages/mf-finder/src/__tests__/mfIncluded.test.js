import { mfIncluded } from '..';

test('mfIncluded', () => {
  expect(mfIncluded('C', 'C0-2H0-2C')).toBeTruthy();
  expect(mfIncluded('C3', 'C0-2H0-2C')).toBeTruthy();
  expect(mfIncluded('C4', 'C0-2H0-2C')).toBeFalsy();
  expect(mfIncluded('C', 'Me0-5')).toBeFalsy();
  expect(mfIncluded('CH3', 'Me0-5')).toBeTruthy();
  expect(mfIncluded('C2H6', 'Me0-5')).toBeTruthy();
  expect(mfIncluded('C2H6O', 'Me0-5(CH3O)0-5')).toBeTruthy();
  expect(
    mfIncluded('C2H6O', 'Me0-5(CH3O)0-5', {
      filter: { unsaturation: { min: 0 } },
    }),
  ).toBeTruthy();
  expect(
    mfIncluded('C2H6O', 'Me0-5(CH3O)0-5', {
      filter: { unsaturation: { min: 1 } },
    }),
  ).toBeFalsy();
  expect(
    mfIncluded('C2H6O', 'Me0-5(CH3O)0-5', {
      filter: { unsaturation: { min: 1 } },
    }),
  ).toBeFalsy();
  expect(mfIncluded('C2H6O', 'Me0-5')).toBeFalsy();
});
