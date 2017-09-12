'use strict';

module.exports.singleton = function(value) {
  if( typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) )
    throw new Error('not a number');

  return {
    avg : value,
    size : 1
  };
};
