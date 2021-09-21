function createServiceFunctionality (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    execSuite = execlib.execSuite,
    SingleFunctionality = mylib.SingleFunctionality;

  function ServiceFunctionality (prophash) {
    SingleFunctionality.call(this,prophash);
    if (!this.config.modulename) {
      throw new lib.Error('NO_MODULE_NAME', 'Service Functionality descriptor must have a modulename');
    }
  }
  lib.inherit(ServiceFunctionality, SingleFunctionality);
  ServiceFunctionality.prototype.createAndActivateAcquirer = function () {
    var ret = new ServiceSinkAcquirer(this.config);
    return ret.go();
  };

  function ServiceSinkAcquirer (config) {
    if (!config) {
      throw new lib.Error('NO_SERVICE_CONFIG', 'No service configuration');
    }
    if (!(lib.isString(config.modulename) && config.modulename.length)) {
      throw new lib.Error('NO_SERVICE_MODULENAME', 'Service config has to have a modulename');
    }
    this.modulename = config.modulename;
    this.propertyhash = config.propertyhash || {};
    this.roleremapping = config.roleremapping || {};
  }
  ServiceSinkAcquirer.prototype.destroy = function () {
    this.roleremapping = null;
    this.propertyhash = null;
    this.modulename = null;
  };
  ServiceSinkAcquirer.prototype.go = function () {
    return execSuite.start({
      /*
      service: {
        modulename: this.modulename,
        propertyhash: this.propertyhash,
        roleremapping: this.roleremapping
      }
      */
      service: this
    }).then(
      this.onStarted.bind(this),
      this.onStartFailed.bind(this)
    );
  };
  ServiceSinkAcquirer.prototype.onStarted = function (sink) {
    console.log('GOT THE SINK', sink);
    return this;
  };
  ServiceSinkAcquirer.prototype.onStartFailed = function (reason) {
    console.error(reason);
    throw reason;
  }

  mylib.ServiceFunctionality = ServiceFunctionality;
}
module.exports = createServiceFunctionality;