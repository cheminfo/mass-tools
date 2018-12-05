'use strict';

var MF = require('../MF');

test('getEA', () => {
  let result;

  result = new MF('C').getEA();

  result = new MF('4C').getEA();
  result = new MF('2C2').getEA();
  result = new MF('C4').getEA();
  result = new MF('[13C]').getEA();

  result = new MF('C{50,50}10').getEA();

  result = new MF('Me2').getEA();
  console.log(result);
});
