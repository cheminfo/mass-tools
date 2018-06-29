'use strict';

const Nucleotide = require('..');

describe('test nucleotide', () => {
    test('sequenceToMF of AAA return ', () => {
        expect(Nucleotide.sequenceToMF('AAA')).toEqual('HODampDampDampH');
    });
});
