if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['util'], function(util) {

  'use strict';

  // use something like this on the client-side to get comprehensive?
  //    https://github.com/stacktracejs/stacktrace.js

  var breadcrumbs = {};

  breadcrumbs.prefix = '**breadcrumb: ';
  breadcrumbs.layerSize = 1;

  breadcrumbs.getStackTrace = function getStackTrace() {
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
    return stack.split('\n');
  };

  breadcrumbs.get = function get(depth) {
    var result = this.prefix + '<empty>\n';
    var lines = this.getStackTrace();
    var stack = lines.join('\n');
    var standard = /^Error/;

    //stack depth between this method and original caller
    depth = (depth || 0) + this.layerSize + 1;

    //looking for the V8 method of rendering an error
    if (standard.test(stack)) {
      if (lines && lines[depth + 1]) {
        var line = lines[depth + 1] + '\n';
        line = line.replace(/^ +at /, this.prefix);
        result = line;
      }
    }
    //Firefox callstacks don't include the error message on the first line
    else if (lines && lines[depth]) {
      result = this.prefix + lines[depth];
    }

    return result;
  };

  breadcrumbs.insert = function insert(err, depth) {
    if (!err) {
      return;
    }

    var stack = err.stack || '';
    var lines = stack.split(/ +at /);

    depth = (depth || 0) + this.layerSize;
    var breadcrumb = this.get(depth);

    if (lines.length) {
      var updated = [lines[0], breadcrumb];
      updated = updated.concat(lines.slice(1));

      err.stack = updated.join('  at ');
    }
    else {
      err.stack = '  at: ' + breadcrumb + err.stack;
    }
  };

  breadcrumbs.add = function add(err, cb, data, depth) {
    if (!err) {
      return false;
    }

    depth = (depth || 0) + this.layerSize;
    this.insert(err, depth);

    if (data && typeof data === 'object') {
      var keys = Object.keys(data);

      for (var i = 0, max = keys.length; i < max; i += 1) {
        var key = keys[i];
        if (typeof err[key] === 'undefined') {
          err[key] = data[key];
        }
      }
    }

    if (cb) {
      cb(err);
    }

    return true;
  };

  breadcrumbs.toString = function toString(err) {
    if (!err) {
      return '';
    }

    var result = util.inspect(err, {depth: 5});

    if (!err.log || err.log === 'warn' || err.log === 'error') {
      result += '\n' + this.prepareStack(err);
    }

    return result;
  };

  breadcrumbs.prepareStack = function prepareStack(err) {
    var prefix = '  at ';
    var stack = err.stack || '';

    //remove any instances of working directory
    if (typeof process !== 'undefined') {
      stack = stack.split(process.cwd()).join('');
    }

    //V8-style stacks include the error message before showing the actual stack; remove it
    var lines = stack.split(/ +at /);
    if (lines.length > 1) {
      stack = prefix + lines.slice(1).join(prefix);
    }

    return stack;
  };

  return breadcrumbs;
});
