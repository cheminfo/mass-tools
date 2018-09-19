'use strict';

const Nucleotide = require('..').Util.Nucleotide;

test('test nucleotide', () => {
    expect(Nucleotide.sequenceToMF('AAA', { kind: 'dna' })).toEqual(
        'HODampDampDampH'
    );
});