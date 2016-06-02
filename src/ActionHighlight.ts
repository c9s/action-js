
export default class ActionHighlight extends ActionPlugin {
  init(action:Action) {
    var that = this;
    this.action = action;
    var form = action.form();

    FormUtils.findVisibleFields(form).each(function() {
      var $field, m, name, w;
      $field = $(this);
      name = $(this).attr("name");
      if (name === "action") {
        return;
      }
      if (!name) {
        return;
      }
      name = name.replace(/\[\]/, '_');
      m = $(".field-" + name + "-message").hide();
      w = $(".field-" + name);
      if (!w.length) {
        $field.wrap("<div class=\"action-field field-" + name + "\"/>");
      }
      if (!m.length) {
        $field.after("<div class=\"action-field-message field-" + name + "-message\"/>");
      }
      $(".action-field-message").hide();
    });

    $(action).bind('action.on_result', function(ev, resp) {
      var msg, n, results, v, w;
      that.clear();
      results = [];
      for (n in resp.validations) {
        v = resp.validations[n];
        w = that.form.find(".field-" + n);
        msg = that.form.find(".field-" + n + "-message");
        if (!v.valid) {
          w.addClass("invalid");
          results.push(msg.addClass("invalid").html(v.message).fadeIn("slow"));
        } else {
          w.addClass("valid");
          results.push(msg.addClass("valid").html(v.message).fadeIn("slow"));
        }
      }
      return results;
    });
  }

  clear() {
    var that = this;
    var form = this.form();
    FormUtils.findVisibleFields(form).each(function() {
      var el, n;
      el = $(this);
      n = el.attr("name");
      form.find(".field-" + n).removeClass("invalid valid");
      form.find(".field-" + n + "-message").removeClass("invalid valid").html("").hide();
    });
  }
}

