'use strict';


const ID = require('..');

describe('test myModule', () => {
    it('should return 42', () => {
        expect(ID()).toEqual(42);
    });
});
