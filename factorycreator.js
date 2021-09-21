function createFactory (execlib, mylib) {
  'use strict';

  var lib = execlib.lib;

  function functionalityFromDescriptor (desc) {
    if (!desc) {
      throw new lib.Error('NO_DESCRIPTOR', 'No descriptor given');
    }
    if (!lib.isString(desc.type)) {
      throw new lib.Error('NO_DESCRIPTOR_TYPE', 'Descriptor must have a type');
    }
    if (!lib.isString(desc.name)) {
      throw new lib.Error('NO_DESCRIPTOR_NAME', 'Descriptor must have a name');
    }
    switch (desc.type) {
      case 'service':
        return new mylib.ServiceFunctionality(desc);
      case 'find':
        return new mylib.FindSinkFunctionality(desc);
      case 'multi':
        return new mylib.MultiFunctionality(desc);
      default:
        throw new lib.Error('UNSUPPORTED_DESCRIPTOR_TYPE', desc.type);
    }
  }

  function fromDescriptorToMap (map, desc) {
    var functionality = functionalityFromDescriptor(desc);
    map.add(functionality.name, functionality);
  }

  function functionalititesFromDescriptor (descs) {
    var ret, _ret;
    if (!lib.isArray(descs)) {
      return;
    }
    ret = new lib.Map();
    _ret = ret;
    try {
      descs.forEach(fromDescriptorToMap.bind(null, _ret));
    }
    catch (e) {
      lib.containerDestroyAll(ret);
      ret.destroy();
      ret = null;
      throw e;
    }
    _ret = null;
    return ret;
  }

  mylib.Factory = functionalititesFromDescriptor;
}
module.exports = createFactory;