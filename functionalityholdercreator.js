function createFunctionalityHolder (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    FunctionalityHolderMixin = mylib.FunctionalityHolderMixin;

  function FunctionalityHolder (prophash) {
    FunctionalityHolderMixin.call(this, prophash);
  }
  FunctionalityHolderMixin.addMethods(FunctionalityHolder);
  FunctionalityHolder.prototype.destroy = function () {
    FunctionalityHolderMixin.prototype.destroy.call(this);
  }

  mylib.FunctionalityHolder = FunctionalityHolder;
}
module.exports = createFunctionalityHolder;