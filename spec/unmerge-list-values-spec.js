'use strict';

const reservoir = require('../src/merge/reservoir');
const avg = require('../src/merge/avg');
const listValues = require('../src/unmerge/list-values');

describe('unmerge.listValues', function() {
  it('Breaks down blobs of summary metrics into a table of values', function() {
    const summary = {
      tags: {
        outcome: {
          success: {
            values: {
              woof: {
                $min: 2,
                $avg: avg.singleton(2),
                $max: 2,
                unit$reservoir: reservoir.singleton('barks'),
                interpretation$reservoir: reservoir.singleton('amount of noise made by puppies')
              }
            }
          }
        },
        protocol: {
          http: {
            values: {
              meow: {
                $min: 10,
                $avg: avg.singleton(10),
                $max: 10,
                unit$reservoir: reservoir.singleton('millimews'),
                interpretation$reservoir: reservoir.singleton('amount of noise made by kitties')
              }
            }
          }
        }
      }
    };

    expect(listValues(summary).foo).not.toBeDefined();
    expect(listValues(summary).woof).toBeDefined();
    expect(Array.from(listValues(summary).woof.unit)).toEqual(['barks']);
    expect(Array.from(listValues(summary).meow.unit)).toEqual(['millimews']);
    expect(Array.from(listValues(summary).meow.interpretation)).toEqual(['amount of noise made by kitties']);
  });
});
