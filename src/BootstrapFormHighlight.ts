// different from ActionBootstrapHighlight, this class 
// takes form element as its constructor parameter.
export default class BootstrapFormHighlight {

  protected form: HTMLFormElement;

  constructor(form:HTMLFormElement) {
    this.form = form;
  }

  fromValidations(validations) {
    for (var field in validations) {
      var validation = validations[field];
      if (validation.valid == false) {
        this.addError(field, validation.message || validation.desc);
      } else {
        this.addSuccess(field, validation.message || validation.desc);
      }
    }
  }

  addError(field:string, message:string) {
    if (this.form[field]) {
      var $fieldInput = $(this.form[field]);
      var $formGroup = $($fieldInput.parents('.form-group').get(0));
      $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-remove form-control-feedback'));
      $fieldInput.after($('<span class="sr-only"/>').text('error'));
      if (message) {
        $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
      }
      $formGroup.addClass('has-error');
    }
  }

  addWarning(field:string, message:string) {
    if (this.form[field]) {
      var $fieldInput = $(this.form[field]);
      var $formGroup = $($fieldInput.parents('.form-group').get(0));
      $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-sign form-control-feedback'));
      $fieldInput.after($('<span class="sr-only"/>').text('warning'));
      if (message) {
        $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
      }
      $formGroup.addClass('has-warning');
    }
  }

  addSuccess(field:string, message:string) {
    if (this.form[field]) {
      var $fieldInput = $(this.form[field]);
      var $formGroup = $($fieldInput.parents('.form-group').get(0));
      $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-ok form-control-feedback'));
      $fieldInput.after($('<span class="sr-only"/>').text('success'));
      if (message) {
        $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
      }
      $formGroup.addClass('has-success');
    }
  }

  cleanup() {
    for (var field in this.form) {
      var el = this.form[field];
      if (el instanceof Node && el.nodeName == "INPUT") {
        var $formGroup = $($(el).parents('.form-group').get(0));
        $formGroup.removeClass('has-error has-success has-warning');
        $formGroup.find('.glyphicon').remove();
        $formGroup.find('.sr-only').remove();
        $formGroup.find('.help-block-validation').remove();
      }
    }
  }

  getFirstInvalidField() {
    return jQuery(this.form).find('.has-error, .has-warning').get(0);
  }
}
