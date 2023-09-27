import { getDatabases } from '../getDatabases.js';

test('getDatabases', () => {
  const { ionizations, fragmentations } = getDatabases();

  expect(ionizations).toHaveLength(8);
  expect(fragmentations).toHaveLength(69);
});
