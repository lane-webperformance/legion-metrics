'use strict';

module.exports.generic = require('./generic');

module.exports.outcome = module.exports.generic('outcome');
module.exports.outcome.success = module.exports.outcome('success');
module.exports.outcome.failure = module.exports.outcome('failure');
module.exports.outcome.timeout = module.exports.outcome('timeout');

module.exports.protocol = module.exports.generic('protocol');

module.exports.testcase = module.exports.generic('testcase');
module.exports.testcaseCompletion = module.exports.generic('testcaseCompletion');

module.exports.step = module.exports.generic('step');
module.exports.stepCompletion = module.exports.stepCompletion('stepCompletion');

module.exports.raw = require('./raw');
