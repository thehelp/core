if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['util'], function(util) {

  'use strict';

  function Breadcrumbs() {}

  Breadcrumbs.prototype.prefix = '**breadcrumb: ';
  Breadcrumbs.prototype.layerSize = 1;

  Breadcrumbs.prototype.newError = function newError(message, options, depth) {
    depth = (depth || 0) + this.layerSize;

    var err = new Error(message);
    err.stack = this.getStackTrace(depth).join('\n');

    if (options) {
      this.merge(err, options);
    }

    return err;
  };

  Breadcrumbs.prototype.getStackTrace = function getStackTrace(depth) {
    depth = (depth || 0) + this.layerSize;

    var err = new Error('Something');

    if (!err.stack) {
      try {
        throw err;
      }
      catch (e) {
        err = e;
      }
    }

    var stack = err.stack || '';
    var lines = stack.split('\n');

    if (lines && lines.length && /^Error/.test(lines[0])) {
      depth += 1;
    }

    return lines.slice(depth);
  };

  Breadcrumbs.prototype.get = function get(depth) {
    var result = this.prefix + '<empty>\n';
    var v8 = /^ +at /;

    //stack depth between getStackTrace() and original caller
    depth = (depth || 0) + this.layerSize;

    var lines = this.getStackTrace(depth);

    if (lines && lines.length) {
      result = lines[0];

      if (v8.test(result)) {
        result = result.replace(v8, this.prefix)  + '\n';
      }
      else {
        result = this.prefix + result + '\n';
      }
    }

    return result;
  };

  Breadcrumbs.prototype.insert = function insert(err, depth) {
    if (!err) {
      return;
    }

    var stack = err.stack || '';
    var v8 = / +at /;

    depth = (depth || 0) + this.layerSize;
    var breadcrumb = this.get(depth);

    if (this.startsWithError(stack)) {
      var lines = stack.split(v8);
      var updated = [lines[0], breadcrumb];
      updated = updated.concat(lines.slice(1));

      err.stack = updated.join('  at ');
    }
    else if (this.hasAts(stack)) {
      err.stack = '  at ' + breadcrumb + err.stack;
    }
    else {
      err.stack = breadcrumb + err.stack;
    }
  };

  Breadcrumbs.prototype.merge = function merge(target, source) {
    if (target && source && typeof source === 'object') {
      var keys = Object.keys(source);

      for (var i = 0, max = keys.length; i < max; i += 1) {
        var key = keys[i];

        if (typeof target[key] === 'undefined') {
          target[key] = source[key];
        }
      }
    }
  };

  Breadcrumbs.prototype.add = function add(err, cb, data, depth) {
    if (!err) {
      return false;
    }

    depth = (depth || 0) + this.layerSize;
    this.insert(err, depth, data && data.backup);

    this.merge(err, data);

    if (cb) {
      cb(err);
    }

    return true;
  };

  Breadcrumbs.prototype.toString = function toString(err) {
    if (!err) {
      return '';
    }

    var result = util.inspect(err, {depth: 5});

    if (!err.log || err.log === 'warn' || err.log === 'error') {
      result += '\n' + this.prepareStack(err);
    }

    return result;
  };

  Breadcrumbs.prototype.startsWithError = function(stack) {
    var v8 = /^Error: /;
    return Boolean(v8.test(stack));
  };

  Breadcrumbs.prototype.hasAts = function(stack) {
    var v8 = / +at /;
    return Boolean(v8.test(stack));
  };

  Breadcrumbs.prototype.prepareStack = function prepareStack(err) {
    var prefix = '  at ';
    var stack = err.stack || '';

    //remove any instances of working directory
    if (typeof process !== 'undefined') {
      stack = stack.split(process.cwd()).join('');
    }

    //V8-style stacks include the error message before showing the actual stack;
    //remove it, even if it has newlines in it, by using each line's prefix to split it
    if (this.startsWithError(stack)) {
      var lines = stack.split(/ +at /);
      if (lines && lines.length) {
        stack = prefix + lines.slice(1).join(prefix);
      }
    }

    return stack;
  };

  return Breadcrumbs;
});
