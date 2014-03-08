// Used for things that are `require()`'d on on the client side but never used.
// For example, [`ModelHelpers`](../../../both/model_helpers.html) loads
// `jugglingdb-postgres` on the client but actually uses a web-appropriate adapter.
define(function() {
  'use strict';

  return {};
});
