import "jquery";
import Action from "./Action";
import ActionPlugin from "./ActionPlugin";

export default class ActionBootstrapHighlight extends ActionPlugin {

  init(action: Action) {
    this.action = action;
    this.form = action.form().get(0);
    jQuery(this.action).on('action.result', (ev:JQueryEventObject, resp:any) => {
      this.cleanup();
      this.fromValidations(resp.validations);
    });
  }

  fromValidations(validations) {
    var field;
    for (field in validations) {
      var validation = validations[field];
      if (validation.valid === false) {
        this.addError(field, validation.message || validation.desc);
      } else {
        this.addSuccess(field, validation.message || validation.desc);
      }
    }
  }

  addError(field:string, message) {
    var $fieldInput, $formGroup;
    if (this.form[field]) {
      $fieldInput = $(this.form[field]);
      $formGroup = $($fieldInput.parents('.form-group').get(0));
      $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-remove form-control-feedback'));
      $fieldInput.after($('<span class="sr-only"/>').text('error'));
      if (message) {
        $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
      }
      $formGroup.addClass('has-error');
    }
  }

  addWarning(field:string, message) {
    var $fieldInput, $formGroup;
    if (this.form[field]) {
      $fieldInput = $(this.form[field]);
      $formGroup = $($fieldInput.parents('.form-group').get(0));
      $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-sign form-control-feedback'));
      $fieldInput.after($('<span class="sr-only"/>').text('warning'));
      if (message) {
        $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
      }
      $formGroup.addClass('has-warning');
    }
  }

  addSuccess(field:string, message) {
    var $fieldInput, $formGroup;
    if (this.form[field]) {
      $fieldInput = $(this.form[field]);
      $formGroup = $($fieldInput.parents('.form-group').get(0));
      $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-ok form-control-feedback'));
      $fieldInput.after($('<span class="sr-only"/>').text('success'));
      if (message) {
        $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
      }
      $formGroup.addClass('has-success');
    }
  }

  cleanup() {
    var $formGroup, el, field;
    for (field in this.form) {
      el = this.form[field];
      if (el instanceof Node && el.nodeName === 'INPUT') {
        $formGroup = $($(el).parents('.form-group').get(0));
        $formGroup.removeClass('has-error has-success has-warning');
        $formGroup.find('.glyphicon').remove();
        $formGroup.find('.sr-only').remove();
        $formGroup.find('.help-block-validation').remove();
      }
    }
  }

  getFirstInvalidField() {
    return $(this.form).find('.has-error, .has-warning').get(0);
  }
}
