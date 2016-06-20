'use strict';

const immutable = require('immutable');

// Merges values by joining them into a big collection. Supports (at least)
// javascript arrays and Immutable.Set.  The result of a merge will be an
// Immutable.Set, however, if this is stringified to JSON, it will become
// an array again.
module.exports = function(a,b) {
  if( !immutable.Set.isSet(a) ) {
    a = immutable.Set(a);
  }

  if( !immutable.Set.isSet(b) ) {
    b = immutable.Set(b);
  }

  return a.union(b);
};
