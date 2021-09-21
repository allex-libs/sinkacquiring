function createSinkAcquirerBase (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    execSuite = execlib.execSuite;

  function SinkAcquirerBase () {
    this.sink = null;
    this.sinkDestroyedListener = null;
  }
  SinkAcquirerBase.prototype.destroy = function () {
    this._resetSinkDestroyedListener();
    if (this.sink) {
      this.sink.destroy();
    }
    this.sink = null;
  };
  SinkAcquirerBase.prototype.setSink = function (sink) {
    this._resetSinkDestroyedListener();
    if (!(sink && sink.destroyed)) {
      sink = null;
    }
    this.sink = sink;
    if (sink && sink.destroyed) {
      this.sinkDestroyedListener = sink.destroyed.attach(this.onSinkDestroyed.bind(this));
    }
  }
  SinkAcquirerBase.prototype.onSinkDestroyed = function () {
    this.setSink(null);
  };

  SinkAcquirerBase.prototype._resetSinkDestroyedListener = function () {
    if (this.sinkDestroyedListener) {
      this.sinkDestroyedListener.destroy();
    }
    this.sinkDestroyedListener = null;
  };

  SinkAcquirerBase.prototype.go = function () {
    throw lib.Error('NOT_IMPLEMENTED', 'go has to be implemented in '+this.constructor.name);
  }

  mylib.SinkAcquirerBase = SinkAcquirerBase;
}
module.exports = createSinkAcquirerBase;