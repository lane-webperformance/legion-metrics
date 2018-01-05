'use strict';

const reservoir = require('../merge/reservoir');

module.exports = function(blob) {
  if( !blob.values )
    throw new Error('not a values object (no blob.values field)');

  const searches = {
    valueNames: () => Object.keys(blob.values),
    values: () => searches.valueNames().map(value_name => searches.value(value_name)),
    value: (value_name) => Object.assign({
      toString: () => value_name,
      valueName: () => value_name,
      average: () => blob.values[value_name].$avg.avg,
      size: () => blob.values[value_name].$avg.size,
      minimum: () => blob.values[value_name].$min,
      maximum: () => blob.values[value_name].$max,
      unit: () => reservoir.get(blob.values[value_name].unit$reservoir).reserve,
      interpretation: () => reservoir.get(blob.values[value_name].interpretation$reservoir).reserve
    })
  };

  return searches;
};
