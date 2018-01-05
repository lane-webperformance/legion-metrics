'use strict';

const R = require('ramda');
const reservoir = require('../merge/reservoir');

module.exports = function(root_blob, prefix_path) {
  prefix_path = prefix_path || [];

  const blob = R.path(prefix_path, root_blob); 

  if( !blob.values )
    throw new Error('not a values object (no blob.values field)');

  const query = {
    valueNames: function() {
      return Object.keys(blob.values);
    },
    values: function() {
      return this.valueNames().map(value_name => this.value(value_name));
    },
    value: (value_name) => Object.assign({
      toString: function() {
        return value_name;
      },
      valueName: function() {
        return value_name;
      },
      blob: function() {
        return blob.values[value_name];
      },
      path: function() {
        return prefix_path.concat('values', value_name);
      },
      average: function() {
        return this.blob().$avg.avg;
      },
      size: function() {
        return this.blob().$avg.size;
      },
      minimum: function() {
        return this.blob().$min;
      },
      maximum: function() {
        return this.blob().$max;
      },
      unit: function() {
        return reservoir.get(blob.values[value_name].unit$reservoir).reserve;
      },
      interpretation: function() {
        return reservoir.get(blob.values[value_name].interpretation$reservoir).reserve;
      }
    })
  };

  return query;
};
