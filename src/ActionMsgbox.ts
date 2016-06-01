/// <reference path="jquery-scrollTo.d.ts" />
import "jquery";
import Action from "./Action";
import ActionPlugin from "./ActionPlugin";

export default class ActionMsgbox extends ActionPlugin {

  // class name
  cls: string;

  // contains class name
  ccls: string;

  container: JQuery;

  init(action: Action) {
    var actionId:string = action.actionName.replace(/::/g, '-');
    var self = this;
    this.action = action;
    this.form = action.form().get(0);
    this.cls = 'action-' + actionId + '-result';
    this.ccls = 'action-result';
    if (this.config.container) {
      this.container = jQuery(this.config.container);
    } else {
      this.container = this.form.find('.' + this.cls);
      if (!this.container.get(0)) {
        this.container = jQuery('<div/>').addClass(this.cls).addClass(this.ccls);
        this.form.prepend(this.container);
      }
    }
    if (typeof this.config.clear !== "undefined") {
      if (this.config.clear) {
        this.container.empty().hide();
      }
    } else {
      this.container.empty().hide();
    }
    $(this.action).on('action.result', function(ev, resp) {
      var $box, $close, $desc, $icon, $text, d, i, len, msg, ref, results;
      $box = $('<div/>').addClass('message');
      $text = $('<div/>').addClass('text');
      $desc = $('<div/>').addClass('desc');
      $icon = $('<i/>').css({
        float: 'left'
      }).addClass('icon fa');
      $close = $('<span/>').css({
        position: 'absolute',
        top: 6,
        right: 6
      }).addClass('fa fa-times-circle').click(function() {
        return $box.fadeOut('slow', function() {
          return $box.remove();
        });
      });
      $box.append($icon).append($text);
      if (resp.desc) {
        $box.append($desc);
      }
      $box.append($close);
      if (resp.success) {
        $box.addClass('success');
        $icon.addClass('fa-check-circle');
        $text.text(resp.message);
        self.container.html($box).fadeIn('fast');
      } else if (resp.error) {
        self.container.empty();
        $box.addClass('error');
        $icon.addClass('fa-warning');
        $text.text(resp.message);
        self.container.html($box).fadeIn('fast');
      }
      if (resp.validations) {
        ref = self.extErrorMsgs(resp);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          msg = ref[i];
          d = $('<div/>').addClass('error-message').html(msg);
          results.push($desc.append(d));
        }
        return results;
      }
    });
    $(action).on('action.before_submit', () => {
      this.wait();
    });
  }

  wait() : void {
    var $box, $close, $desc, $icon, $text, scrollOffset;
    $box = $('<div/>').addClass('message');
    $text = $('<div/>').addClass('text');
    $desc = $('<div/>').addClass('desc');
    $icon = $('<i/>').css({
      float: 'left'
    }).addClass('icon icon-spinner icon-spin');
    $close = $('<span/>').css({
      position: 'absolute',
      top: 6,
      right: 6
    }).addClass('fa fa-times-circle').click(function() {
      $box.fadeOut('slow', function() {
        $box.remove();
      });
    });
    $box.append($icon).append($text).append($desc).append($close);
    $box.addClass('waiting');
    $text.text("Progressing");
    this.container.html($box).fadeIn('fast');
    if (!this.config.disableScroll && typeof(jQuery.scrollTo) !== "undefined" && window.pageYOffset > 20) {
      scrollOffset = this.config.scrollOffset || -20;
      jQuery.scrollTo($box.get(0), 200, {
        offset: scrollOffset
      });
    }
    if (this.config.fadeOut) {
      setTimeout(() => {
        this.container.fadeOut('fast', () => { this.container.empty(); });
      }, 1200);
    }
  }

  extErrorMsgs(resp) {
    var field, ref, results, v;
    ref = resp.validations;
    results = [];
    for (field in ref) {
      v = ref[field];
      if (!v.valid || v.error) {
        results.push(v.message);
      } else {
        results.push(void 0);
      }
    }
    return results;
  }
}
