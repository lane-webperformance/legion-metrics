'use strict';

// Merge values by finding their sum.
module.exports = function(a, b) {
  //The result of this method will be a hilarity of string concatenations
  //unless we guard against non-numbers showing up.

  if( typeof a !== 'number' )
    throw new Error('merge.sum: must be a number');

  if( typeof b !== 'number' )
    throw new Error('merge.sum: must be a number');

  return a + b;
};
