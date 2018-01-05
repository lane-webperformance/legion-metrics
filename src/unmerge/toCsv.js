'use strict';

const stringify = require('csv-stringify');
const toTable = require('./toTable');

module.exports = function(path, blobs) {
  return new Promise(function(resolve,reject) {
    try {
      stringify(toTable(path, blobs), function(err, output) {
        if(err) {
          reject(err);
        } else {
          resolve(output);
        }
      });
    } catch(err) { reject(err); }
  });
};
