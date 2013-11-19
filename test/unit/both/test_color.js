if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-test', 'winston', 'util', 'lodash',
  'thehelp-core'
],
  function(test, winston, util, _,
    core
  ) {
  'use strict';

  describe('color', function() {

    var color = core.color;

    describe('#parse', function() {
      it('handles an rgb color', function() {
        var expected = {
          red: 3,
          green: 6,
          blue: 9
        };
        var actual = color.parse('rgb(3, 6, 9)');
        actual.should.deep.equal(expected);
      });

      it('handles a hex color', function() {
        var expected = {
          red: 255,
          green: 128,
          blue: 0
        };
        var actual = color.parse('#FF8000');
        actual.should.deep.equal(expected);
      });
    });

    describe('#parseRgb', function() {
      it('handles an rgb color', function() {
        var expected = {
          red: 3,
          green: 6,
          blue: 9
        };
        var actual = color.parseRgb('rgb(3, 6, 9)');
        actual.should.deep.equal(expected);
      });

      it('handles an rgba color', function() {
        var expected = {
          red: 3,
          green: 6,
          blue: 9,
          alpha: 0.4
        };
        var actual = color.parseRgb('rgba(3, 6, 9, 0.4)');
        actual.should.deep.equal(expected);
      });

      it('returns null if given null', function() {
        var actual = color.parseRgb(null);
        (actual === null).should.equal(true);
      });

      it('returns null if no match', function() {
        var actual = color.parseRgb('rgb');
        (actual === null).should.equal(true);
      });
    });

    describe('#rgbToHex', function() {
      it('returns original color if it is hex', function() {
        var hex = '#ffffff';
        var actual = color.rgbToHex(hex);
        actual.should.deep.equal(hex);
      });

      it('properly converts', function() {
        var rgb = 'rgb(255, 128, 0)';
        var expected = '#ff8000';
        var actual = color.rgbToHex(rgb);
        actual.should.deep.equal(expected);
      });
    });

    describe('#parseHex', function() {
      it('properly converts a lower-case color', function() {
        var hex = '#ff8000';
        var expected = {
          red: 255,
          green: 128,
          blue: 0
        };
        var actual = color.parseHex(hex);
        actual.should.deep.equal(expected);
      });

      it('properly converts a color', function() {
        var hex = '#FFFFFF';
        var expected = {
          red: 255,
          green: 255,
          blue: 255
        };
        var actual = color.parseHex(hex);
        actual.should.deep.equal(expected);
      });

      it('returns null if given null', function() {
        var actual = color.parseHex(null);
        (actual === null).should.equal(true);
      });

      it('returns null if no match', function() {
        var actual = color.parseHex('rgb');
        (actual === null).should.equal(true);
      });
    });

    describe('#hexToRgb', function() {
      it('returns original color if it is rgb', function() {
        var rgb = 'rgb(255, 128, 0)';
        var actual = color.hexToRgb(rgb);
        actual.should.deep.equal(rgb);
      });

      it('properly converts', function() {
        var hex = '#ff8000';
        var expected = 'rgb(255, 128, 0)';
        var actual = color.hexToRgb(hex);
        actual.should.deep.equal(expected);
      });
    });

    describe('#addTransparency', function() {
      it('adds transparency (to rgb)', function() {
        var rgb = 'rgb(255, 128, 0)';
        var expected = 'rgba(255, 128, 0, 0.25)';
        var actual = color.addTransparency(rgb, 0.25);
        actual.should.equal(expected);
      });

      it('adds transparency (to hex)', function() {
        var hex = '#FF8000';
        var expected = 'rgba(255, 128, 0, 0.25)';
        var actual = color.addTransparency(hex, 0.25);
        actual.should.equal(expected);
      });
    });

    describe('#removeTransparency', function() {
      it('removes transparency', function() {
        var rgb = 'rgba(255, 128, 0, 0.25)';
        var expected = 'rgb(255, 128, 0)';
        var actual = color.removeTransparency(rgb);
        actual.should.equal(expected);
      });
    });

  });
});
