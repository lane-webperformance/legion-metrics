'use strict';

module.exports.generic = require('./generic');

module.exports.everything = module.exports.generic('everything','everything');

module.exports.outcome = module.exports.generic('outcome');
module.exports.outcome.success = module.exports.outcome('success');
module.exports.outcome.failure = module.exports.outcome('failure');
module.exports.outcome.timeout = module.exports.outcome('timeout');

module.exports.protocol = module.exports.generic('protocol');

module.exports.service = module.exports.generic('service');
module.exports.serviceCall = module.exports.generic('service-call');

module.exports.api = module.exports.generic('api');
module.exports.apiCall = module.exports.generic('api-call');

module.exports.testcase = module.exports.generic('testcase');
module.exports.testcaseCompletion = module.exports.generic('testcaseCompletion');

module.exports.section = module.exports.generic('section');
module.exports.sectionCompletion = module.exports.generic('sectionCompletion');
