'use strict';

const Query = require('./Query');

module.exports = (root_blob, prefix, parent_probably_undefined) => new Query(root_blob, prefix || [], parent_probably_undefined || null);
