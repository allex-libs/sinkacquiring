function createFunctionalityBase (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function FunctionalityBase (prophash) {
    this.name = prophash.name;
    this.config = prophash.config;
    this.sinks = null;
    this.activationDefer = null;
    this.waiters = new lib.Fifo();
  }
  FunctionalityBase.prototype.destroy = function () {
    if (this.waiters) {
      this.waiters.drain(function (waiter) {
        waiter[1][1].reject(new lib.Error('FUNCTIONALITY_DESTROYED'));
      })
      this.waiters.destroy();
    }
    this.waiters = null;
    if (this.activationDefer) {
      this.activationDefer.reject(new lib.Error('DESTROYING', 'This instance of '+this.constructor.name+' is being destroyed'));
    }
    if (lib.isArray(this.sinks)){
      this.sinks.forEach(function (sink) {if (sink) { sink.destroy();}});
    }
    this.sinks = null;
    this.config = null;
    this.name = null;
  };
  FunctionalityBase.prototype.invoke = function (context, sinkuser) {    
    var d, nos, funcargs, args, ret;
    if (!lib.isArray(this.sinks)) {
      return;
    }
    nos = this.sinks.length;
    if (sinkuser.length<nos) {
      throw new lib.Error('PARAMETER_NUMBER_MISMATCH', 
        this.constructor.name+' handles '+nos+' parameters, and the given sinkuser takes '+sinkuser.length+' parameters'
      );
    }
    d = q.defer();
    args = [context, d];
    funcargs = [sinkuser, args];
    ret = d.promise;
    this.waiters.push(funcargs);
    this.activate().done(
      this.onActivated.bind(this),
      d.reject.bind(d)
    );
    return ret;
  };
  FunctionalityBase.prototype.onActivated = function () {
    if (this._sinksReady()) {
      this.waiters.drain(this._runFuncWithArgs.bind(this));
    }
  };

  FunctionalityBase.prototype.activate = function () {
    var ret;
    if (this.activationDefer) {
      return this.activationDefer.promise;
    }
    this.activationDefer = q.defer();
    ret = this.activationDefer.promise;
    this.doTheActivation();
    return ret;
  };
  FunctionalityBase.prototype.onSink = function (sinkindex, sink) {
    if (!this.waiters) {
      sink.destroy();
      return;
    }
    if (!lib.isArray(this.sinks)) {
      sink.destroy();
      return;
    }
    this.sinks[sinkindex] = sink;
    if (this._sinksReady()) {
      this.waiters.drain(this._runFuncWithArgs.bind(this));
    }
    sink = null;
  };

  FunctionalityBase.prototype.doTheActivation = function () {
    throw new lib.Error('NOT_IMPLEMENTED', 'doTheActivation has to be implemented by '+this.constructor.name);
  }

  
  FunctionalityBase.prototype._sinksReady = function () {
    if (!lib.isArray(this.sinks)) {
      return false;
    }
    return this.sinks.reduce(sinkOk, 0) == this.sinks.length;
  };
  FunctionalityBase.prototype._runFuncWithArgs = function (funcargs) {
    var args = [];
    Array.prototype.push.apply(args, this.sinks);
    args.push(funcargs[1][1]);
    try {
      console.log('run');
      funcargs[0].apply(funcargs[1][0], args);
    } catch(e){
      funcargs[1][1].reject(e);
    }
  }
  function sinkOk (result, sink) {
    if (!(sink && sink.destroyed)) {
      return result;
    }
    return result+1;
  }

  mylib.FunctionalityBase = FunctionalityBase;
}
module.exports = createFunctionalityBase;