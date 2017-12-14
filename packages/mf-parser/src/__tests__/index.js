'use strict';

var MFParser = require('../index');

test('parseToHtml', () => {
    var result = MFParser.parseToHtml('SO4(--)');
    expect(result).toBe('SO<span style="flex-direction: column;display: inline-flex;justify-content: center;text-align: left;vertical-align: middle;"><sup style="line-height: 1; font-size: 70%">-2</sup><sub style="line-height: 1; font-size: 70%">4</sub></span>');
});
