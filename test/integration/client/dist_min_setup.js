
require(['dist_config'], function(config) {
  'use strict';

  config.paths['thehelp-core'] = 'dist/thehelp-core-tz-min';

  requirejs.config(config);

  require([window.entrypoint], function() {});
});
