/*
vim:fdm=marker:sw=2:ts=2:sts=2:et:

Action.js: Javascript for submitting forms and validations.
Depends on: region.js, jQuery.scrollTo.js
Author: Yo-An Lin <cornelius.howl@gmail.com>
Date: 2/16 17:04:44 2011 

USAGE
-----

  Action.form('#action-form').setup({ 
    clear: true,
    onSuccess:
    onError: 
    onResult:
  })
*/
declare var Region;
declare var Cookies;
declare var tinyMCE;

import "jquery";
import ActionPlugin from "./ActionPlugin";
import FormUtils from "./FormUtils";
import AIM from "./AIM";
import assign = require("object-assign");

interface ActionSettings {

  plugins?: Array<ActionPlugin>;

  confirm?: string;

  disableInput?: boolean;

  onSubmit? ():any;

  beforeSubmit? ():any;

  beforeUpload? ():any;
}

export default class Action {

  actionName: string;

  plugins: Array<Object>;

  formEl: any;

  options: ActionSettings;

  actionPath: string;

  /**
   * Contains the the action plugin factories
   */
  static _globalPlugins = [];

  static ajaxOptions: JQueryAjaxSettings = {
    "dataType": "json",
    "type": "post",
    "timeout": 8000
  };

  constructor(arg1 = null, arg2 = null) {
    this.plugins = [];
    this.actionPath = null;
    this.options = { "disableInput": true };

    var form, opts = {};
    if (arg1 instanceof jQuery) {
      form = arg1;
    } else if (arg1 instanceof HTMLFormElement) {
      form = arg1;
    } else if (typeof arg1 === "string") {
      form = arg1;
    } else if (arg1 && arg2) {
      form = arg1;
    } else if (!arg2 && typeof arg1 === "object") {
      opts = arg1;
    }
    if (form) {
      this.setForm(form);
      if (arg2) {
        opts = arg2;
      }
    }
    this.options = assign({}, opts); // copy
    if (this.options.plugins) {
      this.options.plugins.forEach((p) => {
        this.plug(p);
      });
    }
    Action._globalPlugins.forEach((p,i) => {
      var plugin = new plugin(this, p.options);
      this.plug(plugin);
    });
  }

  /**
   * @param {HTMLFormElement|jQuery} f
   */
  setForm(f) {
    this.formEl = jQuery(f);
    this.formEl.attr('method', 'post');
    this.formEl.attr("enctype", "multipart/form-data");
    this.formEl.data("actionObject", this);
    this.actionName = this.formEl.find('input[name=__action]').val();
    if (!this.formEl.get(0)) {
      throw "action form element not found";
    }
    if (!this.actionName) {
      throw "action signature is undefined.";
    }
    if (!this.formEl.find('input[name="__ajax_request"]').get(0)) {
      this.formEl.append(jQuery('<input>').attr({
        type: "hidden",
        name: "__ajax_request",
        value: 1
      }));
    }
    return this.formEl.submit(() => {
      var e, ret;
      try {
        ret = this.submit();
        if (ret) {
          return ret;
        }
      } catch (_error) {
        e = _error;
        if (window.console) {
          console.error("Form submit error", e.message, e);
        }
      }
      return false;
    });
  }

  form(f = null) {
    if (f) {
      this.setForm(f);
    }
    return this.formEl;
  }

  /**
   * add plugin
   */
  plug(plugin:any, config = null) {
    if (plugin instanceof ActionPlugin) {
      plugin.init(this);
      this.plugins.push(plugin);
    } else if (typeof plugin === "function") {
      var instance = new plugin(config);
      instance.init(this);
      this.plugins.push(instance);
    }
  }

  /**
   * set action path
   */
  setPath(path:string) {
    return this.actionPath = path;
  }

  /**
   * get the current data from the form
   */
  getFormData() {
    var data, isIndexed, that;
    that = this;
    data = {};
    isIndexed = (n) => n.indexOf('[]') > 0;

    var f = this.form();
    if (typeof f === "undefined") {
      throw "form is undefined";
    }
    if (typeof tinyMCE !== 'undefined' && typeof tinyMCE.EditorManager !== 'undefined') {
      tinyMCE.EditorManager.triggerSave();
    }


    FormUtils.findFields(f).each(function(i, n) {
      var el, name, val;
      el = jQuery(n);
      name = el.attr('name');
      if (!name) {
        return;
      }
      val = el.val();
      if (val instanceof Array) {
        data[name] = val;
        return;
      }
      if (isIndexed(name)) {
        data[name] || (data[name] = []);
      }
      if (el.attr('type') === "checkbox" || el.attr('type') === "radio") {
        if (el.is(':checked')) {
          if (isIndexed(name)) {
            data[name].push(val);
          } else {
            data[name] = val;
          }
        } else if (!data[name]) {
          data[name] = null;
        }
      } else {
        if (isIndexed(name)) {
          data[name].push(val);
        } else {
          data[name] = val;
        }
      }
    });
    return data;
  }

  setup(options) {
    this.options = jQuery.extend(this.options, options);
    return this;
  }

