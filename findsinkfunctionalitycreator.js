function createFindSinkFunctionality (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry,
    SingleFunctionality = mylib.SingleFunctionality;

  function FindSinkFunctionality (prophash) {
    SingleFunctionality.call(this,prophash);
    if (!this.config.sinkname) {
      throw new lib.Error('NO_SINK_NAME', 'FindSink Functionality descriptor must have a sinkname');
    }
    this.sinkname = this.config.sinkname;
    this.identity = this.config.identity || {name: 'user', role: 'user'};
    this.taskPropertyHash = this.config.propertyhash;
    this.addressinfo = this.config.addressinfo;
  }
  lib.inherit(FindSinkFunctionality, SingleFunctionality);
  FindSinkFunctionality.prototype.destroy = function () {
    this.addressinfo = null;
    this.taskPropertyHash = null;
    this.identity = null;
    this.sinkname = null;
    SingleFunctionality.prototype.destroy.call(this);
  }
  FindSinkFunctionality.prototype.createAndActivateAcquirer = function () {
    return taskRegistry.run('findSink', {
      sinkname: this.sinkname,
      identity: this.identity,
      propertyhash: this.taskPropertyHash,
      addressinfo: this.addressinfo,
      onSink: this.onSink.bind(this, 0)
    });
  };

  mylib.FindSinkFunctionality = FindSinkFunctionality;
}
module.exports = createFindSinkFunctionality;