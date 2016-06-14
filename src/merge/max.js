'use strict';

// Merge values by finding their maximum.
module.exports = function(a, b) {
  if( typeof a !== 'number' )
    throw new Error('merge.max: must be a number');

  if( typeof b !== 'number' )
    throw new Error('merge.max: must be a number');

  return Math.max(a,b);
};
