'use strict';

const AbstractQuery = require('./AbstractQuery');
const TagQuery = require('./TagQuery');

class AxisQuery extends AbstractQuery {
  constructor(root_blob, path, query_parent) {
    super(root_blob, path, query_parent);
  }

  axisName() {
    return this.path()[this.path().length-1];
  }

  clone() {
    return new AxisQuery(this._root_blob, this._path, this._parent);
  }

  toString() {
    return this.axisName();
  }
  
  tags() {
    return this.tagNames().map(tag_name => this.tag(tag_name));
  }
  
  tagNames() {
    return Object.keys(this.blob()).sort();
  }

  tag(tag_name) {
    return new TagQuery(this.rootBlob(), this.path().concat(tag_name), this);
  }
}

module.exports = AxisQuery;

