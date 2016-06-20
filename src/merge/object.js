'use strict';

const immutable = require('immutable');

// Choose which merge operation ($max/$min/$sum/$events, etc) to use when
// merging two members of two metrics objects. Dispatch is decided based on
// the trailing string after the last '$' of each key in a metrics object.
function chooseMergeOperation(available_operations, a, b, key) {
  if( !key.includes('$') )
    return available_operations.object(a,b);

  return available_operations[key.split('$').pop()].call(available_operations,a,b);
}

// Merges objects by copying all of the keys of each object into a single
// object. If a key exists in both objects, it recursively performs
// the merge operation on the two values of that key using
// chooseMergeOperation.
//
// The result will be an immutable map, although this method will accept
// plain-old-javascript-objects, too.
module.exports = function(a,b) {
  if( !immutable.Map.isMap(a) ) {
    a = immutable.Map(a);
  }

  if( !immutable.Map.isMap(b) ) {
    b = immutable.Map(b);
  }

  return a.mergeWith(chooseMergeOperation.bind(undefined, this), b);
};
