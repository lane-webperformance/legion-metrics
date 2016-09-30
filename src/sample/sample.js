'use strict';

const avg = require('../merge/avg');

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
      unit$set : [this.values[k].unit],
      interpretation$set : [this.values[k].interpretation]
    };});

  return { values : result };
};

module.exports = function(values, details) {
  if( typeof values !== 'object' )
    throw new Error('parameter "values" must be a dictionary of sample values { value : number, unit : string, interpretation : string }');

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
