'use strict';

const myModule = require('..');

describe('test myModule', () => {
    it('should return 42', () => {
        expect(myModule()).toEqual(42);
    });
});
