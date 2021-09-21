function createSinkAcquiringLib (execlib) {
  'use strict';

  var mylib = {};
  mylib.acquiringLib = require('./acquirers')(execlib);

  require('./functionalityholdermixincreator')(execlib, mylib);
  require('./functionalityholdercreator')(execlib, mylib);
  require('./functionalitybasecreator')(execlib, mylib);
  require('./singlefunctionalitycreator')(execlib, mylib);
  require('./servicefunctionalitycreator')(execlib, mylib);
  require('./findsinkfunctionalitycreator')(execlib, mylib);

  require('./multifunctionalitycreator')(execlib, mylib);

  require('./factorycreator')(execlib, mylib);

  return mylib;
}
module.exports = createSinkAcquiringLib;