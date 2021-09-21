function createSinkAcquirersLib (execlib) {
  'use strict';

  var mylib = {};

  require('./sinkacquirerbase')(execlib, mylib);
  require('./sinkacquirerviataskbase')(execlib, mylib);

  return mylib;
}
module.exports = createSinkAcquirersLib;