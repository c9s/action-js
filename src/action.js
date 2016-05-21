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
import ActionPlugin from "./action-plugin";
import FormUtils from "./formutils";


var Action = (function() {
  Action.ajaxOptions = {
    dataType: 'json',
    type: 'post',
    timeout: 8000
  };

  Action.prototype.plugins = [];

  Action.prototype.actionPath = null;

  Action.prototype.options = {
    disableInput: true
  };

  function Action(arg1, arg2) {
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
    var j, len, plugin, ref;
    this.options = $.extend({}, opts); // copy
    if (this.options.plugins) {
      ref = this.options.plugins;
      for (j = 0, len = ref.length; j < len; j++) {
        plugin = ref[j];
        this.plug(plugin);
      }
    }
    Action._globalPlugins.forEach((p,i) => {
      this.plug(p.plugin, p.options);
    });
  }

  /**
   * @param {HTMLFormElement|jQuery} f
   */
  Action.prototype.setForm = function(f) {
    this.formEl = $(f);
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
      this.formEl.append($('<input>').attr({
        type: "hidden",
        name: "__ajax_request",
        value: 1
      }));
    }
    return this.formEl.submit((function(_this) {
      return function() {
        var e, ret;
        try {
          ret = _this.submit();
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
      };
    })(this));
  };

  Action.prototype.form = function(f) {
    if (f) {
      this.setForm(f);
    }
    return this.formEl;
  };

  /**
   * add plugin
   */
  Action.prototype.plug = function(plugin, options) {
    var p;
    if (typeof plugin === 'function') {
      p = new plugin(this, options);
      this.plugins.push(p);
      return p;
    } else if (plugin instanceof ActionPlugin) {
      plugin.init(this);
      this.plugins.push(plugin);
      return plugin;
    }
  };

  /**
   * set action path
   */
  Action.prototype.setPath = function(path) {
    return this.actionPath = path;
  };

  /**
   * get the current data from the form
   */
  Action.prototype.getFormData = function() {
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
      el = $(n);
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
  };

  Action.prototype.setup = function(options) {
    this.options = $.extend(this.options, options);
    return this;
  };

  Action.prototype._processElementOptions = function(options) {
    var el;
    if (options.removeTr) {
      el = $($(options.removeTr).parents('tr').get(0));
      el.fadeOut('fast', function() {
        return $(this).remove();
      });
    }
    if (options.remove) {
      return $(options.remove).remove();
    }
  };

  Action.prototype._processFormOptions = function(options, resp) {
    if (options.clear) {
      FormUtils.findTextFields(this.form()).each(function(i, e) {
        var n;
        n = $(this).attr('name');
        if (n === "action" || n === "__action" || n === "__csrf_token" || n === "__ajax_request") {
          return;
        }
        return $(this).val("");
      });
    }
    if (resp.success && options.fadeOut) {
      return this.form().fadeOut('slow');
    }
  };

  Action.prototype._processLocationOptions = function(options, resp) {
    if (options.reload) {
      return setTimeout((function() {
        return window.location.reload();
      }), options.delay || 0);
    } else if (options.redirect) {
      return setTimeout((function() {
        return window.location = options.redirect;
      }), options.delay || 0);
    } else if (resp.redirect) {
      return setTimeout((function() {
        return window.location = resp.redirect;
      }), resp.delay * 1000 || options.delay || 0);
    }
  };

  Action.prototype._processRegionOptions = function(options, resp) {
    var form, reg, regionKeys;
    if (typeof Region === "undefined") {
      console.warn("Region is undefined. region-js is not loaded.");
      return;
    }
    form = this.form();
    if (form) {
      reg = Region.of(form);
      regionKeys = ['refreshSelf', 'refresh', 'refreshParent', 'refreshWithId', 'removeRegion', 'emptyRegion'];
      $(regionKeys).each(function(i, e) {
        if (options[e] === true) {
          return options[e] = reg;
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
  };

  Action.prototype._createSuccessHandler = function(formEl, deferred, options, cb, retrycb) {
    var $self, self;
    self = this;
    $self = $(self);
    return function(resp) {
      var debugDiv, ret;
      $self.trigger('action.on_result', [resp]);
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
  };

  Action.prototype._createErrorHandler = function(formEl, deferred, options) {
    return (function(_this) {
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
      };
    })(this);
  };


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

  Action.prototype.run = function(actionName, args, arg1, arg2) {
    var cb, payload;
    if (typeof arg1 === "function") {
      cb = arg1;
    } else if (typeof arg1 === "object") {
      this.options = $.extend(this.options, arg1);
      if (typeof arg2 === "function") {
        cb = arg2;
      }
    }
    if (this.options.confirm) {
      if (!confirm(this.options.confirm)) {
        return false;
      }
    }

    var deferred = jQuery.Deferred();

    var doSubmit = (function(_this) {
      /**
       * @param {object} payload
       * @return {jQuery.Deferred}
       */
      return function(payload) {
        var errorHandler, formEl, postUrl, successHandler;
        if (_this.options.onSubmit) {
          _this.options.onSubmit();
        }
        formEl = _this.form();
        if (formEl) {
          if (_this.options.disableInput) {
            FormUtils.disableInputs(formEl);
          }
        }
        if (formEl && formEl.attr('action')) {
          postUrl = formEl.attr('action');
        } else if (_this.actionPath) {
          postUrl = _this.actionPath;
        } else if (Action.ajaxOptions.url) {
          postUrl = Action.ajaxOptions.url;
        } else {
          postUrl = window.location.pathname;
        }
        errorHandler = _this._createErrorHandler(formEl, deferred, _this.options);
        successHandler = _this._createSuccessHandler(formEl, deferred, _this.options, cb);
        jQuery.ajax($.extend(Action.ajaxOptions, {
          "url": postUrl,
          "data": payload,
          "error": errorHandler,
          "success": successHandler
        }));
        return deferred;
      };
    })(this);
    payload = {
      "__action": actionName,
      "__ajax_request": 1
    };
    payload = $.extend(payload, args);
    if (!payload.__csrf_token) {
      if (typeof Cookies !== "undefined") {
        payload.__csrf_token = Cookies.get('csrf');
      }
    }
    return doSubmit(payload);
  };


  /*
    * submit:
    * submit( option , callback )
    * submit( callback )
    */

  Action.prototype.submit = function(arg1, arg2) {
    var $form, cb, data, ret, that;
    that = this;
    if (typeof arg1 === "object") {
      this.options = $.extend(this.options, arg1);
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
    $(this).trigger('action.before_submit', [data]);
    if ($form.find("input[type=file]").get(0) && $form.find('input[type=file]').parents('form').get(0) === $form.get(0)) {
      return this.submitWithAIM(data, cb);
    } else {
      return this.run(data.action, data);
    }
    return true;
  };

  Action.prototype.submitWithAIM = function(data, cb) {
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
          that.options.beforeUpload.call(that, $form, json);
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
  };


  /*
  (Action object).submitWith( args, ... )
    */

  Action.prototype.submitWith = function(extendData, arg1, arg2) {
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
    data = $.extend(this.getFormData(), extendData);
    return this.run(data.action, data, options, cb);
  };

  return Action;

})();

Action._globalPlugins = [];

Action.form = function(formsel, opts) {
  return new Action(formsel, opts || {});
};

Action.plug = function(plugin, opts) {
  return Action._globalPlugins.push({
    plugin: plugin,
    options: opts
  });
};

Action.reset = function() {
  return Action._globalPlugins = [];
};


export default Action;
