// # color
// This module provides a number of methods for dealing with color.

// [RequireJS](http://requirejs.org/) boilerplate, dependencies and
// [strict mode](http://mzl.la/1fRhnam)
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {

  'use strict';

  return {
    // `parse` takes a string `color` and turns it into its
    // components parts. An object with `red`, `green`, `blue`
    // (and perhaps `alpha`) keys.
    parse: function(color) {
      if (!color) {
        return;
      }
      if (color.substr(0, 1) === '#') {
        return this.parseHex(color);
      }
      else if (color.substr(0, 1) === 'r') {
        return this.parseRgb(color);
      }
      return null;
    },

    /*
    `parseRgb` parses an rgb string into its component parts.
    Like these strings, for example:

    + "rgba(255, 0, 0, 0.5)"
    + "rgb(255, 0, 0)"
    */
    parseRgb: function(color) {
      if (!this.rgbRegex) {
        this.rgbRegex = /rgba?\((\d+),\s?(\d+),\s?(\d+)(,\s?(0?[.\d]+))?\)/;
      }

      var match = this.rgbRegex.exec(color);
      if (!match || match.length < 1) {
        return null;
      }
      else {
        var digits = {
          red: parseInt(match[1], 10),
          green: parseInt(match[2], 10),
          blue: parseInt(match[3], 10)
        };
        if (match[5]) {
          digits.alpha = parseFloat(match[5]);
        }
        return digits;
      }
    },

    // `rgbToHex` turns an rgb string into its equivalent
    // hex string. Any alpha channel data will be discarded.
    rgbToHex: function(rgb) {
      if (rgb.substr(0, 1) === '#') {
        return rgb;
      }

      var digits = this.parseRgb(rgb);
      return this.makeHex(digits);
    },

    /*
    `parseHex` parses a hex string into its component parts.
    Like these strings, for example:

    + "#FF0022"
    + "#aa80ff"
    */
    parseHex: function(hex) {
      if (!this.hexRegex) {
        this.hexRegex = /\#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/;
      }

      var match = this.hexRegex.exec(hex);
      if (!match || match.length < 1) {
        return null;
      }
      else {
        return {
          red: parseInt(match[1], 16),
          green: parseInt(match[2], 16),
          blue: parseInt(match[3], 16)
        };
      }
    },

    // `hexToRgb` turns a hex string into its equivalent
    // rgb string.
    hexToRgb: function(hex) {
      if (hex.substr(0, 1) !== '#') {
        return hex;
      }

      var digits = this.parseHex(hex);
      return this.makeRgb(digits);
    },

    // `addTransparency` takes a color string (either hex or rgb)
    // and turns it into an rgba string with the given opacity.
    addTransparency: function(color, opacity) {
      var digits = this.parse(color);
      digits.alpha = opacity;
      return this.makeRgb(digits);
    },
    // `removeTransparency` takes an rgba string and returns
    // an rgb string with the opacity stripped.
    removeTransparency: function(color) {
      var digits = this.parseRgb(color);
      delete digits.alpha;
      return this.makeRgb(digits);
    },

    // `makeRgb` is a helper function to take a digits object
    // and turn it into an rgb or rgba string.
    makeRgb: function(digits) {
      var rgb = 'rgb';
      if (digits.alpha) {
        rgb += 'a';
      }
      rgb += '(' + digits.red + ', ' + digits.green + ', ' + digits.blue;
      if (digits.alpha) {
        rgb += ', ' + digits.alpha;
      }
      rgb += ')';
      return rgb;
    },

    // `makeHex` is a helper function to take a digits object
    // and turn it into a hex string.
    makeHex: function(digits) {
      /*jslint bitwise: true */
      var hex = digits.blue | (digits.green << 8) | (digits.red << 16);
      return '#' + hex.toString(16);
    }
  };
});
