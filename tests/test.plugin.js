describe('Action Plugin', function() {
  Action.ajaxOptions.url = "/api";
  describe('Creating action with bootstrap highlighter', function() {
    it('plug bootstrap highlight plugin instance', function() {
      var a = new Action(document.getElementById('formSimple'));
      expect(a.form()).to.be.an('object');
      a.plug(new ActionBootstrapHighlight);
    });

    it('plug bootstrap highlight plugin with config', function() {
      var a = new Action(document.getElementById('formSimple'));
      expect(a.form()).to.be.an('object');
      a.plug(ActionBootstrapHighlight, { foo: 123 });
    });
  });
});
