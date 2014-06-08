/*
# harness
This file can be used to very quickly set up a mocha-based browser testing
environment. Set `window.tests` to an array of your test files, and `window.mochaCss`
to the location of your test-specific style sheet (mocha provides a reasonable one).

You can set `window.coverage` to something truthy to turn on code coverage. _NOTE:
for now, if running under [PhantomJS](http://phantomjs.org/), we don't
load code coverage modules._

Lastly, this harness can work with `grunt-mocha`; you'll just need to set the path
for one additional component in requirejs.

These are the components used:

    paths: {
      'thehelp-test': '<your path>',
      'thehelp-test-coverage': '<required for code coverage>',
      'grunt-mocha-bridge': '<required if using with grunt-mocha'
    }
*/

/*
We first setup Mocha, then pull in code coverage-related components, then
pull in the tests. The order is indeed important. :0)
*/
define(['thehelp-test'], function(test) {
  'use strict';

  /*
  `loadTests` actually requires your test files, then installs `window.runTests()`,
  which adds the mocha div to your page and runs the tests.

  You can set `window.waitToRun` to something truthy to keep tests from running
  automatically.
  */
  var loadTests = function(mocha) {

    //We throw exceptions if you don't configure things properly.
    if (typeof window.tests === 'undefined') {
      throw new Error('Tests are specified via the window.tests array');
    }
    if (typeof window.mochaCss === 'undefined') {
      throw new Error(
        'You need to provide the path to the mocha css file with (window.mochaCss)'
      );
    }

    //Finally, we load all the tests, then set `window.runTests` to a function
    //that will add the necessary mocha components to the page and run all the tests.
    require(window.tests, function() {
      window.runTests = function() {
        /*global Event */

        //blanket has some strange assumptions in beforeStartTestRunner;
        //kicking that bit of code off manually here. And of course
        //the old-school javascript engine in Phantom doesn't handle
        //Event well.
        if (window.coverage && navigator.userAgent.indexOf('Phantom') < 0) {
          window.dispatchEvent(new Event('load'));
        }

        if (!document.getElementById('mocha')) {
          //Doing this without jquery to reduce dependencies... :0)
          var body = document.getElementsByTagName('body')[0];
          var div = document.createElement('div');
          div.setAttribute('id', 'mocha');
          body.appendChild(div);

          var head = document.getElementsByTagName('head')[0];
          var link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', window.mochaCss);
          head.appendChild(link);
        }
        mocha.run();
        return true;
      };

      if (window.PHANTOMJS) {
        require(['grunt-mocha-bridge'], function() {
          mocha.run();
        });
      }
      else if (!window.waitToRun) {
        window.runTests();
      }
    });
  };

  /*
  `setupMocha` prepares Mocha for tests to be loaded. It must be run before
  we run test-defining code. If we don't, `describe` and `it` will not yet be defined.

  If we're headless, we use [`mocha_reporter`](mocha_reporter.html) to save
  all test output to `window.results`, which can be played back to Mocha with
  [`MochaHeadless`](../server/headless_mocha.html) and shown on the command
  line.
  */
  var setupMocha = function(mocha, headlessReporter) {
    if (navigator.userAgent.indexOf('Phantom') >= 0) {
      mocha.setup({
        ui: 'bdd',
        reporter: headlessReporter
      });

      //Because PhantomJS doesn't support function.bind we polyfill it
      //https://groups.google.com/forum/#!msg/phantomjs/r0hPOmnCUpc/uxusqsl2LNoJ
      //https://github.com/ariya/phantomjs/issues/10522
      Function.prototype.bind = Function.prototype.bind || function(target) {
        var _this = this;
        return function() {
          return _this.apply(target, arguments);
        };
      };
    }
    else {
      mocha.setup('bdd');
    }
  };

  setupMocha(test.mocha, test.mochaReporter);

  if (window.coverage && navigator.userAgent.indexOf('Phantom') < 0) {
    require(['thehelp-test-coverage'], function() {
      loadTests(test.mocha);
    });
  }
  else {
    loadTests(test.mocha);
  }

});
