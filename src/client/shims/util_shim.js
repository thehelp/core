// # util_shim
// Kinda replicates some of the most oft-used methods of the `util`
// built-in node module.

// Dependencies and
// [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode)
define([
],
  function(
  ) {
  'use strict';

  return {
    /*
    `inspect` gives you a way better representation of an object
    than `JSON.stringify`. You can provide a higher `maxDepth` to
    go deeper into an object. Strings returned look like this:

        {
          left: "yes"
          , right: {
            left: "yes"
            , right: "no"
          }
        }

    or, special-cased output for Error objects:

        [error: You can't do that!]
    */
    inspect: function(obj, maxDepth, depth) {
      /*jshint maxcomplexity: 12 */

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

      if (obj.constructor && obj.constructor.name === 'Error') {
        return '[error: ' + obj.message + ']';
      }
      else if (obj instanceof RegExp) {
        return obj.toString();
      }
      else if (obj instanceof Date || obj instanceof String ||
        typeof obj !== 'object') {
        return JSON.stringify(obj);
      }

      var indentation = this.repeat('  ', depth);
      var indentMinusOne = this.repeat('  ', depth - 1);

      var properties = [];
      for (var key in obj) {
        /*jshint forin: false */
        properties.push(key + ': ' + this.inspect(obj[key], maxDepth - 1, depth + 1));
      }
      properties = properties.join('\n' + indentation + ', ');

      return '{\n' + indentation + properties + '\n' + indentMinusOne + '}';
    },

    // `repeat` repeats the first parameter `n` times. This method is
    // duplicated here because when this module is pulled in with 'util'
    // (as a shim for the 'util' node module), we can't use relative pathing
    // to pull in string. Boo.
    repeat: function(target, n) {
      if (n > 0) {
        return target + this.repeat(target, n - 1);
      }
      else {
        return '';
      }
    },

    // `inherits` does "proper" inheritance. For reference:
    // [node's util.inherits](http://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor)
    inherits: function(Child, Parent) {
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
