'use strict';

const R = require('ramda');

class AbstractQuery {
  constructor(root_blob, path, query_parent) {
    this._root_blob = root_blob;
    this._path = path;
    this._parent = query_parent;
  }

  blob() {
    return R.path(this.path(), this.rootBlob());
  }

  clone() {
    return new AbstractQuery(this._root_blob, this._path);
  }

  exists() {
    return !!this.blob();
  }

  path() {
    return this._path;
  }

  pathEquals(other) {
    const me = this.path();
    const you = other.path();

    if( me.length !== you.length )
      return false;

    for( let i = 0; i < me.length; i++ )
      if( me[i] !== you[i] )
        return false;

    return true;
  }

  pathPrefixOf(other) {
    const me = this.path();
    const you = other.path();

    if( me.length > you.length )
      return false;

    for( let i = 0; i < me.length; i++ )
      if( me[i] !== you[i] )
        return false;

    return true;
  }

  pop() {
    return this._parent;
  }

  rootBlob() {
    return this._root_blob;
  }

  toString() {
    return this.path().join('.');
  }

  withRootBlob(root_blob) {
    const result = this.clone();
    result._root_blob = root_blob;
    if( result._parent )
      result._parent = result._parent.withRootBlob(root_blob);
    return result;
  }
}

module.exports = AbstractQuery;

