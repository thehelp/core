
require(['dist_config'], function(config) {
  'use strict';

  config.paths.jquery = 'lib/vendor/jquery';

  requirejs.config(config);

  require(['jquery', window.entrypoint], function() {});
});
