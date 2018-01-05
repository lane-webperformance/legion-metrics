'use strict';

const reservoir = require('../src/merge/reservoir');
const avg = require('../src/merge/avg');
const unvalue = require('../src/untag/values');

describe('unmerge.listValues', function() {
  it('Breaks down blobs of summary metrics into a table of values', function() {
    const summary = {
      values: {
        woof: {
          $min: 5,
          $avg: { avg: 6, size: 2 },
          $max: 7,
          unit$reservoir: reservoir.singleton('barks'),
          interpretation$reservoir: reservoir.singleton('amount of noise made by puppies')
        },
        meow: {
          $min: 10,
          $avg: avg.singleton(10),
          $max: 10,
          unit$reservoir: reservoir.singleton('millimews'),
          interpretation$reservoir: reservoir.singleton('amount of noise made by kitties')
        }
      }
    };

    expect(unvalue(summary).valueNames()).toEqual(['woof','meow']);
    expect(unvalue(summary).value('woof').minimum()).toEqual(5);
    expect(unvalue(summary).value('woof').average()).toEqual(6);
    expect(unvalue(summary).value('woof').maximum()).toEqual(7);
    expect(unvalue(summary).value('woof').size()).toEqual(2);
    expect(unvalue(summary).value('woof').unit()).toEqual(['barks']);
    expect(unvalue(summary).value('woof').interpretation()).toEqual(['amount of noise made by puppies']);
    expect(unvalue(summary).value('meow').path()).toEqual(['values','meow']);
  });
});
