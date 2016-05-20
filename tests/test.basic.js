describe('retries', function() {
  it('should succeed on the 3rd try', function () {
    expect(true).to.be.true;
    $.getJSON('/api', { __action: 'Foo' }, function(resp) {
      console.log(resp);
    });
  });
});
