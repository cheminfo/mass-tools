import { expect, test } from 'vitest';

import { elements, groups } from '..';

test('mf-global', () => {
  expect(groups).toHaveLength(299);
  expect(elements).toHaveLength(118);
});
