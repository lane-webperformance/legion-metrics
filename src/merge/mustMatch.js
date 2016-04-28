
// Merges two identical values into the same value.
// Throws an error if the values are not identical.
module.exports = function(a,b) {
  if( a === b )
    return a;

  throw new Error('mustMatch: didn\'t match');
};
