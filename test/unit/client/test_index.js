if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['thehelp-test', 'thehelp-core'], function(test, index) {

  'use strict';

  var expect = test.expect;

  describe('index', function() {

    it('isNode is false', function() {
      expect(index).to.have.property('isNode', false);
    });

    it('isClient is true', function() {
      expect(index).to.have.property('isClient', true);
    });

  });
});
