console.clear();
describe('Action', function() {
  Action.ajaxOptions.url = "/api";

  describe('runAction Simple', function() {
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
  });
});
