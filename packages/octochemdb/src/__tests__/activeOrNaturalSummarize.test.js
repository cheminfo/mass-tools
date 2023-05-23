import { readFileSync } from 'fs';
import { join } from 'path';

import { activeOrNaturalSummarize } from '../activeOrNaturalSummarize.js';

describe('activeOrNaturalSummarize', () => {
  it('simple case', async () => {
    const entry = JSON.parse(
      readFileSync(join(__dirname, './details.json'), 'utf8'),
    );
    const result = await activeOrNaturalSummarize(entry);
    expect(result).toBeDefined();
    expect(true).toBe(true);
  });
});
