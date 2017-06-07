'use strict';

// Throttle CPU-intensive operations so that we don't saturate the event queue.
function throttle(pass_along_value) {
  return new Promise(function(resolve) {
    setImmediate(resolve, pass_along_value);
  });
}

module.exports = throttle;
