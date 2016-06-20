'use strict';

Error.stackTraceLimit=Infinity;

require('jasmine-immutablejs-matchers');

const merge = require('../src/index').merge;
const immutable = require('immutable');

describe('The sum metrics operation', function() {
  it('can merge numerical values', function() {
    expect(merge.sum(5,7)).toBe(12);
    expect(merge.min(5,7)).toBe(5);
    expect(merge.max(5,7)).toBe(7);
    expect(merge.avg(merge.avg.singleton(5),merge.avg.singleton(7)).avg).toBe(6);
    expect(merge.avg(merge.avg.singleton(5),merge.avg.singleton(7)).size).toBe(2);
  });

  it('does not allow non-numerical values', function() {
    expect(function() { return merge.sum('two',3); }).toThrow();
    expect(function() { return merge.min('two',3); }).toThrow();
    expect(function() { return merge.max('two',3); }).toThrow();
    expect(function() { return merge.sum(2,'three'); }).toThrow();
    expect(function() { return merge.min(2,'three'); }).toThrow();
    expect(function() { return merge.max(2,'three'); }).toThrow();
    expect(function() { return merge.avg(merge.avg.singleton(2),merge.avg.singleton('three')); }).toThrow();
  });
});

describe('The merge metrics operations', function() {
  it('can merge sets and event streams', function() {
    expect(merge.events([100,200,300],[400,500,600])).toEqual(immutable.Set([100,200,300,400,500,600]));
  });

  it('can merge homogenous objects', function() {
    const sample_1 = {
      '$min': 5,
      '$max': 5,
      '$avg': merge.avg.singleton(5),
      'total$sum': 5,
      'count$sum': 1,
      '$events': [5] };

    const sample_2 = {
      '$min': 3,
      '$max': 3,
      '$avg': merge.avg.singleton(3),
      'total$sum': 3,
      'count$sum': 1,
      '$events': [3] };

    const result = merge.object(sample_1, sample_2);

    expect(JSON.parse(JSON.stringify(result))).toEqual({
      '$min': 3,
      '$max': 5,
      '$avg' : { avg: 4, size: 2 },
      'total$sum': 8,
      'count$sum': 2,
      '$events': [5,3]});
  });

  it('can merge heterogenous objects', function() {
    const sample_1 = {
      'data': { '$min': 3, '$max': 5 },
      '$events': ['foo','bar','baz'] };

    const sample_2 = {
      'avg': { 'total$sum': 100, 'count$sum': 5 },
      '$events': ['quux'] };

    const sample_3 = {
      'data': { '$sum': 20 } };

    let result = merge.object(sample_1, sample_2);
    result = merge.object(result, sample_3);

    expect(result).toEqualImmutable(immutable.Map({
      'data': immutable.Map({ '$min': 3, '$max': 5, '$sum' : 20 }),
      'avg': sample_2.avg,
      '$events': immutable.Set(['foo','bar','baz','quux']) }));
  });

  it('has a root merger method that DTRTs based on the type of the input', function() {
    const sample_1 = { 'foo$set': immutable.Set(['bar']) };
    const sample_2 = { 'foo$set': immutable.Set(['baz']) };

    expect(merge.root(sample_1,sample_2)).toEqualImmutable(immutable.Map({
      'foo$set': immutable.Set(['bar','baz'])}));

    expect(merge.root(null, sample_2)).toEqualImmutable(immutable.Map({
      'foo$set': immutable.Set(['baz'])}));
  });
});
