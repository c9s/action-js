
describe('Action with Interaction', function() {
  Action.ajaxOptions.url = "/api";

  describe('Action.run with AIM', function() {

    it('should submit aim form', function(done) {
      var a = Action.form('#formAIM', { 
        'actionPath': '/api/aim',
        'onUpload': function(response) {
          console.log('onUpload', response);
          done();
        }
      });
      a.form().submit();
    });
  });

  describe('runAction TestApp::Action::Simple', function() {
    it('should return success response in the callback', function (done) {
      runAction('TestApp::Action::Simple', { "a": 1 }, function(resp) {
        expect(resp.success).to.be.true;
        done();
      });
    });
    it('should return success response in the 2nd callback parameter', function (done) {
      runAction('TestApp::Action::Simple', function(resp) {
        expect(resp.success).to.be.true;
        done();
      });
    });
    it('should return a deferred object', function (done) {
      var deferred = runAction('TestApp::Action::Simple', {}, function(resp) {
      });
      deferred.done(function(resp) {
        expect(resp.success).to.be.true;
        done();
      });
      expect(deferred).to.be.an('object');
    });

    it('should return a data object', function(done) {
      runAction('TestApp::Action::Simple', function(resp) {
        expect(resp.data.foo).to.be.equal(3);
        done();
      });
    });
  });
});
