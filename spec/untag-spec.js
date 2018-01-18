'use strict';

const reservoir = require('../src/merge/reservoir');
const avg = require('../src/merge/avg');
const untag = require('../src/untag');

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
                $min: 9,
                $avg: avg.singleton(10),
                $max: 11,
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

const root_query = untag(summary, ['data', 'in_a_weird_place']);

describe('untag', function() {
  it('root level Queries', function() {
    expect(root_query.axisNames()).toEqual(['outcome','protocol']);
    expect(root_query.tagNames()).toEqual(['success','http']);
  });

  it('ValueQueries', function() {
    const value_query = root_query.axis('protocol').tag('http').value('meow');
    expect(value_query.average().measurement()).toEqual(10);
    expect(value_query.size().measurement()).toEqual(1);
    expect(value_query.minimum().measurement()).toEqual(9);
    expect(value_query.maximum().measurement()).toEqual(11);
    expect(value_query.unit().measurement().reserve).toEqual(['millimews']);
    expect(value_query.interpretation().measurement().reserve).toEqual(['amount of noise made by kitties']);
  });

  it('TagQueries', function() {
    const tag_query = root_query.axis('outcome').tag('success');

    expect(tag_query.axisNames()).toEqual(['protocol']);
    expect(tag_query.axis('protocol').tagNames()).toEqual(['http']);
    expect(tag_query.axis('protocol').tag('http').path()).toEqual(['data','in_a_weird_place','tags','outcome','success','tags','protocol','http']);
    expect(tag_query.blob()).toBe(summary.data.in_a_weird_place.tags.outcome.success);
    expect(tag_query.toString()).toEqual('outcome:success');
    expect(tag_query.axisName()).toEqual('outcome');
    expect(tag_query.tagName()).toEqual('success');
    expect(tag_query.valueNames()).toEqual(['woof']);
  });

  it('pathEquals', function() {
    const query = root_query;
    
    expect(query.axis('outcome').pathEquals(query.axis('outcome'))).toBe(true);
    expect(query.axis('outcome').tag('success').pathEquals(query.axis('outcome').tag('success'))).toBe(true);
    expect(query.axis('outcome').tag('success').axis('protocol').pathEquals(query.axis('outcome').tag('success').axis('protocol'))).toBe(true);
    expect(query.axis('outcome').tag('success').axis('protocol').tag('http').pathEquals(query.axis('outcome').tag('success').axis('protocol').tag('http'))).toBe(true);
    expect(query.axis('outcome').tag('success').value('woof').pathEquals(query.axis('outcome').tag('success').value('woof'))).toBe(true);
  });

  it('pathPrefixOf', function() {
    const query = root_query;

    expect(query.axis('outcome').pathPrefixOf(query.axis('outcome'))).toBe(true);
    expect(!query.axis('outcome').tag('success').pathPrefixOf(query.axis('outcome'))).toBe(true);
    expect(!query.axis('outcome').tag('success').pathPrefixOf(query)).toBe(true);
    expect(query.axis('outcome').tag('success').pathPrefixOf(query.axis('outcome').tag('success').axis('protocol'))).toBe(true);
    expect(query.axis('outcome').tag('success').axis('protocol').pathPrefixOf(query.axis('outcome').tag('success').axis('protocol').tag('http'))).toBe(true);
    expect(query.axis('outcome').tag('success').pathPrefixOf(query.axis('outcome').tag('success').value('woof'))).toBe(true);
  });

  it('withRootBlob', function() {
    const query = root_query.axis('outcome').tag('success').axis('protocol').tag('http').value('meow').average();

    expect(query.measurement()).toBe(10);

    const alternate = query.withRootBlob({ data: { in_a_weird_place: { tags: { outcome: { success: { tags: { protocol: { http: { values: { meow: { $avg: { avg: -2 } } } } } } } } } } } });

    expect(alternate.exists()).toBe(true);
    expect(alternate.measurement()).toBe(-2);

    const bogus = query.withRootBlob({ data: { tags: { outcome: { success: { tags: { protocol: { http: { values: { meow: { $avg: { avg: -2 } } } } } } } } } } });

    expect(bogus.exists()).toBe(false);
  });
});
