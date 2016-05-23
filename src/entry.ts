import FormUtils from "./FormUtils";
import Action from "./Action";
import ActionPlugin from "./ActionPlugin";
import ActionCsrfToken from "./ActionCsrfToken";
import ActionDevLoader from "./ActionDevLoader";
import ActionMsgbox from "./ActionMsgbox";
import ActionGrowler from "./ActionGrowl";
import ActionBootstrapHighlight from "./ActionBootstrapHighlight";


(<any>window).FormUtils = FormUtils;
(<any>window).ActionPlugin = ActionPlugin;
(<any>window).Action = Action;

(<any>window).submitActionWith = function(f, extendData, arg1 = null, arg2 = null) {
  var a = Action.form(f);
  return a.submitWith(extendData, arg1, arg2);
};

(<any>window).submitAction = function(f, arg1 = null, arg2 = null) {
  var a = Action.form(f);
  a.submit(arg1, arg2);
};

(<any>window).runAction = function(actionName:string, args, arg1, arg2) {
  var a = new Action;
  var funcargs:Array<any> = [actionName];
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
