import "jquery";
var FormUtils = {
    findFields: function(form) {
      return jQuery(form).find('select, textarea, input[type=text], input[type=number], input[type=checkbox], input[type=radio], input[type=password], input[type=date], input[type=datetime], input[type=time], input[type=email], input[type=hidden]');
    },
    findVisibleFields: function(form) {
      return jQuery(form).find('select, textarea, input[type=text], input[type=date], input[type=number], input[type=datetime], input[type=time], input[type=checkbox], input[type=radio], input[type=email], input[type=password]');
    },
    findTextFields: function(form) {
      return jQuery(form).find('input[type="text"], input[type="file"], input[type="time"], input[type="number"], input[type="datetime"], input[type="date"], input[type="password"], input[type="email"], textarea');
    },
    enableInputs: function(form) {
      return this.findVisibleFields(form).removeAttr('disabled');
    },
    disableInputs: function(form) {
      return this.findVisibleFields(form).attr('disabled', 'disabled');
    }
};
export default FormUtils;
