
// Merge values by finding their sum.
// This can also be used to merge values into an average, by totaling the
// values and totaling the number of values, and dividing through after
// all values have been merged.
module.exports = function(a, b) {
  //The result of this method will be a hilarity of string concatenations
  //unless we guard against non-numbers showing up.

  if( typeof a !== 'number' )
    throw new Error('merge.sum: must be a number');

  if( typeof b !== 'number' )
    throw new Error('merge.sum: must be a number');

  return a + b;
};
