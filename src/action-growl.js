// Generated by CoffeeScript 1.9.3
(function() {
  var ActionGrowler,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ActionGrowler = (function(superClass) {
    extend(ActionGrowler, superClass);

    function ActionGrowler() {
      return ActionGrowler.__super__.constructor.apply(this, arguments);
    }

    ActionGrowler.prototype.init = function(action) {
      ActionGrowler.__super__.init.call(this, action);
      return $(action).bind('action.on_result', (function(_this) {
        return function(ev, resp) {
          if (resp.success) {
            _this.growl(resp.message, _this.config.success);
          } else {
            _this.growl(resp.message, $.extend(_this.config.error, {
              theme: 'error'
            }));
          }
          return true;
        };
      })(this));
    };

    ActionGrowler.prototype.growl = function(text, opts) {
      return $.jGrowl(text, opts);
    };

    return ActionGrowler;

  })(ActionPlugin);

  window.ActionGrowler = ActionGrowler;

}).call(this);