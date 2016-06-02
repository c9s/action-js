/*
  a = new ActionPlugin(action,{ ...options...  })
  a = new ActionPlugin(action)
  a = new ActionPlugin({ ... })
  */
import Action from "./Action";

export default class ActionPlugin {

  form: any;

  action: Action;

  config: any = {};

  constructor(a1 = null, a2 = null) {
    if (a1 && a2) {
      this.config = a2 || {};
      this.init(a1);
    } else if (a1 instanceof Action) {
      this.init(a1);
    } else if (typeof a1 === 'object') {
      this.config = a1;
    }
  }

  init(action: Action) {
    this.action = action;
    return this.form = this.action.form();
  }
}
