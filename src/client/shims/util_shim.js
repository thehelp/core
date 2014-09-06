// # util_shim
// Kinda replicates some of the most oft-used methods of the `util`
// built-in node module.

// Dependencies and [strict mode](http://mzl.la/1fRhnam)
define([], function() {

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
    inspect: function inspect(obj, maxDepth, depth) {
      /*jshint maxcomplexity: 13 */

      if (typeof maxDepth === 'undefined') {
        maxDepth = 2;
        depth = 1;
      }
      else if (maxDepth <= 0) {
        try {
          return JSON.stringify(obj);
        }
        catch (e) {
          return '<' + e.message + '>';
        }
      }

      if (obj === null) {
        return 'null';
      }
      else if (typeof obj === 'undefined') {
        return 'undefined';
      }

      var indentation = this.repeat('  ', depth);
      var indentMinusOne = this.repeat('  ', depth - 1);
      var properties = this.getProperties(obj, maxDepth, depth).join(',\n' + indentation);

      if (obj.constructor && obj.constructor.name === 'Error') {
        if (properties.length) {
          return '{ [Error: ' + obj.message + ']\n  ' + properties + '\n}';
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
        return JSON.stringify(obj);
      }

      return '{\n' + indentation + properties + '\n' + indentMinusOne + '}';
    },

    // `getProperties` recursively pulls properties out of an object, returning an array
    // of full rendered keys, ready for the final string.
    getProperties: function getProperties(obj, maxDepth, depth) {
      var properties = [];
      for (var key in obj) {
        /*jshint forin: false */
        properties.push(key + ': ' + this.inspect(obj[key], maxDepth - 1, depth + 1));
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
