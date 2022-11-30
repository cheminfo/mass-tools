import { groups, elements } from '..';

test('mf-global', () => {
  expect(groups).toHaveLength(303);
  expect(elements).toHaveLength(118);
});
