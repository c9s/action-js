describe('Action', function() {
  Action.ajaxOptions.url = "/api";

  describe('Creating action without form', function() {
    it('should be able to create without any parameter', function(done) {
      var a = new Action;
      done();
    });
  });

  describe('Creating action with form', function() {



    it('is able to create with a simple form', function() {
      var a = new Action(document.getElementById('formSimple'));
      expect(a.form()).to.be.an('object');
    });

    it('is able to set form on action', function() {
      var a = new Action();
      a.form(document.getElementById('formSimple'));
      expect(a.form()).to.be.an('object');
    });

    it('throws exception on form without action signature', function() {
      expect(function() {
        var a = new Action(document.getElementById('formWithoutSignature'));
      }).to.throwException();

      expect(function() {
        var a = new Action();
        a.form(document.getElementById('formWithoutSignature'));
      }).to.throwException();
    });

    describe('#getData', function() {
      it('returns isbn13', function() {
        var a = new Action(document.getElementById('formSimple'));
        expect(a.form()).to.be.an('object');
        var data = a.getFormData();
        expect(data).to.not.be.empty();
        expect(data.isbn13).to.be.equal('978-1491950296');
      });
    });

  });
});
