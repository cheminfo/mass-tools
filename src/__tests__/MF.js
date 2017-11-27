'use strict';

var MF = require('../MF');

test('MF', () => {
    var mf = new MF('Et3N.HCl');
    var parts = mf.toParts();
    expect(parts).toEqual(
        [[
            {kind: 'atom', value: 'Et', multiplier: 3},
            {kind: 'atom', value: 'N', multiplier: 1}
        ], [
            {kind: 'atom', value: 'Cl', multiplier: 1},
            {kind: 'atom', value: 'H', multiplier: 1}
        ]]
    );
    var toCanonicalHtml = mf.toCanonicalHtml();
    expect(toCanonicalHtml).toBe('Et<sub>3</sub>N<sub>1</sub> • Cl<sub>1</sub>H<sub>1</sub>');
});
