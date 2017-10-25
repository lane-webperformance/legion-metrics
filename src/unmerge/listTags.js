'use strict';

module.exports = function(blob, tags) {
  tags = tags || {};

  for( const axis in blob.tags ) {
    tags[axis] = tags[axis] || new Set();
    for( const tag in blob.tags[axis] )
      tags[axis].add(tag);
  }

  return tags;
};
