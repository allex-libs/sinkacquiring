function createSingleFunctionality (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    qlib = lib.qlib,
    FunctionalityBase = mylib.FunctionalityBase;
  
  function SingleFunctionality (prophash) {
    FunctionalityBase.call(this, prophash);
    this.acquirer = null;
    this.sinks = [null];
  }
  lib.inherit(SingleFunctionality, FunctionalityBase);
  SingleFunctionality.prototype.destroy = function () {
    if (this.acquirer) {
      this.acquirer.destroy();
    }
    this.acquirer = null;
    FunctionalityBase.prototype.destroy.call(this);
  }
  SingleFunctionality.prototype.doTheActivation = function () {
    qlib.thenAny(
      this.createAndActivateAcquirer(this.onSink.bind(this)),
      this._onAcquirer.bind(this),
      this._onAcquirerFailed.bind(this)
    );
  };

  SingleFunctionality.prototype._onAcquirer = function (acq) {
    if (!this.activationDefer) {
      return;
    }
    this.acquirer = acq;
    this.activationDefer.resolve(this.acquirer);
  };
  SingleFunctionality.prototype._onAcquirerFailed = function (reason) {
    this.activationDefer.reject(reason);
  };

  SingleFunctionality.prototype.createAndActivateAcquirer = function () {
    throw new lib.Error('NOT_IMPLEMENTED', 'createAndActivateAcquirer has to be implemented by '+this.constructor.name);
  };

  mylib.SingleFunctionality = SingleFunctionality;
}
module.exports = createSingleFunctionality;