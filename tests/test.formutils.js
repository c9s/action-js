describe('FormUtils', function() {

  describe('#findVisibleFields', function() {
    it('returns 4 visible fields', function() {
      var frm = document.getElementById('formSimple');
      expect(frm).not.to.be(undefined);
      var fields = FormUtils.findVisibleFields(frm);
      expect(fields).to.be.an('object');
      var inputs = fields.map(function() { return this; });
      expect(fields.length).to.be(3);
    });
  });

  describe('#findFields', function() {
    it('returns 4 fields', function() {
      var frm = document.getElementById('formSimple');
      expect(frm).not.to.be(undefined);
      var fields = FormUtils.findFields(frm);
      expect(fields).to.be.an('object');
      var inputs = fields.map(function() { return this; });
      expect(fields.length).to.be(4);
    });
  });

  describe('#findTextFields', function() {
    it('returns 4 fields', function() {
      var frm = document.getElementById('formSimple');
      expect(frm).not.to.be(undefined);
      var fields = FormUtils.findTextFields(frm);
      expect(fields).to.be.an('object');
      var inputs = fields.map(function() { return this; });
      expect(fields.length).to.be(3);
    });
  });

  describe('#enableFields/#disableFields', function() {
    it('enable then disable', function() {
      var frm = document.getElementById('formSimple');
      FormUtils.disableInputs(frm);
      FormUtils.enableInputs(frm);
    });
  });
});
