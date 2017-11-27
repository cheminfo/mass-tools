'use strict';

var MF = require('../MF');

test('MF', () => {
    var mf = new MF('Et3N.HCl');
    var parts = mf.toParts();

    expect(parts).toEqual(
        [[
            {kind: 'atom', value: 'C', multiplier: 6},
            {kind: 'atom', value: 'H', multiplier: 15},
            {kind: 'atom', value: 'N', multiplier: 1}
        ], [
            {kind: 'atom', value: 'Cl', multiplier: 1},
            {kind: 'atom', value: 'H', multiplier: 1}
        ]]
    );

    mf.canonize();
    let html = mf.toHtml();

    expect(html).toBe('C<sub>6</sub>H<sub>15</sub>N<sub>1</sub> • Cl<sub>1</sub>H<sub>1</sub>');

    let info = mf.toInfo();
    expect(info).toEqual({
        mf: '',
        parts: []
    });
});
