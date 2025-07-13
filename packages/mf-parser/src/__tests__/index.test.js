import { expect, test } from 'vitest';

import { parseToHtml } from '..';

test('parseToHtml', () => {
  let result = parseToHtml('SO4(--)');

  expect(result).toBe(
    'SO<span style="flex-direction: column;display: inline-flex;justify-content: center;text-align: left;vertical-align: middle;"><sup style="line-height: 1; font-size: 70%">-2</sup><sub style="line-height: 1; font-size: 70%">4</sub></span>',
  );

  let result2 = parseToHtml('12.2123C . 0.4123O . 32.6123N');

  expect(result2).toBe('12.2123C  •  0.4123O  •  32.6123N');
});
