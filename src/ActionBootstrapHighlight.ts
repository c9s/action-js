import Action from "./Action";
import ActionPlugin from "./ActionPlugin";
import BootstrapFormHighlight from "./BootstrapFormHighlight";

export default class ActionBootstrapHighlight extends ActionPlugin {
  protected highligher:BootstrapFormHighlight;
  init(action: Action) {
    this.action = action;
    this.form = action.form().get(0);
    this.highligher = new BootstrapFormHighlight(this.form);
    jQuery(this.action).on('action.result', (ev:JQueryEventObject, resp:any) => {
      this.highligher.cleanup();
      this.highligher.fromValidations(resp.validations);
    });
  }
}
