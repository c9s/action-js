console.clear();
describe('Action', function() {
  describe('Simple', function() {
    it('should return success response in the callback', function (done) {
      Action.ajaxOptions.url = "/api";
      runAction('TestApp::Action::Simple', { "a": 1 }, function(resp) {
        expect(resp.success).to.be.true;
        done();
      });
    });
    it('should return success response in the 2nd callback parameter', function (done) {
      Action.ajaxOptions.url = "/api";
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
