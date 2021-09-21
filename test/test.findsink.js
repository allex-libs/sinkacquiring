describe('test Service', function () {
  it('load my Lib', function () {
    return setGlobal('mylib', require('..')(execlib));
  });
  it('Create a Functionality Holder', function () {
    return setGlobal('Holder', new mylib.FunctionalityHolder(
      {
        functionalities: [{
          type: 'find',
          name: 'CloudService',
          config: {
            sinkname: 'Service1'
          }
        }]
      }
    ));
  });
  it('Activate it', function () {
    var promise = Holder.invokeFuncOnFunctionality('CloudService', console, function (sink) {
      this.log(sink);
      return true;
    });
    return expect(promise).to.eventually.be.rejected;
  });
});