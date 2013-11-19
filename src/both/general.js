// # general
// A few quick utility methods useful just about everywhere.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode)
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['winston', 'util'], function(winston, util) {
  'use strict';

  return {
    winston: winston,

    // `isNode` checks for `window`, `module` and `process` to make its decision.
    // we're on the client.
    isNode: function() {
      return typeof window === 'undefined' &&
        (typeof module !== 'undefined' || process !== 'undefined');
    },

    // `getHost` the location of this server. On the client, requires
    // `window.host` to be defined. On the server. the `HOST` environment
    // variable.
    getHost: function() {
      if (this.isNode()) {
        return process.env.HOST;
      }
      else {
        if (!window.host) {
          this.winston.warn('window.host not set, returning null!');
        }

        return window.host;
      }
    },

    // `checkError` will log, call a provided (optional) callback and return true
    // if `err` is truthy. Otherwise it will return false.
    checkError: function(message, err, cb) {
      if (err) {
        this.winston.error(util.inspect(err) + ' - ' + message +
         '; callstack: ' + err.stack);

        if (cb) {
          cb(err, null);
        }
        return true;
      }
      else {
        return false;
      }
    },

    // `checkPrecondition` will call the provided callback with an `Error` if the
    // condition isn't truthy.
    checkPrecondition: function(condition, message, cb) {
      if (condition) {
        return false;
      }
      else {
        if (cb) {
          cb(new Error(message), null);
        }
        return true;
      }
    },

    // `setTimeout` and `setInterval` - because it's annoying to pass the callback as the first parameter.
    setTimeout: function(number, cb) {
      return setTimeout(cb, number);
    },

    setInterval: function(number, cb) {
      return setInterval(cb, number);
    }
  };
});
