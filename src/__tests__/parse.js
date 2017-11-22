'use strict';


const parse = require('../parse');


var tests = {
    C10: [{kind: 'atom', value: 'C'}, {kind: 'multiplier', value: 10}],
    'C-1': [{kind: 'atom', value: 'C'}, {kind: 'multiplier', value: -1}],
    'C1-10': [{kind: 'atom', value: 'C'}, {kind: 'multiplierRange', value: {from: 1, to: 10}}],
    '2H': [{kind: 'preMultiplier', value: 2}, {kind: 'atom', value: 'H'}],
    '[13C]': [{kind: 'isotope', value: {atom: 'C', isotope: 13}}],
    'C++': [{kind: 'atom', value: 'C'}, {kind: 'charge', value: 2}],
    'C2+': [{kind: 'atom', value: 'C'}, {kind: 'multiplier', value: 2}, {kind: 'charge', value: 1}],
    'C(2+)': [{kind: 'atom', value: 'C'}, {kind: 'charge', value: 2}],
    'C(++)': [{kind: 'atom', value: 'C'}, {kind: 'charge', value: 2}],
    'C(+2)': [{kind: 'atom', value: 'C'}, {kind: 'charge', value: 2}],
    'C(2-)': [{kind: 'atom', value: 'C'}, {kind: 'charge', value: -2}],
    'C(--)': [{kind: 'atom', value: 'C'}, {kind: 'charge', value: -2}],
    'C(-2)': [{kind: 'atom', value: 'C'}, {kind: 'charge', value: -2}],
    'C(H-2)': [{kind: 'atom', value: 'C'}, {kind: 'openingParenthesis', value: '('}, {kind: 'atom', value: 'H'}, {kind: 'multiplier', value: -2}, {kind: 'closingParenthesis', value: ')'}],
    'H.Cl': [{kind: 'atom', value: 'H'}, {kind: 'salt', value: '.'}, {kind: 'atom', value: 'Cl'}],

};

var tests = {
    'H{1,1}': [{kind: 'atom', value: 'H'}, {kind: 'salt', value: '.'}, {kind: 'atom', value: 'Cl'}]

};

test('parse molecular formula', function () {
    for (var key of Object.keys(tests)) {
        check(key, tests[key]);
    }
});


function check(mf, result) {
    var parsed = parse(mf);
    console.log(parsed);
    expect(parsed).toMatchObject(result);
}
