import { groups, elements } from '..';

test('mf-global', () => {
  expect(groups).toHaveLength(304);
  expect(elements).toHaveLength(118);
});
