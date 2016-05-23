/// <reference path="jGrowl.d.ts" />

import Action from "./Action";
import ActionPlugin from "./ActionPlugin";

export default class ActionGrowler extends ActionPlugin {

  init(action: Action) {
    $(action).on('action.result', 
      (ev, resp) => {
        if (resp.success) {
          this.growl(resp.message, this.config.success);
        } else {
          this.growl(resp.message, $.extend(this.config.error, {
            theme: 'error'
          }));
        }
      });
  }

  growl(text:string, opts) {
    jQuery.jGrowl(text, opts);
  }
}
