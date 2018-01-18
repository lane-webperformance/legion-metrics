'use strict';

const AbstractQuery = require('./AbstractQuery');
const AxisQuery = require('./AxisQuery');

class Query extends AbstractQuery {
  constructor(root_blob, path, query_parent) {
    super(root_blob, path, query_parent);
  }

  clone() {
    return new Query(this._root_blob, this._path, this._parent);
  }

  axisNames() {
    return Object.keys(this.blob().tags).sort();
  }
  
  axes() {
    return this.axisNames().map(axis_name => this.axis(axis_name));
  }
  
  tagNames() {
    return this.tags().map(t => t.tagName());
  }

  tags() {
    const result = [];

    this.axes().forEach(axis => axis.tags().forEach(tag=> result.push(tag)));

    return result;
  }

  axis(axis_name) {
    return new AxisQuery(this._root_blob, this._path.concat('tags', axis_name), this);
  }
}

module.exports = Query;

