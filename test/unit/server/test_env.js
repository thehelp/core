
'use strict';

var test = require('thehelp-test');
var expect = test.expect;

var env = require('../../../src/server/env');

describe('env', function() {
  it('should not overwrite existing env', function() {
    process.env.HOST = 'something';
    env.merge();

    expect(process.env).to.have.deep.property('HOST', 'something');
    expect(process.env).to.have.property('NODE_ENV', 'development');
  });

  it('should load value', function() {
    delete process.env.HOST;
    env.merge();

    expect(process.env).to.have.property('HOST', 'anything');
    expect(process.env).to.have.property('NODE_ENV', 'development');
  });

  it('should throw exception if it can\'t find user-provided path', function() {
    expect(function() {
      env.merge('nonexistent.json');
    }).to['throw']().that.match(/nonexistent\.json/);
  });

  it('should load from custom path', function() {
    env.merge(__dirname + '/custom.json');

    expect(process.env).to.have.property('CUSTOM', 'value');
    expect(process.env).to.have.property('NODE_ENV', 'development');
  });

  it('supports a javascript file, loads only config for NODE_ENV', function() {
    env.merge(__dirname + '/env.js');

    expect(process.env).to.have.property('NODE_ENV', 'production');
    expect(process.env).to.have.property('one', '1');
    expect(process.env).to.have.property('two', 'two');
    expect(process.env).to.have.property('three', '/BLAH/');

    expect(process.env).not.to.have.property('development');
    expect(process.env).not.to.have.property('production');
    expect(process.env).not.to.have.property('four');
  });

  it('supports a javascript file, loads top-level config', function() {
    env.merge(__dirname + '/env_top.js');

    expect(process.env).to.have.property('NODE_ENV', 'development');
    expect(process.env).to.have.property('one', '1');
    expect(process.env).to.have.property('two', 'two');
    expect(process.env).to.have.property('four', 'four');
  });
});
