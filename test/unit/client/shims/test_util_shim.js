if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-test', 'winston', 'util'], function(test, winston, util) {

  'use strict';

  var sinon = test.sinon;

  describe('util_shim', function() {

    describe('#inspect', function() {
      it('prints out the innards of a object', function() {
        /*jshint -W053 */
        var date = new Date();
        var dateString = date.toISOString();
        var regexString = '^hello$';

        var target = {
          rawString: 'value1',
          stringObj: new String('value2'),
          regex: new RegExp(regexString),
          date: date
        };
        var expected = '{\n' +
        '  rawString: "value1"\n' +
        '  , stringObj: "value2"\n' +
        '  , regex: /' + regexString + '/\n' +
        '  , date: "' + dateString + '"\n' +
        '}';
        var actual = util.inspect(target);
        actual.should.equal(expected);
      });

      it('prints out a property on prototype', function() {
        var Obj = function Something() {};
        Obj.prototype.a = 'value for a';
        var obj = new Obj();
        obj.b = 'value for b';

        var expected = '{\n' +
        '  b: "value for b"\n' +
        '  , a: "value for a"\n' +
        '}';

        var actual = util.inspect(obj);
        actual.should.equal(expected);
      });

      it('prints out the innards of an Error', function() {
        var error = new Error('this is the error message');
        var expected = '[error: this is the error message]';
        var actual = util.inspect(error);
        actual.should.equal(expected);
      });

      it('handles a circular object', function() {
        var obj = {
          left: 'yes',
          right: {
            left: 'yes'
          }
        };
        obj.right.right = obj;

        var expected = '{\n' +
        '  left: "yes"\n' +
        '  , right: {\n' +
        '    left: "yes"\n' +
        '    , right: <>\n' +
        '  }\n' +
        '}';
        var actual = util.inspect(obj);
        actual = actual.replace(/<.*>/, '<>');
        actual.should.equal(expected);
      });

      it('prints out a tree of properties', function() {
        var obj = {
          left: 'yes',
          right: {
            left: 'yes',
            right: 'no'
          }
        };
        var expected = '{\n' +
        '  left: "yes"\n' +
        '  , right: {\n' +
        '    left: "yes"\n' +
        '    , right: "no"\n' +
        '  }\n' +
        '}';
        var actual = util.inspect(obj);
        actual.should.equal(expected);
      });
    });

    describe('#inherits', function() {
      it('attaches String methods to target prototype', function() {
        function Target() {}
        Target.prototype.target = sinon.stub();

        function Source() {}
        Source.prototype.source = sinon.stub();

        util.inherits(Target, Source);

        var target = new Target();
        target.source();

        Source.prototype.source.callCount.should.equal(1, 'source should be called');
      });
    });

  });
});
