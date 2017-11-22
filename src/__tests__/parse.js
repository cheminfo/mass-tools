'use strict';


const parse = require('../parse');

test('parse molecular formula', function () {
    check('C10');


});


function check(mf, result) {
    expect(parse('C10')).toMatchObject([{kind: 'atom', value: 'C'}, {kind: 'multiplier', value: 10}]);
}
