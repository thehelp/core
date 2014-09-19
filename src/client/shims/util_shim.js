// # util_shim
// Kinda replicates some of the most oft-used methods of the `util`
// built-in node module.

define(function() {

  'use strict';

  return {
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
    },

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
      /*jshint maxcomplexity: 15 */
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

      var indentation = this._repeat('  ', options.currentDepth);
      var indentMinusOne = this._repeat('  ', options.currentDepth - 1);

      if (obj instanceof Array) {
        return this._renderArray(obj, options);
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

      var properties = this._getProperties(obj, options.depth, options.currentDepth);

      if (obj instanceof Error) {
        return this._renderError(obj, properties, indentation);
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

    // Utility methods
    // =======
    // Changes in these may be made at any time.

    // `_getProperties` recursively pulls properties out of an object, returning an array
    // of full rendered keys, ready for the final string.
    _getProperties: function _getProperties(obj, depth, currentDepth) {
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

    _renderArray: function _renderArray(obj, options) {
      var items = [];
      for (var i = 0, max = obj.length; i < max; i += 1) {
        items.push(this.inspect(obj[i], {
          depth: options.depth - 1,
          currentDepth: options.currentDepth + 1
        }));
      }
      return '[' + items.join(', ') + ']';
    },

    _renderError: function _renderError(obj, properties, indentation) {
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
    },

    // `_repeat` repeats the first parameter `n` times.
    _repeat: function _repeat(target, n) {
      var result = '';
      if (n <= 0) {
        return result;
      }

      for (var i = 0, max = n; i < max; i += 1) {
        result += target;
      }
      return result;
    }
  };

});
