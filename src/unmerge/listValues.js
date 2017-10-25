'use strict';

const reservoir = require('../merge/reservoir');

module.exports = function(blob, values) {
  values = values || {};

  for( const axis in blob.tags ) {
    for( const tag in blob.tags[axis] ) {
      for( const value in blob.tags[axis][tag].values ) {
        values[value] = values[value] || {
          unit: new Set(),
          interpretation: new Set()
        };

        for( const u of reservoir.get(blob.tags[axis][tag].values[value].unit$reservoir).reserve )
          values[value].unit.add(u);

        for( const i of reservoir.get(blob.tags[axis][tag].values[value].interpretation$reservoir).reserve )
          values[value].interpretation.add(i);
      }
    }
  }

  return values;
};
