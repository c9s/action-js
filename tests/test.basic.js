console.clear();
describe('retries', function() {
  it('should succeed on the 3rd try', function () {

    Action.ajaxOptions.url = "/api";
    runAction('TestApp::Action::Simple', {}, function(resp) {
      expect(resp.success).to.be.true;
    });
    /*
    $.getJSON('/api', { __action: 'Foo' }, function(resp) {
      console.log(resp);
    });
    */
  });
});
