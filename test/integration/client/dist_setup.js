
require(['dist_config'], function(config) {
  'use strict';

  requirejs.config(config);

  require([window.entrypoint], function() {});
});
