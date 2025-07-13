import { expect, test } from 'vitest';

import { elements, groups } from '..';

test('mf-global', () => {
  expect(groups).toHaveLength(304);
  expect(elements).toHaveLength(118);
});
