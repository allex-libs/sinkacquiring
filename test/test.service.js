describe('test Service', function () {
  it('load my Lib', function () {
    return setGlobal('mylib', require('..')(execlib));
  });
  it('Create a Functionality Holder', function () {
    return setGlobal('Holder', new mylib.FunctionalityHolder({
      functionalities:[{
        type: 'service',
        name: 'MyService',
        config: {
          modulename: 'indata__ipm_pricecorrectionsfunctionalityservice',
          propertyhash: {

          }
        }
      }]
    }));
  });
  it('Activate it and expect an Error because a Service cannot be started in client mode', function () {
    var promise = Holder.invokeFuncOnFunctionality('MyService', console, function (sink) {
      this.log(sink);
      return true;
    });
    return expect(promise).to.eventually.be.rejected;
  });
});