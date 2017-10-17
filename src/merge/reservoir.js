'use strict';

const R = require('ramda');

module.exports.get = function(summary) {
  if( !summary )
    return { reserve : [], population_size: 0 };

  return {
    reserve : R.uniq(summary.reserve.map(x => x.value)),
    population_size : summary.population_size
  };
};

module.exports.singleton = function(value) {
  return {
    reserve : [{ key: Math.random(), value: value }],
    population_size : 1
  };
};

module.exports.set = function(values) {
  return {
    reserve : values.map(x => Object.assign({ key: Math.random(), value: x })),
    population_size : values.length
  };
};
