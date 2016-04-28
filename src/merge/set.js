var immutable = require('immutable');

// Merges values by joining them into a big collection. Supports (at least)
// javascript arrays and Immutable.Set.  The result of a merge will be an
// Immutable.Set, however, if this is stringified to JSON, it will become
// an array again.
module.exports = function(a,b) {
  if( !immutable.Set.isSet(a) )
    a = immutable.Set(a);
  return a.union(b);
};
