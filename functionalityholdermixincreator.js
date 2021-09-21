function createFunctionalityHolderMixin (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    JobOnDestroyableBase = qlib.JobOnDestroyableBase;

  function FHJob (fholder, defer) {
    JobOnDestroyableBase.call(this, fholder, defer);
  }
  lib.inherit(FHJob, JobOnDestroyableBase);
  FHJob.prototype._destroyableOk = function () {
    if (!this.destroyable) {
      throw new lib.Error('NO_FUNCTIONALITY_HOLDER', 'No Functionality Holder');
    }
    if (!this.destroyable.jobs) {
      throw new lib.Error('FUNCTIONALITY_HOLDER_DESTROYED', 'Functionality Holder already destroyed');
    }
    return true;
  };
  FHJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    this.useFunctionalityHolder();
    return ok.val;
  };

  function FunctionalityHolderInvokerJob (fholder, functionalityname, context, sinkuser, defer) {
    FHJob.call(this, fholder, defer);
    this.functionalityname = functionalityname;
    this.context = context;
    this.sinkuser = sinkuser;
  }
  lib.inherit(FunctionalityHolderInvokerJob, FHJob);
  FunctionalityHolderInvokerJob.prototype.destroy = function () {
    this.sinkuser = null;
    this.context = null;
    this.functionalityname = null;
    FHJob.prototype.destroy.call(this);
  };
  FunctionalityHolderInvokerJob.prototype.useFunctionalityHolder = function () {
    qlib.promise2defer(
      this.destroyable.invokeFuncOnFunctionality(this.functionalityname, this.context, this.sinkuser),
      this
    );
  };

  function FunctionalityHolderMixin (prophash) {
    this.mutexfunctionalities = !prophash.coexistingfunctionalities;
    this.functionalities = mylib.Factory(prophash.functionalities);
    this.jobs = new qlib.JobCollection();
  }
  FunctionalityHolderMixin.prototype.destroy = function () {
    if (this.jobs) {
      this.jobs.destroy();
    }
    this.jobs = null;
    if (this.functionalities) {
      lib.containerDestroyAll(this.functionalities);
      this.functionalities.destroy();
    }
    this.functionalities = null;
  };
  FunctionalityHolderMixin.prototype.invokeFuncOnFunctionality = function (functionalityname, context, sinkuser) {
    var functionality = this.findFunctionalityByName(functionalityname); //this.functionalities.get(functionalityname);
    if (!functionality) {
      return q.reject(new lib.Error('FUNCTIONALITY_NOT_FOUND', functionalityname));
    }
    return functionality.invoke(context, sinkuser);
  };
  FunctionalityHolderMixin.prototype.queueInvokeFuncOnFunctionality = function (functionalityname, context, sinkuser) {
    if (!this.jobs) {
      return q.reject(new lib.Error('ALREADY_DESTROYED', 'This instance of '+this.constructor.name+' is already destroyed'));
    }
    return this.jobs.run('.', new FunctionalityHolderInvokerJob(this, functionalityname, context, sinkuser));
  };
  FunctionalityHolderMixin.prototype.findFunctionalityByName = function (functionalityname) {
    if (!(lib.isString(functionalityname) && functionalityname.length>0)) {
      return null;
    }
    if (functionalityname.indexOf('.')<0) {
      return this.functionalities.get(functionalityname);
    }
    return functionalityname.split('.').reduce(functionalityFinder, this);
  };

  function functionalityFinder (result, functionalityname) {
    if (!result) {
      return result;
    }
    if (!result.findFunctionalityByName) {
      return null;
    }
    return result.findFunctionalityByName(functionalityname);
  }

  FunctionalityHolderMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, FunctionalityHolderMixin
      ,'invokeFuncOnFunctionality'
      ,'queueInvokeFuncOnFunctionality'
      ,'findFunctionalityByName'
    );
  };

  mylib.FunctionalityHolderMixin = FunctionalityHolderMixin;
}
module.exports = createFunctionalityHolderMixin;