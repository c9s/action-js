/*
  a = new ActionPlugin(action,{ ...options...  })
  a = new ActionPlugin(action)
  a = new ActionPlugin({ ... })
  */
import Action from "./action";
var ActionPlugin;
export default ActionPlugin;
ActionPlugin = (function() {
  ActionPlugin.prototype.formEl = null;

  ActionPlugin.prototype.action = null;

  ActionPlugin.prototype.config = {};

  function ActionPlugin(a1, a2) {
    if (a1 && a2) {
      this.config = a2 || {};
      this.init(a1);
    } else if (a1 instanceof Action) {
      this.init(a1);
    } else if (typeof a1 === 'object') {
      this.config = a1;
    }
  }

  ActionPlugin.prototype.init = function(action) {
    this.action = action;
    return this.form = this.action.form();
  };

  return ActionPlugin;

})();
