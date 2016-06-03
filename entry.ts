import FormUtils from "./src/FormUtils";
import Action from "./src/Action";
import ActionPlugin from "./src/ActionPlugin";
import ActionCsrfToken from "./src/ActionCsrfToken";
import ActionDevLoader from "./src/ActionDevLoader";
import ActionMsgbox from "./src/ActionMsgbox";
import ActionGrowler from "./src/ActionGrowl";
import ActionBootstrapHighlight from "./src/ActionBootstrapHighlight";
import BootstrapFormHighlight from "./src/BootstrapFormHighlight";
import AIM from "./src/AIM";

window['AIM'] = AIM;
window['ActionMsgbox'] = ActionMsgbox;
window['FormUtils'] = FormUtils;
window['BootstrapFormHighlight'] = BootstrapFormHighlight;
window['ActionPlugin'] = ActionPlugin;
window['ActionBootstrapHighlight'] = ActionBootstrapHighlight;
window['ActionGrowler'] = ActionGrowler;
window['ActionCsrfToken'] = ActionCsrfToken;
window['Action'] = Action;

(<any>window).submitActionWith = function(f, extendData, arg1 = null, arg2 = null) {
  var a = Action.form(f);
  return a.submitWith(extendData, arg1, arg2);
};

(<any>window).submitAction = function(f, arg1 = null, arg2 = null) {
  var a = Action.form(f);
  a.submit(arg1, arg2);
};

(<any>window).runAction = function(actionName:string, args, arg1 = null, arg2 = null) : JQueryDeferred<any> {
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
