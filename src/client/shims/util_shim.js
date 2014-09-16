// # util_shim
// Kinda replicates some of the most oft-used methods of the `util`
// built-in node module.

// Dependencies and [strict mode](http://mzl.la/1fRhnam)
define(function() {

  'use strict';

  return {
    /*
    `inspect` gives you a way better representation of an object
    than `JSON.stringify`. You can provide a higher `maxDepth` to
    go deeper into an object. Strings returned look like this:

        {
          left: "yes",
          right: {
            left: "yes",
            right: 'no'
          }
        }

    or, special-cased output for Error objects:

        [error: You can't do that!]
    */
    inspect: function inspect(obj, options) {
      /*jshint maxcomplexity: 18 */
      options = options || {};

      if (typeof options.depth === 'undefined') {
        options.depth = 3;
      }
      if (typeof options.currentDepth === 'undefined') {
        options.currentDepth = 1;
      }

      if (obj === null) {
        return 'null';
      }
      else if (typeof obj === 'undefined') {
        return 'undefined';
      }

      if (typeof obj.inspect === 'function') {
        return obj.inspect();
      }

      var indentation = this.repeat('  ', options.currentDepth);
      var indentMinusOne = this.repeat('  ', options.currentDepth - 1);
      var properties = this.getProperties(obj, options.depth, options.currentDepth);

      if (obj instanceof Error) {
        if (properties.length) {
          var filtered = [];
          for (var i = 0, max = properties.length; i < max; i += 1) {
            var property = properties[i];

            if (!/^message:/.exec(property) &&
              !/^description:/.exec(property) &&
              !/^stack/.exec(property) &&
              !/^sourceURL:/.exec(property)) {

              filtered.push(property);
            }
          }

          if (filtered.length) {
            return '{ [Error: ' + obj.message + ']\n  ' +
              filtered.join(',\n' + indentation) +
              '\n}';
          }
        }

        return '[Error: ' + obj.message + ']';
      }
      else if (obj instanceof RegExp) {
        return obj.toString();
      }
      else if (typeof obj === 'string' || obj instanceof String) {
        return '"' + obj + '"';
      }
      else if (obj instanceof Date) {
        return '"' + obj.toJSON() + '"';
      }
      else if (typeof obj !== 'object') {
        return String(obj);
      }

      if (properties.length) {
        return '{\n' + indentation + properties.join(',\n' + indentation) + '\n' +
          indentMinusOne + '}';
      }
      else {
        return obj.toString();
      }
    },

    // `getProperties` recursively pulls properties out of an object, returning an array
    // of full rendered keys, ready for the final string.
    getProperties: function getProperties(obj, depth, currentDepth) {
      var properties = [];
      if (depth <= 0) {
        return properties;
      }

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          properties.push(key + ': ' + this.inspect(obj[key], {
            depth: depth - 1,
            currentDepth: currentDepth + 1
          }));
        }
      }
      return properties;
    },

    // `repeat` repeats the first parameter `n` times. This method is
    // duplicated here because when this module is pulled in with 'util'
    // (as a shim for the 'util' node module), we can't use relative pathing
    // to pull in string. Boo.
    repeat: function repeat(target, n) {
      var result = '';
      if (n <= 0) {
        return result;
      }

      for (var i = 0, max = n; i < max; i += 1) {
        result += target;
      }
      return result;
    },

    // `inherits` does "proper" inheritance. For reference:
    // [node's util.inherits](http://bit.ly/1fRjdYX)
    inherits: function inherits(Child, Parent) {
      Child.prototype = Object.create(Parent.prototype, {
        constructor: {
          value: Child,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };

});
