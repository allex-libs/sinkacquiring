function createMultiFunctionality (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    qlib = lib.qlib,
    FunctionalityBase = mylib.FunctionalityBase,
    FunctionalityHolderMixin = mylib.FunctionalityHolderMixin;

  function MultiFunctionality (prophash) {
    FunctionalityBase.call(this, prophash);
    FunctionalityHolderMixin.call(this, this.config);
  }
  lib.inherit(MultiFunctionality, FunctionalityBase);
  FunctionalityHolderMixin.addMethods(MultiFunctionality);
  MultiFunctionality.prototype.destroy = function () {
    FunctionalityHolderMixin.prototype.destroy.call(this);
    FunctionalityBase.prototype.destroy.call(this);
  };

  mylib.MultiFunctionality = MultiFunctionality;
}
module.exports = createMultiFunctionality;