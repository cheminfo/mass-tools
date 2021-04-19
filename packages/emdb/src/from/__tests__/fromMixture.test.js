/* eslint-disable import/no-extraneous-dependencies */
'use strict';

const { toBeDeepCloseTo } = require('jest-matcher-deep-close-to');

expect.extend({ toBeDeepCloseTo });

const DBManager = require('../..');

describe('fromMixture', () => {
  it('fromNucleicSequence', () => {
    let dbManager = new DBManager();

    let data = [{ sequence: 'AAA', options: {} }];

    dbManager.fromMixture(data, {
      ionizations: 'H+,Na+',
    });
    let results = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);
    console.log(results);
  });
});
