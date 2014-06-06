if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([
  'thehelp-test', 'winston', 'thehelp-core'
], function(
  test, winston, core
) {

  'use strict';

  describe('string', function() {
    var string = core.string;

    describe('#splice', function() {
      it('gives spliced string', function() {
        string.splice('target', 1, 'a').should.equal('taarget');
        string.splice('tt', 1, 'arge').should.equal('target');
      });

      it('splices at 0 index', function() {
        string.splice('arget', 0, 't').should.equal('target');
      });

      it('splices at end of string', function() {
        string.splice('targe', 5, 't').should.equal('target');
      });

      it('throws if index is less than 0', function() {
        (function() {
          string.splice('targe', -1, 't');
        }).should['throw'](Error);
      });

      it('throws if index is greater than target string', function() {
        (function() {
          string.splice('targe', 10, 't');
        }).should['throw'](Error);
      });
    });

    describe('#capitalize', function() {
      it('capitalizes a one-word string', function() {
        string.capitalize('target').should.equal('Target');
      });
    });

    describe('#truncate', function() {
      it('handles strings right at the limit', function() {
        string.truncate(5, 'abcde').should.equal('abcde');
      });

      it('handles strings smaller than the limit', function() {
        string.truncate(5, 'abcd').should.equal('abcd');
      });

      it('strings over the limit', function() {
        string.truncate(5, 'abcdefgh').should.equal('ab...');
      });

      it('strings just a little over the limit', function() {
        string.truncate(5, 'abcdef').should.equal('ab...');
      });
    });

    describe('#pluralize', function() {
      it('handles singular', function() {
        string.pluralize(1, 'widget', 'widgets').should.equal('1 widget');
      });

      it('handles plural', function() {
        string.pluralize(2, 'widget', 'widgets').should.equal('2 widgets');
      });

      it('handles 0', function() {
        string.pluralize(0, 'widget', 'widgets').should.equal('0 widgets');
      });

      it('handles negative numbers', function() {
        string.pluralize(-1, 'widget', 'widgets').should.equal('-1 widgets');
      });
    });

    describe('#normalizePhoneNumber', function() {
      it('handles a number without a country code', function() {
        var actual = string.normalizePhoneNumber('2069470550');

        actual.should.equal('+12069470550');
      });

      it('handles a number without a plus', function() {
        var actual = string.normalizePhoneNumber('12069470550');

        actual.should.equal('+12069470550');
      });

      it('handles fully-annotated number', function() {
        var actual = string.normalizePhoneNumber('+1 (206) 947-0550');

        actual.should.equal('+12069470550');
      });
    });

    describe('#formatPhoneNumber', function() {
      it('handles a number without a country code', function() {
        var actual = string.formatPhoneNumber('+12069470550');

        actual.should.equal('+1 (206) 947-0550');
      });

      it('returns something that doesn\'t look normalized', function() {
        var actual = string.formatPhoneNumber('12069470550');

        actual.should.equal('12069470550');
      });
    });

    describe('#repeat', function() {
      it('repeats a string five times', function() {
        var actual = string.repeat('5', 5);

        actual.should.equal('55555');
      });

      it('returns empty string for zero', function() {
        var actual = string.repeat('5', 0);

        actual.should.equal('');
      });
    });

  });
});
