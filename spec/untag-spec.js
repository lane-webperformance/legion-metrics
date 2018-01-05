'use strict';

const reservoir = require('../src/merge/reservoir');
const avg = require('../src/merge/avg');
const unmerge = require('../src/unmerge');

describe('unmerge', function() {
  it('allows chaining queries to the point of finding a specific value of a specific tag', function() {
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

    expect(unmerge.tags(summary).axisNames()).toEqual(['outcome','protocol']);
    expect(unmerge.tags(summary).axis('protocol').tag('http').value('meow').average()).toEqual(10);
  });
});