  _processElementOptions(options) {
    var el;
    if (options.removeTr) {
      el = jQuery(jQuery(options.removeTr).parents('tr').get(0));
      el.fadeOut('fast', function() {
        return jQuery(this).remove();
      });
    }
    if (options.remove) {
      return jQuery(options.remove).remove();
    }
  }

  _processFormOptions(options, resp) {
    if (options.clear) {
      FormUtils.findTextFields(this.form()).each(function(i, e) {
        var n;
        n = jQuery(this).attr('name');
        if (n === "action" || n === "__action" || n === "__csrf_token" || n === "__ajax_request") {
          return;
        }
        return jQuery(this).val("");
      });
    }
    if (resp.success && options.fadeOut) {
      return this.form().fadeOut('slow');
    }
  }

  _processLocationOptions(options, resp) {
    if (options.reload) {
      return setTimeout((function() {
        window.location.reload();
      }), options.delay || 0);
    } else if (options.redirect) {
      return setTimeout((function() {
        window.location.href = options.redirect;
      }), options.delay || 0);
    } else if (resp.redirect) {
      return setTimeout((function() {
        window.location.href = resp.redirect;
      }), resp.delay * 1000 || options.delay || 0);
    }
  }

  _processRegionOptions(options, resp) {
    var form, reg;
    if (typeof Region === "undefined") {
      console.warn("Region is undefined. region-js is not loaded.");
      return;
    }
    form = this.form();
    if (form) {
      reg = Region.of(form);

      // update region to the related option keys
      var regionKeys:Array<string> = ['refreshSelf', 'refresh', 'refreshParent', 'refreshWithId', 'removeRegion', 'emptyRegion'];
      regionKeys.forEach((key:string) => {
        if (typeof options[key] !== "undefined") {
          options[key] = reg;
        }
      });
    }
    if (options.refreshSelf) {
      Region.of(options.refreshSelf).refresh();
    }
    if (options.refresh) {
      Region.of(options.refresh).refresh();
    }
    if (options.refreshParent) {
      Region.of(options.refreshParent).parent().refresh();
    }
    if (options.refreshWithId) {
      Region.of(options.refreshWithId).refreshWith({
        id: resp.data.id
      });
    }
    if (options.removeRegion) {
      Region.of(options.removeRegion).remove();
    }
    if (options.emptyRegion) {
      return Region.of(options.emptyRegion).fadeEmpty();
    }
  }

  _createSuccessHandler(formEl, deferred, options, cb, retrycb:Function = null) {
    var $self, self;
    self = this;
    $self = jQuery(self);
    return function(resp) {
      var debugDiv, ret;
      $self.trigger('action.result', [resp]);
      if (formEl && options.disableInput) {
        FormUtils.enableInputs(formEl);
      }
      if (cb) {
        ret = cb.call(self, resp);
        if (ret) {
          return ret;
        }
      }
      if (resp.success) {
        if (options.onSuccess) {
          options.onSuccess.apply(self, [resp]);
        }
        self._processFormOptions(options, resp);
        self._processRegionOptions(options, resp);
        self._processElementOptions(options, resp);
        self._processLocationOptions(options, resp);
        deferred.resolve(resp);
      } else if (resp.error) {
        deferred.reject(resp);
        if (resp.csrf_token_mismatch || resp.csrf_token_expired || resp.csrf_token_invalid) {
          console.error("csrf token mismatched", resp);
        }
        if (options.onError) {
          options.onError.apply(self, [resp]);
        }
        if (window.console) {
          console.error("Returned error", resp.message, resp);
          if (resp.trace) {
            debugDiv = document.createElement('div');
            debugDiv.innerHTML = resp.trace;
            console.debug(debugDiv.textContent);
          }
        } else {
          alert(resp.message);
        }
      } else {
        throw "Unknown error:" + resp;
      }
      return true;
    };
  }

  _createErrorHandler(formEl, deferred, options) {
    return function(error, t, m) {
      if (error.responseText) {
        if (window.console) {
          console.error(error.responseText);
        } else {
          alert(error.responseText);
        }
      } else {
        console.error(error);
      }
      if (formEl && options.disableInput) {
        return FormUtils.enableInputs(formEl);
      }
    }
  }


  /* 
  
  run method
  
  .run() or runAction()
    run specific action
  
  .run( 'Delete' , { table: 'products' , id: id } , function() { ... });
  
  
  .run( [action name] , [arguments] , [options] or [callback] );
  .run( [action name] , [arguments] , [options] , [callback] );
  
  
  Event callbacks:
  
      * onSubmit:    [callback]
              callback before sending request
  
      * onSuccess:   [callback]
              success callback.
  
  options:
      * confirm:    [text]    
              should confirm 
  
      * removeRegion: [element] 
              the element in the region. to remove region.
  
      * emptyRegion:  [element] 
              the element in the region. to empty region.
  
  
      * removeTr:   [element] 
              the element in the tr.
  
      * remove:   [element] 
              the element to be removed.
  
      * clear:    [bool]
              clear text fields
  
      * fadeOut:    [hide]
              hide the form if success
    */

