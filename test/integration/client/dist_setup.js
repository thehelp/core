
require(['dist_config'], function(config) {
  'use strict';

  config.paths.jquery = 'bower_components/jquery/dist/jquery';

  requirejs.config(config);

  require(['jquery', window.entrypoint], function() {});
});
