'use strict';

const R = require('ramda');

module.exports = function(paths, blobs) {
  const result = [];

  result.push(paths.map(path => path.join('.')));

  blobs.forEach(blob => {
    const line = [];
    paths.forEach(path => {
      line.push(R.path(path, blob));
    });

    result.push(line);
  });

  return result;
};
