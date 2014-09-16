if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'thehelp-test', 'thehelp-core'
], function(
  test, core
) {

  'use strict';

  var expect = test.expect;

  describe('string', function() {
    var string = core.string;

    describe('#splice', function() {
      it('gives spliced string', function() {
        expect(string.splice('target', 1, 'a')).to.equal('taarget');
        expect(string.splice('tt', 1, 'arge')).to.equal('target');
      });

      it('splices at 0 index', function() {
        expect(string.splice('arget', 0, 't')).to.equal('target');
      });

      it('splices at end of string', function() {
        expect(string.splice('targe', 5, 't')).to.equal('target');
      });

      it('throws if index is less than 0', function() {
        expect(function() {
          string.splice('targe', -1, 't');
        }).to['throw'](Error);
      });

      it('throws if index is greater than target string', function() {
        expect(function() {
          string.splice('targe', 10, 't');
        }).to['throw'](Error);
      });
    });

    describe('#capitalize', function() {
      it('capitalizes a one-word string', function() {
        expect(string.capitalize('target')).to.equal('Target');
      });
    });

    describe('#truncate', function() {
      it('handles strings right at the limit', function() {
        expect(string.truncate(5, 'abcde')).to.equal('abcde');
      });

      it('handles strings smaller than the limit', function() {
        expect(string.truncate(5, 'abcd')).to.equal('abcd');
      });

      it('strings over the limit', function() {
        expect(string.truncate(5, 'abcdefgh')).to.equal('ab...');
      });

      it('strings just a little over the limit', function() {
        expect(string.truncate(5, 'abcdef')).to.equal('ab...');
      });
    });

    describe('#pluralize', function() {
      it('handles singular', function() {
        expect(string.pluralize(1, 'widget', 'widgets')).to.equal('1 widget');
      });

      it('handles plural', function() {
        expect(string.pluralize(2, 'widget', 'widgets')).to.equal('2 widgets');
      });

      it('handles 0', function() {
        expect(string.pluralize(0, 'widget', 'widgets')).to.equal('0 widgets');
      });

      it('handles negative numbers', function() {
        expect(string.pluralize(-1, 'widget', 'widgets')).to.equal('-1 widgets');
      });
    });

    describe('#normalizePhoneNumber', function() {
      it('handles a number without a country code', function() {
        var actual = string.normalizePhoneNumber('2069470550');

        expect(actual).to.equal('+12069470550');
      });

      it('handles a number without a plus', function() {
        var actual = string.normalizePhoneNumber('12069470550');

        expect(actual).to.equal('+12069470550');
      });

      it('handles fully-annotated number', function() {
        var actual = string.normalizePhoneNumber('+1 (206) 947-0550');

        expect(actual).to.equal('+12069470550');
      });
    });

    describe('#formatPhoneNumber', function() {
      it('handles a number without a country code', function() {
        var actual = string.formatPhoneNumber('+12069470550');

        expect(actual).to.equal('+1 (206) 947-0550');
      });

      it('returns something that doesn\'t look normalized', function() {
        var actual = string.formatPhoneNumber('12069470550');

        expect(actual).to.equal('12069470550');
      });
    });

    describe('#repeat', function() {
      it('repeats a string five times', function() {
        var actual = string.repeat('5', 5);

        expect(actual).to.equal('55555');
      });

      it('returns empty string for zero', function() {
        var actual = string.repeat('5', 0);

        expect(actual).to.equal('');
      });
    });

  });
});
