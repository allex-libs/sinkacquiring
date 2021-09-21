function createSinkAcquirerViaTaskBase (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    execSuite = execlib.execSuite,
    SinkAcquirerBase = mylib.SinkAcquirerBase;

  function SinkAcquirerViaTaskBase () {
    SinkAcquirerBase.call(this);
    this.task = null;
  }
  SinkAcquirerBase.prototype.destroy = function () {
    if (this.task) {
      this.task.destroy();
    }
    this.task = null;
    SinkAcquirerBase.prototype.destroy.call(this);
  }
  SinkAcquirerViaTaskBase.prototype.go = function () {
    this.task = taskRegistry.run(this.taskName, this.createTaskConfig());
    this.onTaskCreated();
  };

  SinkAcquirerViaTaskBase.prototype.onTaskCreated = function () {};

  SinkAcquirerViaTaskBase.prototype.createTaskConfig = function () {
    throw lib.Error('NOT_IMPLEMENTED', 'createTaskConfig has to be implemented in '+this.constructor.name);
  };

  mylib.SinkAcquirerViaTaskBase = SinkAcquirerViaTaskBase;
}
module.exports = createSinkAcquirerViaTaskBase;