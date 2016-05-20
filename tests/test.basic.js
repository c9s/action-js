console.clear();
describe('Simple Action', function() {
  it('should return success response', function () {
    Action.ajaxOptions.url = "/api";
    runAction('TestApp::Action::Simple', {}, function(resp) {
      expect(resp.success).to.be.true;
    });
  });
});
