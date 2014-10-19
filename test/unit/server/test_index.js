
'use strict';

var test = require('thehelp-test');
var expect = test.expect;
var winston;

try {
  winston = require('winston');
}
catch (e) {}

var index = require('../../../src/server/index');

describe('index', function() {
  it('should have breadcrumbs property', function() {
    expect(index).to.have.property('breadcrumbs').that.exist;
  });

  it('should have breadcrumbs.add property', function() {
    expect(index).to.have.deep.property('breadcrumbs.add').that.is.a('function');
  });

  it('should have env property', function() {
    expect(index).to.have.property('env').that.exist;
  });

  it('should have env.merge property', function() {
    expect(index).to.have.deep.property('env.merge').that.is.a('function');
  });

  it('should have logs property', function() {
    expect(index).to.have.property('logs').that.exist;
  });

  it('isNode should be true', function() {
    expect(index).to.have.property('isNode', true);
  });

  it('isClient should be false', function() {
    expect(index).to.have.property('isClient', false);
  });
});
