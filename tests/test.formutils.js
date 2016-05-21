describe('FormUtils', function() {

  describe('#findVisibleFields', function() {
    it('returns 4 visible fields', function() {
      var frm = document.getElementById('formSimple');
      expect(frm).to.not.be(undefined);
      var fields = FormUtils.findVisibleFields(frm);
      expect(fields).to.be.an('object');
      var inputs = [];
      fields.each(function() {
        inputs.push(this);
      });
      expect(fields.length).to.be(3);
    });
  });

  describe('#findFields', function() {
    it('returns 4 fields', function() {
      var frm = document.getElementById('formSimple');
      expect(frm).to.not.be(undefined);
      var fields = FormUtils.findFields(frm);
      expect(fields).to.be.an('object');
      var inputs = [];
      fields.each(function() {
        inputs.push(this);
      });
      expect(fields.length).to.be(4);
    });
  });
});
