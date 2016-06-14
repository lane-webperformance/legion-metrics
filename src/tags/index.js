'use strict';

module.exports.generic = require('./generic');

module.exports.protocol = module.exports.generic('protocol');

module.exports.outcome = module.exports.generic('outcome');
module.exports.outcome.success = module.exports.outcome('success');
module.exports.outcome.failure = module.exports.outcome('failure');
module.exports.outcome.timeout = module.exports.outcome('timeout');

module.exports.raw = require('./raw');
