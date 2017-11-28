'use strict';

var MF = require('../src/MF');
var CC = require('chemcalc');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

// add tests
suite
    .add('new', function () {
        let info = {mf: ''};
        for (let i = 0; i < 1000; i++) {
            let mf = info.mf + 'H' + i + 'C' + i;
            let mfObject = new MF(mf);
            info = mfObject.getInfo();
        }
    })
    .add('chemcalc', function () {
        let info = {mf: ''};
        for (let i = 0; i < 1000; i++) {
            let mf = info.mf + 'H' + i + 'C' + i;
            info = CC.analyseMF(mf);
        }
    })
// add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
// run async
    .run({async: true});

