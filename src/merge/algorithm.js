'use strict';

// This is the legion metrics merge algorithm. It combines two objects (which both contain summary statistics) into one.
//
// The algorithm looks at key names to determine how elements should be merged. For example, keys that end with $sum should
// be summed together into one big total.
//
// This has to all be in one big function, so we can .toString() it and pass it to couchdb as a map-reduce function.
//
// Fun times.  :)

module.exports = function(a,b) {
  // Helper function to catch values that aren't numbers.
  const assertNumber = function(value) {
    if( typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) )
      throw new Error('not a number');

    return value;
  };

  // Helper function to catch objects that aren't averages.
  const assertAvg = function(o) {
    try {
      assertNumber(o.avg);
      assertNumber(o.size);
      return o;
    } catch(e) {
      throw new Error('not a valid average object: ' + o);
    }
  };

  // Helper function to switch between merge rules based on each key (i.e. foo$min, or my_value$avg).
  const selectMergeRule = function(available_operations, key, a, b) {
    if( !key.includes('$') )
      return available_operations.object(a,b);

    const op_key = key.split('$').pop();
    const op = available_operations[op_key];
    if( typeof op !== 'function' )
      throw new Error('merge operation not available: ' + op_key);
    return op.call(available_operations,a,b);
  };

  const removeDuplicates = function(xs) {
    const seen = [];
    const result = [];

    for( const i in xs ) {
      if( typeof xs[i].value === 'object' ) {
        result.push(xs[i]);
        // not worth running an n^2 algorithm on something that will mostly never happen
        // alternately, if we're nubbing strings, they're probably all the same and this is running in constant time
        // why would we have a reservoir of any other type?
        continue;
      }

      if( !seen.includes(xs[i].value) ) {
        seen.push(xs[i].value);
        result.push(xs[i]);
      }
    }

    return result;
  };


  // Table of merge rules.
  const merge_rules = {
    // Merges a running average of two samples
    avg : function(a,b) {
      assertAvg(a);
      assertAvg(b);

      return assertAvg({
        avg : (a.avg*a.size + b.avg*b.size)/(a.size+b.size),
        size : a.size + b.size
      });
    },

    // Merges to maximum of two numbers
    max : function(a,b) {
      assertNumber(a);
      assertNumber(b);

      return Math.max(a,b);
    },

    // Merges to minimum of two numbers
    min : function(a,b) {
      assertNumber(a);
      assertNumber(b);

      return Math.min(a,b);
    },

    sum : function(a, b) {
      assertNumber(a);
      assertNumber(b);

      return a + b;
    },

    // Merge two javascript objects, paying attention to the tagged keys (i.e. $min, etc)
    // to decide what merge operation to use on each key.
    object : function(a,b) {
      if( !a )
        return b;
      if( !b )
        return a;

      const result = Object.assign({}, a, b);

      for( const k of Object.keys(a) )
        if( k in a && k in b )
          result[k] = selectMergeRule(this, k, a[k], b[k]);

      return result;
    },

    reservoir : function(a,b) {
      assertNumber(a.population_size);
      assertNumber(b.population_size);

      const MULTIPLE = 10; // multiple arbitrarily selected to balance user comfort -vs- scalability needs
      const result = {
        reserve : [].concat(a.reserve,b.reserve),
        population_size : a.population_size + b.population_size
      };

      const sample_size = Math.round(MULTIPLE*Math.log(result.population_size+1)/Math.log(2));
      result.reserve.sort((x,y) => y.key - x.key);
      result.reserve.length = Math.min(result.reserve.length,sample_size);
      result.reserve = removeDuplicates(result.reserve);

      return result;
    }
  };

  if( typeof a === 'object' && typeof b === 'object' )
    return merge_rules.object(a,b);
  else
    throw new Error('not sure what to do with: ' + a);
};
