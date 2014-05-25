// # string
// A few quick string-related utility methods.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {

  'use strict';

  return {
    // `splice` inserts one string into another at a specified location.
    splice: function(source, location, toInsert) {
      if (location < 0 || location > source.length) {
        throw new Error('location ' + location + ' out of range');
      }
      return source.slice(0, location) + toInsert + source.slice(location);
    },

    // `capitalize` takes the first character of the provided string and makes it
    // uppercase.
    capitalize: function(source) {
      return source.charAt(0).toUpperCase() + source.slice(1);
    },

    // `truncate` returns a string with `limit` characters or less. If the original string
    // was longer than `limit` characters, it will be truncated to fit. Any truncated
    // string will end with an ellipsis ("...") to signify that it's missing info.
    truncate: function(limit, text) {
      var result;
      if (text.length > limit) {
        result = text.substring(0, limit - 3);
        result += '...';
        return result;
      }
      return text;
    },

    // `pluralize` is very simple - it takes a `count` as well as `singular`
    // and `plural` strings. It then returns a string with both the count and the
    // appropriate singular or plural label.
    pluralize: function(count, singular, plural) {
      if (count === 1) {
        return count + ' ' + singular;
      }
      return count + ' ' + plural;
    },

    // `normalizePhoneNumber` takes a number like '(800) 555-3333'
    // and turns it into '+18005553333', which can be used with Twilio.
    normalizePhoneNumber: function(number) {
      number = number.replace(/[() +-]/gi, '');
      if (number.length < 11) {
        number = '1' + number;
      }
      number = '+' + number;
      return number;
    },

    // `formatPhoneNumber` takes a normalized phone number and makes it
    // human-reasonable again.
    formatPhoneNumber: function(number) {
      if (number.length !== 12) {
        return number;
      }
      number = this.splice(number, 2, ' (');
      number = this.splice(number, 7, ') ');
      number = this.splice(number, 12, '-');

      return number;
    },

    // `repeat` repeats the first parameter `n` times.
    repeat: function(target, n) {
      if (n > 0) {
        return target + this.repeat(target, n - 1);
      }
      else {
        return '';
      }
    }
  };
});

