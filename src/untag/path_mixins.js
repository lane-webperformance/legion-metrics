'use strict';

module.exports.pathEquals = pathEquals;
module.exports.pathPrefixOf = pathPrefixOf;

function pathEquals(other) {
  const me = this.path();
  const you = other.path();

  if( me.length !== you.length )
    return false;

  for( let i = 0; i < me.length; i++ )
    if( me[i] !== you[i] )
      return false;

  return true;
}

function pathPrefixOf(other) {
  const me = this.path();
  const you = other.path();

  if( me.length > you.length )
    return false;

  for( let i = 0; i < me.length; i++ )
    if( me[i] !== you[i] )
      return false;

  return true;
}


