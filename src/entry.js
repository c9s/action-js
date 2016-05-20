import Action from "./action";
import ActionPlugin from "./action-plugin";
import ActionCsrfToken from "./action-csrf-token";
import ActionDevLoader from "./action-dev-loader";

window.ActionPlugin = ActionPlugin;
window.Action = Action;

window.submitActionWith = function(f, extendData, arg1, arg2) {
  return Action.form(f).submitWith(extendData, arg1, arg2);
};

window.submitAction = function(f, arg1, arg2) {
  return Action.form(f).submit(arg1, arg2);
};

window.runAction = function(actionName, args, arg1, arg2) {
  var a = new Action;
  var funcargs = [actionName];
  if (typeof args === "function") {
    funcargs.push({});
    funcargs.push(args); // the callback
  } else {
    funcargs.push(args);
  }
  if (arg1) {
    funcargs.push(arg1);
  }
  if (arg2) {
    funcargs.push(arg2);
  }
  return a.run.apply(a, funcargs);
};
