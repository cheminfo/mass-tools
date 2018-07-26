'use strict';

const Peptide = require('..').Util.Peptide;

test('test peptide', () => {
    expect(Peptide.sequenceToMF('AAA')).toEqual('HAlaAlaAlaOH');
});
