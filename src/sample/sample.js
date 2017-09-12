'use strict';

const avg = require('../merge/avg');
const reservoir = require('../merge/reservoir');

const Sample = {};

Sample.summarize = function() {
  const result = {};

  Object.keys(this.values).forEach(k => {
    const v = this.values[k].value;

    if( typeof v !== 'number' || Number.isNaN(v) || !Number.isFinite(v) )
      throw new Error('Not a valid sample value for ' + k + ': ' + v);

    result[k] = {
      $max : v,
      $min : v,
      $avg : avg.singleton(v),
      unit$reservoir : reservoir.singleton(this.values[k].unit),
      interpretation$reservoir : reservoir.singleton(this.values[k].interpretation)
    };});

  return { values : result };
};

module.exports = function(values, details) {
  module.exports.assertSampleValues(values);

  const result = Object.assign(
    Object.create(Sample),
    details, {
      type:  'sample',
      values: Object.assign({}, values)
    });

  // fail fast if we can't summarize
  result.summarize();

  return result;
};

module.exports.assertSampleValues = function(values) {
  if( typeof values !== 'object' )
    throw new Error('sample values must be a dictionary of sample blocks: { value: number, unit: string, interpretation: string }');

  if( Object.getPrototypeOf(values) !== Object.prototype )
    throw new Error('sample values must be a plain javascript object (no prototype)');

  Object.keys(values).forEach(k => {
    assertSampleBlock(values[k]);
  });
};

// Part of assertSampleValues. Asserts that a particular entry of a sample values object has the format { value: number, unit: string, interpretation: string }.
function assertSampleBlock(block) {
  if( typeof block !== 'object' )
    throw new Error('sample values must be a dictionary of sample blocks: { value: number, unit: string, interpretation: string }');

  if( typeof block.value !== 'number' )
    throw new Error('sample.value must be a number');

  if( typeof block.unit !== 'string' && block.unit !== undefined )
    throw new Error('sample.unit must be a string describing the unit of measurement');

  if( typeof block.interpretation !== 'string' && block.unit !== undefined )
    throw new Error('sample.interpretation must be a human-readable string briefly explaining the meaning of the measurement');

  Object.keys(block).forEach(k => {
    if( !['value','unit','interpretation'].includes(k) )
      throw new Error('unexpected key: ' + k);
  });
}

module.exports.timestamp = function(value) {
  if( typeof value === 'undefined' )
    value = Date.now();

  return {
    value : value,
    unit : 'milliseconds since 1970',
    interpretation : 'The timestamp of an event or sample, as measured in milliseconds since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970.\n' +
                     'See also: https://en.wikipedia.org/wiki/Unix_time.\n' +
                     'See also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now'
  };
};

module.exports.duration = function(value) {
  return {
    value : value,
    unit : 'milliseconds',
    interpretation : 'Time needed to complete an operation.'
  };
};
