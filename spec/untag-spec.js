'use strict';

const reservoir = require('../src/merge/reservoir');
const avg = require('../src/merge/avg');
const untag = require('../src/untag');

describe('unmerge', function() {
  it('allows chaining queries to the point of finding a specific value of a specific tag', function() {
    const summary = {
      data: {
        in_a_weird_place: {
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
                },
                tags: {
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
        }
      }
    };

    const query = untag(summary, ['data', 'in_a_weird_place']);

    expect(query.axisNames()).toEqual(['outcome','protocol']);
    expect(query.axis('protocol').tag('http').value('meow').average()).toEqual(10);
    expect(query.axis('outcome').tag('success').axisNames()).toEqual(['protocol']);
    expect(query.axis('outcome').tag('success').axis('protocol').tagNames()).toEqual(['http']);
    expect(query.axis('outcome').tag('success').axis('protocol').tag('http').path()).toEqual(['data','in_a_weird_place','tags','outcome','success','tags','protocol','http']);
    expect(query.axis('outcome').tag('success').blob()).toBe(summary.data.in_a_weird_place.tags.outcome.success);
    expect(query.axis('outcome').tag('success').toString()).toEqual('outcome:success');
    expect(query.axis('outcome').tag('success').axisName()).toEqual('outcome');
    expect(query.axis('outcome').tag('success').tagName()).toEqual('success');
    expect(query.axis('outcome').tag('success').valueNames()).toEqual(['woof']);

    expect(query.axis('outcome').pathEquals(query.axis('outcome'))).toBe(true);
    expect(query.axis('outcome').tag('success').pathEquals(query.axis('outcome').tag('success'))).toBe(true);
    expect(query.axis('outcome').tag('success').axis('protocol').pathEquals(query.axis('outcome').tag('success').axis('protocol'))).toBe(true);
    expect(query.axis('outcome').tag('success').axis('protocol').tag('http').pathEquals(query.axis('outcome').tag('success').axis('protocol').tag('http'))).toBe(true);
    expect(query.axis('outcome').tag('success').value('woof').pathEquals(query.axis('outcome').tag('success').value('woof'))).toBe(true);

    expect(query.axis('outcome').pathPrefixOf(query.axis('outcome'))).toBe(true);
    expect(!query.axis('outcome').tag('success').pathPrefixOf(query.axis('outcome'))).toBe(true);
    expect(query.axis('outcome').tag('success').pathPrefixOf(query.axis('outcome').tag('success').axis('protocol'))).toBe(true);
    expect(query.axis('outcome').tag('success').axis('protocol').pathPrefixOf(query.axis('outcome').tag('success').axis('protocol').tag('http'))).toBe(true);
    expect(query.axis('outcome').tag('success').pathPrefixOf(query.axis('outcome').tag('success').value('woof'))).toBe(true);
  });
});
