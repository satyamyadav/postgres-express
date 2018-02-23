'use strict';

module.exports = function(orm) {
  require('./users')(orm);
  require('./posts')(orm);
};
