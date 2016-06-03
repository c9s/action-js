
import "jquery";
import ActionPlugin from "./ActionPlugin";

export interface ActionSettings {

  /**
   * An optional gateway path for sending actions
   */
  url?: string;

  plugins?: Array<ActionPlugin>;

  confirm?: string;

  disableInput?: boolean;



  removeRegion?: HTMLElement|JQuery;

  emptyRegion?: HTMLElement|JQuery;

  removeTr?: HTMLElement|JQuery;

  remove?: HTMLElement|JQuery;

  clear?: boolean;

  fadeOut?: boolean;



  onSubmit?: () => void;

  onSuccess?: (resp:any) => void;

  beforeSubmit?: (data:any) => boolean;

  beforeUpload?: (form:any, data:any) => void;

  onUpload?: (json:any) => void;

  afterUpload?: (form:any, json:any) => void;
}