  run(actionName:string, args, arg1 = null, arg2 = null) : JQueryDeferred<any> {
    var cb, payload;
    if (typeof arg1 === "function") {
      cb = arg1;
    } else if (typeof arg1 === "object") {
      this.options = assign(this.options, arg1);
      if (typeof arg2 === "function") {
        cb = arg2;
      }
    }

    var deferred = jQuery.Deferred();

    if (this.options.confirm) {
      if (!confirm(this.options.confirm)) {
        // FIXME: pass unconfirm message
        deferred.reject();
        return deferred;
      }
    }


      /**
       * @param {object} payload
       * @return {jQuery.Deferred}
       */
    var doSubmit = (payload): JQueryDeferred<any> => {
      var errorHandler, formEl, postUrl, successHandler;
      if (this.options.onSubmit) {
        this.options.onSubmit();
      }
      formEl = this.form();
      if (formEl) {
        if (this.options.disableInput) {
          FormUtils.disableInputs(formEl);
        }
      }
      if (formEl && formEl.attr('action')) {
        postUrl = formEl.attr('action');
      } else if (this.actionPath) {
        postUrl = this.actionPath;
      } else if (Action.ajaxOptions.url) {
        postUrl = Action.ajaxOptions.url;
      } else {
        postUrl = window.location.pathname;
      }
      errorHandler = this._createErrorHandler(formEl, deferred, this.options);
      successHandler = this._createSuccessHandler(formEl, deferred, this.options, cb);
      jQuery.ajax(jQuery.extend(Action.ajaxOptions, {
        "url": postUrl,
        "data": payload,
        "error": errorHandler,
        "success": successHandler
      }));
      return deferred;
    }
    payload = {
      "__action": actionName,
      "__ajax_request": 1
    };
    payload = jQuery.extend(payload, args);
    if (!payload.__csrf_token) {
      if (typeof Cookies !== "undefined") {
        payload.__csrf_token = Cookies.get('csrf');
      }
    }
    return doSubmit(payload);
  }


  /**
   * submit the action
   *
   * submit(option , callback )
   * submit(callback )
   *
   */
  submit(arg1 = null, arg2 = null):boolean {
    var $form, cb, data, ret, that;
    that = this;
    if (typeof arg1 === "object") {
      this.options = jQuery.extend(this.options, arg1);
      if (arg2 && typeof arg2 === "function") {
        cb = arg2;
      }
    } else if (typeof arg1 === "function") {
      cb = arg1;
    }

    $form = this.form();
    data = this.getFormData();
    if (this.options.beforeSubmit) {
      ret = this.options.beforeSubmit.call($form, data);
      if (ret === false) {
        return false;
      }
    }
    jQuery(this).trigger('action.before_submit', [data]);
    if ($form.find("input[type=file]").get(0) && $form.find('input[type=file]').parents('form').get(0) === $form.get(0)) {
      this.submitWithAIM(data, cb);
      return false;
    }
    this.run(data.action, data);
    return false;
  }

  submitWithAIM(data, cb) : JQueryDeferred<any> {
    var deferred = jQuery.Deferred();
    var $form, actionName, errorHandler, successHandler, that;
    $form = this.form();
    successHandler = this._createSuccessHandler($form, deferred, this.options, cb);
    errorHandler = this._createErrorHandler($form, deferred, this.options);
    if (this.options.beforeUpload) {
      this.options.beforeUpload.call(this, $form, data);
    }
    if (!$form || !$form.get(0)) {
      throw "form element not found.";
    }
    if (typeof AIM === "undefined") {
      alert("AIM is required for uploading file in ajax mode.");
    }
    actionName = $form.find('input[name="__action"]').val();
    if (!actionName) {
      throw "action name field is required";
    }
    that = this;
    AIM.submit($form.get(0), {
      onStart: function() {
        if (that.options.beforeUpload) {
          that.options.beforeUpload.call(that, $form);
        }
        return true;
      },
      onComplete: function(responseText) {
        var e, json;
        try {
          json = JSON.parse(responseText);
          successHandler(json, that.options.onUpload);
          if (that.options.afterUpload) {
            that.options.afterUpload.call(that, $form, json);
          }
        } catch (_error) {
          e = _error;
          errorHandler(e);
        }
        return true;
      }
    });
    return deferred;
  }

  /**
   * Submit the current form with extended form data.
   */
  submitWith(extendData, arg1 = null, arg2 = null) {
    var cb, data, options;
    options = {};
    if (typeof arg1 === "object") {
      options = arg1;
      if (typeof arg2 === "function") {
        cb = arg2;
      }
    } else if (typeof arg1 === "function") {
      cb = arg1;
    }
    data = jQuery.extend(this.getFormData(), extendData);
    return this.run(data.action, data, options, cb);
  }



  /**
   * Construct an Action from form elements
   */
  static form(formsel, opts = {}) : Action {
    return new Action(formsel, opts);
  }

  /**
   * plugin must be a constructor function.
   */
  static plug(plugin, opts = {}) {
    return Action._globalPlugins.push({
      plugin: plugin,
      options: opts
    });
  }
}











