/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var FormUtils_1 = __webpack_require__(2);
	var Action_1 = __webpack_require__(4);
	var ActionPlugin_1 = __webpack_require__(5);
	var ActionCsrfToken_1 = __webpack_require__(8);
	var ActionMsgbox_1 = __webpack_require__(9);
	var ActionGrowl_1 = __webpack_require__(10);
	var ActionBootstrapHighlight_1 = __webpack_require__(11);
	var BootstrapFormHighlight_1 = __webpack_require__(12);
	var AIM_1 = __webpack_require__(6);
	window['AIM'] = AIM_1["default"];
	window['ActionMsgbox'] = ActionMsgbox_1["default"];
	window['FormUtils'] = FormUtils_1["default"];
	window['BootstrapFormHighlight'] = BootstrapFormHighlight_1["default"];
	window['ActionPlugin'] = ActionPlugin_1["default"];
	window['ActionBootstrapHighlight'] = ActionBootstrapHighlight_1["default"];
	window['ActionGrowler'] = ActionGrowl_1["default"];
	window['ActionCsrfToken'] = ActionCsrfToken_1["default"];
	window['Action'] = Action_1["default"];
	window.submitActionWith = function (f, extendData, arg1, arg2) {
	    if (arg1 === void 0) { arg1 = null; }
	    if (arg2 === void 0) { arg2 = null; }
	    var a = Action_1["default"].form(f);
	    return a.submitWith(extendData, arg1, arg2);
	};
	window.submitAction = function (f, arg1, arg2) {
	    if (arg1 === void 0) { arg1 = null; }
	    if (arg2 === void 0) { arg2 = null; }
	    var a = Action_1["default"].form(f);
	    a.submit(arg1, arg2);
	};
	window.runAction = function (actionName, args, arg1, arg2) {
	    if (arg1 === void 0) { arg1 = null; }
	    if (arg2 === void 0) { arg2 = null; }
	    var a = new Action_1["default"];
	    var funcargs = [actionName];
	    if (typeof args === "function") {
	        funcargs.push({});
	        funcargs.push(args); // the callback
	    }
	    else {
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(3);
	var FormUtils = {
	    findFields: function (form) {
	        return jQuery(form).find('select, textarea, input[type=text], input[type=number], input[type=checkbox], input[type=radio], input[type=password], input[type=date], input[type=datetime], input[type=time], input[type=email], input[type=hidden]');
	    },
	    findVisibleFields: function (form) {
	        return jQuery(form).find('select, textarea, input[type=text], input[type=date], input[type=number], input[type=datetime], input[type=time], input[type=checkbox], input[type=radio], input[type=email], input[type=password]');
	    },
	    findTextFields: function (form) {
	        return jQuery(form).find('input[type="text"], input[type="file"], input[type="time"], input[type="number"], input[type="datetime"], input[type="date"], input[type="password"], input[type="email"], textarea');
	    },
	    enableInputs: function (form) {
	        return this.findVisibleFields(form).removeAttr('disabled');
	    },
	    disableInputs: function (form) {
	        return this.findVisibleFields(form).attr('disabled', 'disabled');
	    }
	};
	exports.__esModule = true;
	exports["default"] = FormUtils;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(3);
	var ActionPlugin_1 = __webpack_require__(5);
	var FormUtils_1 = __webpack_require__(2);
	var AIM_1 = __webpack_require__(6);
	var assign = __webpack_require__(7);
	var Action = (function () {
	    function Action(arg1, arg2) {
	        var _this = this;
	        if (arg1 === void 0) { arg1 = null; }
	        if (arg2 === void 0) { arg2 = null; }
	        this.plugins = [];
	        this.url = null;
	        this.options = { "disableInput": true };
	        var opts = {};
	        var form = null;
	        if (typeof arg1 === "string") {
	            arg1 = jQuery(arg1);
	        }
	        if (arg1 instanceof jQuery) {
	            arg1 = arg1.get(0);
	        }
	        if (arg1 instanceof HTMLFormElement) {
	            form = arg1;
	        }
	        if (form) {
	            if (!(form instanceof HTMLFormElement)) {
	                throw "action container is not a HTMLFormElement";
	            }
	            this.setForm(form);
	            opts = arg2 || {};
	        }
	        else if (typeof arg1 === "object") {
	            opts = arg1;
	        }
	        this.options = assign({}, opts || {}); // copy the config array
	        if (this.options.plugins) {
	            this.options.plugins.forEach(function (p) {
	                _this.plug(p);
	            });
	        }
	        // Register globalPlugins to this action.
	        Action._globalPlugins.forEach(function (p, i) {
	            var cls = p.plugin;
	            var plugin = new cls(_this, p.options || {});
	            _this.plug(plugin);
	        });
	    }
	    Action.prototype.setForm = function (f) {
	        var _this = this;
	        this.formEl = jQuery(f);
	        f.setAttribute("method", "post");
	        f.setAttribute("enctype", "multipart/form-data");
	        this.formEl.data("actionObject", this);
	        if (typeof f.elements['__action'] === "undefined") {
	            throw "__action signature field is undefined.";
	        }
	        this.actionName = f.elements['__action'].value;
	        if (!this.actionName) {
	            throw "empty action signature name.";
	        }
	        if (typeof f.elements['__ajax_request'] === "undefined") {
	            this.formEl.append(jQuery('<input>').attr({
	                'type': "hidden",
	                'name': "__ajax_request",
	                'value': 1
	            }));
	        }
	        // trigger Action.submit method by the form binding
	        this.formEl.submit(function (e) {
	            try {
	                // for AIM, we need to trigger submit action
	                // for pure ajax action, we need to return false to
	                // send action manually.
	                return _this.submit();
	            }
	            catch (err) {
	                if (window.console) {
	                    console.error("Form submit error", err.message, err);
	                }
	            }
	            return false;
	        });
	    };
	    /**
	     * Set form element
	     *
	     * @param f {HTMLFormElement|string|jQuery}
	     */
	    Action.prototype.form = function (f) {
	        if (f === void 0) { f = null; }
	        if (f) {
	            if (typeof f === "string") {
	                f = jQuery(f);
	            }
	            if (f instanceof jQuery) {
	                f = f.get(0);
	            }
	            if (!f) {
	                throw "action form element not found";
	            }
	            if (!(f instanceof HTMLFormElement)) {
	                throw "Unsupported form object.";
	            }
	            this.setForm(f);
	        }
	        return this.formEl;
	    };
	    /**
	     * add plugin
	     */
	    Action.prototype.plug = function (plugin, config) {
	        if (config === void 0) { config = null; }
	        if (plugin instanceof ActionPlugin_1["default"]) {
	            plugin.init(this);
	            this.plugins.push(plugin);
	        }
	        else if (typeof plugin === "function") {
	            var instance = new plugin(config);
	            instance.init(this);
	            this.plugins.push(instance);
	        }
	    };
	    /**
	     * set action path
	     */
	    Action.prototype.setPath = function (path) {
	        this.url = path;
	    };
	    /**
	     * get the current data from the form
	     */
	    Action.prototype.getFormData = function () {
	        var data, isIndexed, that;
	        that = this;
	        data = {};
	        isIndexed = function (n) { return n.indexOf('[]') > 0; };
	        var f = this.form();
	        if (typeof f === "undefined") {
	            throw "form is undefined";
	        }
	        if (typeof tinyMCE !== 'undefined' && typeof tinyMCE.EditorManager !== 'undefined') {
	            tinyMCE.EditorManager.triggerSave();
	        }
	        FormUtils_1["default"].findFields(f).each(function (i, n) {
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
	                    }
	                    else {
	                        data[name] = val;
	                    }
	                }
	                else if (!data[name]) {
	                    data[name] = null;
	                }
	            }
	            else {
	                if (isIndexed(name)) {
	                    data[name].push(val);
	                }
	                else {
	                    data[name] = val;
	                }
	            }
	        });
	        return data;
	    };
	    Action.prototype.setup = function (options) {
	        this.options = jQuery.extend(this.options, options);
	        return this;
	    };
	    Action.prototype._processElementOptions = function (options, resp) {
	        var el;
	        if (options.removeTr) {
	            el = jQuery(jQuery(options.removeTr).parents('tr').get(0));
	            el.fadeOut('fast', function () {
	                return jQuery(this).remove();
	            });
	        }
	        if (options.remove) {
	            return jQuery(options.remove).remove();
	        }
	    };
	    Action.prototype._processFormOptions = function (options, resp) {
	        if (options.clear) {
	            FormUtils_1["default"].findTextFields(this.form()).each(function (i, e) {
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
	    };
	    Action.prototype._processLocationOptions = function (options, resp) {
	        if (options.reload) {
	            return setTimeout((function () {
	                window.location.reload();
	            }), options.delay || 0);
	        }
	        else if (options.redirect) {
	            return setTimeout((function () {
	                window.location.href = options.redirect;
	            }), options.delay || 0);
	        }
	        else if (resp.redirect) {
	            return setTimeout((function () {
	                window.location.href = resp.redirect;
	            }), resp.delay * 1000 || options.delay || 0);
	        }
	    };
	    Action.prototype._processRegionOptions = function (options, resp) {
	        var form, reg;
	        if (typeof Region === "undefined") {
	            console.warn("Region is undefined. region-js is not loaded.");
	            return;
	        }
	        form = this.form();
	        if (form) {
	            reg = Region.of(form);
	            // update region to the related option keys
	            var regionKeys = ['refreshSelf', 'refresh', 'refreshParent', 'refreshWithId', 'removeRegion', 'emptyRegion'];
	            regionKeys.forEach(function (key) {
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
	    };
	    Action.prototype._createSuccessHandler = function (formEl, deferred, options, cb, retrycb) {
	        var _this = this;
	        if (retrycb === void 0) { retrycb = null; }
	        return function (resp) {
	            var debugDiv, ret;
	            $(_this).trigger('action.result', [resp]);
	            if (formEl && options.disableInput) {
	                FormUtils_1["default"].enableInputs(formEl);
	            }
	            if (cb) {
	                ret = cb.call(_this, resp);
	                if (ret) {
	                    return ret;
	                }
	            }
	            if (resp.success) {
	                if (options.onSuccess) {
	                    options.onSuccess.apply(_this, [resp]);
	                }
	                _this._processFormOptions(options, resp);
	                _this._processRegionOptions(options, resp);
	                _this._processElementOptions(options, resp);
	                _this._processLocationOptions(options, resp);
	                deferred.resolve(resp);
	            }
	            else if (resp.error) {
	                deferred.reject(resp);
	                if (resp.csrf_token_mismatch || resp.csrf_token_expired || resp.csrf_token_invalid) {
	                    console.error("csrf token mismatched", resp);
	                }
	                if (options.onError) {
	                    options.onError.apply(_this, [resp]);
	                }
	                if (window.console) {
	                    console.error("Returned error", resp.message, resp);
	                    if (resp.trace) {
	                        debugDiv = document.createElement('div');
	                        debugDiv.innerHTML = resp.trace;
	                        console.debug(debugDiv.textContent);
	                    }
	                }
	                else {
	                    alert(resp.message);
	                }
	            }
	            else {
	                throw "Unknown error:" + resp;
	            }
	            return true;
	        };
	    };
	    Action.prototype._createErrorHandler = function (formEl, deferred, options) {
	        return function (error, t, m) {
	            if (error.responseText) {
	                if (window.console) {
	                    console.error(error.responseText);
	                }
	                else {
	                    alert(error.responseText);
	                }
	            }
	            else {
	                console.error(error);
	            }
	            deferred.reject(error);
	            if (formEl && options.disableInput) {
	                FormUtils_1["default"].enableInputs(formEl);
	            }
	        };
	    };
	    /*
	    Run action with pure ajax request.
	  
	    .run() or runAction()
	      run specific action
	    .run( 'Delete' , { table: 'products' , id: id } , function() { ... });
	    .run( [action name] , [arguments] , [options] or [callback] );
	    .run( [action name] , [arguments] , [options] , [callback] );
	  
	    */
	    Action.prototype.run = function (actionName, args, arg1, arg2) {
	        var _this = this;
	        if (arg1 === void 0) { arg1 = null; }
	        if (arg2 === void 0) { arg2 = null; }
	        var cb, payload;
	        if (typeof arg1 === "function") {
	            cb = arg1;
	        }
	        else if (typeof arg1 === "object") {
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
	        var doSubmit = function (payload) {
	            var formEl, postUrl;
	            if (_this.options.onSubmit) {
	                _this.options.onSubmit();
	            }
	            formEl = _this.form();
	            if (formEl) {
	                if (_this.options.disableInput) {
	                    FormUtils_1["default"].disableInputs(formEl);
	                }
	            }
	            if (formEl && formEl.attr('action')) {
	                postUrl = formEl.attr('action');
	            }
	            else {
	                postUrl = _this.url
	                    || Action.ajaxOptions.url
	                    || window.location.pathname;
	            }
	            var errorHandler = _this._createErrorHandler(formEl, deferred, _this.options);
	            var successHandler = _this._createSuccessHandler(formEl, deferred, _this.options, cb);
	            jQuery.ajax(jQuery.extend(Action.ajaxOptions, {
	                "url": postUrl,
	                "data": payload,
	                "error": errorHandler,
	                "success": successHandler
	            }));
	            return deferred;
	        };
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
	    };
	    /**
	     * submit the action
	     *
	     * submit(option , callback )
	     * submit(callback )
	     *
	     * @return boolean
	     */
	    Action.prototype.submit = function (arg1, arg2) {
	        if (arg1 === void 0) { arg1 = null; }
	        if (arg2 === void 0) { arg2 = null; }
	        var $form, cb, data, ret, that;
	        that = this;
	        if (typeof arg1 === "object") {
	            this.options = assign(this.options, arg1);
	            if (arg2 && typeof arg2 === "function") {
	                cb = arg2;
	            }
	        }
	        else if (typeof arg1 === "function") {
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
	            // depends on the return value of AIM.onStart
	            this.submitWithAIM(data, cb);
	            return true;
	        }
	        this.run(data.action, data);
	        return false;
	    };
	    Action.prototype.submitWithAIM = function (data, cb) {
	        var _this = this;
	        if (cb === void 0) { cb = null; }
	        var deferred = jQuery.Deferred();
	        var actionName;
	        var $form = this.form();
	        var successHandler = this._createSuccessHandler($form, deferred, this.options, cb);
	        var errorHandler = this._createErrorHandler($form, deferred, this.options);
	        if (!$form || !$form.get(0)) {
	            throw "form element not found.";
	        }
	        actionName = $form.find('input[name="__action"]').val();
	        if (!actionName) {
	            throw "action name field is required";
	        }
	        AIM_1["default"].submit($form.get(0), {
	            'onStart': function () {
	                if (_this.options.beforeUpload) {
	                    _this.options.beforeUpload.call(_this, $form, data);
	                }
	                // must start 
	                return true;
	            },
	            'onComplete': function (responseText) {
	                try {
	                    var json = JSON.parse(responseText);
	                    console.debug("AIM response", json);
	                    if (_this.options.onUpload) {
	                        _this.options.onUpload(json);
	                    }
	                    successHandler(json);
	                    if (_this.options.afterUpload) {
	                        _this.options.afterUpload.call(_this, $form, json);
	                    }
	                }
	                catch (err) {
	                    errorHandler(err, null, null);
	                }
	            }
	        });
	        return deferred;
	    };
	    /**
	     * Submit the current form with extended form data.
	     */
	    Action.prototype.submitWith = function (extendData, arg1, arg2) {
	        if (arg1 === void 0) { arg1 = null; }
	        if (arg2 === void 0) { arg2 = null; }
	        var cb, data, options;
	        options = {};
	        if (typeof arg1 === "object") {
	            options = arg1;
	            if (typeof arg2 === "function") {
	                cb = arg2;
	            }
	        }
	        else if (typeof arg1 === "function") {
	            cb = arg1;
	        }
	        data = assign(this.getFormData(), extendData);
	        return this.run(data.action, data, options, cb);
	    };
	    /**
	     * Construct an Action from form elements
	     */
	    Action.form = function (formsel, config) {
	        if (config === void 0) { config = {}; }
	        return new Action(formsel, config);
	    };
	    /**
	     * plugin must be a constructor function.
	     */
	    Action.plug = function (plugin, opts) {
	        if (opts === void 0) { opts = {}; }
	        return Action._globalPlugins.push({
	            plugin: plugin,
	            options: opts
	        });
	    };
	    /**
	     * Contains the the action plugin factories
	     */
	    Action._globalPlugins = [];
	    Action.ajaxOptions = {
	        "dataType": "json",
	        "type": "post",
	        "timeout": 8000
	    };
	    return Action;
	}());
	exports.__esModule = true;
	exports["default"] = Action;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	  a = new ActionPlugin(action,{ ...options...  })
	  a = new ActionPlugin(action)
	  a = new ActionPlugin({ ... })
	  */
	var Action_1 = __webpack_require__(4);
	var ActionPlugin = (function () {
	    function ActionPlugin(a1, a2) {
	        if (a1 === void 0) { a1 = null; }
	        if (a2 === void 0) { a2 = null; }
	        this.config = {};
	        if (a1 && a2) {
	            this.config = a2 || {};
	            this.init(a1);
	        }
	        else if (a1 instanceof Action_1["default"]) {
	            this.init(a1);
	        }
	        else if (typeof a1 === 'object') {
	            this.config = a1;
	        }
	    }
	    ActionPlugin.prototype.init = function (action) {
	        this.action = action;
	        return this.form = this.action.form();
	    };
	    return ActionPlugin;
	}());
	exports.__esModule = true;
	exports["default"] = ActionPlugin;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var AIM = {
	    /**
	     * frame function returns the iframe name.
	     */
	    frame: function (c) {
	        // iframe id
	        var n = 'f' + Math.floor(Math.random() * 99999);
	        // create a div and insert into the document
	        var d = document.createElement('DIV');
	        d.innerHTML = '<iframe style="display:none" id="' + n + '" name="' + n + '" onload="AIM.loaded(\'' + n + '\')"></iframe>';
	        document.body.appendChild(d);
	        // get the iframe element
	        var i = document.getElementById(n);
	        if (c.onComplete) {
	            // assign on complete handler on the element
	            i['onComplete'] = c.onComplete;
	        }
	        return n;
	    },
	    /**
	      * what onStart returns affect the form submitting,
	      * if you returns false, the form won't submit.
	      */
	    submit: function (f, c) {
	        console.debug('AIM.submit');
	        // Setup form target to the name of the iframe.
	        f.setAttribute('target', AIM.frame(c));
	        if (c && typeof (c.onStart) === 'function') {
	            console.debug("AIM.onStart");
	            return c.onStart();
	        }
	        return true;
	    },
	    loaded: function (id) {
	        var i = document.getElementById(id);
	        var d;
	        if (i.contentDocument) {
	            d = i.contentDocument;
	        }
	        else if (i.contentWindow) {
	            d = i.contentWindow.document;
	        }
	        else {
	            d = window.frames[id].document;
	        }
	        // chances are, the page might be about:blank initially.
	        if (d.location.href === "about:blank") {
	            return;
	        }
	        if (typeof (i['onComplete']) === 'function') {
	            var responseText = d.body.textContent || d.body.innerHTML;
	            console.debug("AIM.onComplete", responseText);
	            // detect json output
	            var match = /(\{.+\})/.exec(responseText);
	            if (match) {
	                console.debug("AIM.onComplete with JSON", match[1]);
	                i['onComplete'](match[1]);
	            }
	            else {
	                throw "AIM:Unexpected response format";
	            }
	        }
	    }
	};
	exports.__esModule = true;
	exports["default"] = AIM;


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	/// <reference path="Cookies.d.ts" />
	"use strict";
	var ActionCsrfToken = (function () {
	    function ActionCsrfToken() {
	    }
	    ActionCsrfToken.requestSession = function () {
	        return jQuery.ajax({
	            "url": '/=/current_user/csrf',
	            "error": function (resp) { console.error(resp); }
	        });
	    };
	    /**
	     * the config.success defines the callback for csrf token response
	     */
	    ActionCsrfToken.get = function (config) {
	        var cookieCsrf, tokenExpired;
	        tokenExpired = true;
	        var csrfToken = ActionCsrfToken.csrfToken;
	        if (typeof Cookies !== "undefined") {
	            cookieCsrf = Cookies.get('csrf');
	        }
	        if (cookieCsrf) {
	            return typeof config.success === "function" ? config.success(cookieCsrf) : void 0;
	        }
	        if (csrfToken) {
	            tokenExpired = (new Date).getTime() > (csrfToken.timestamp + csrfToken.ttl) * 1000;
	        }
	        if (!tokenExpired) {
	            return typeof config.success === "function" ? config.success(csrfToken.hash) : void 0;
	        }
	        var defer = $.Deferred();
	        // TODO: handle fail(), always() as well.
	        ActionCsrfToken.requestSession().done(function (resp) {
	            if (resp.error) {
	                console.error("requestSession error", resp.error);
	                if (resp.redirect) {
	                    window.location.href = resp.redirect;
	                }
	            }
	            else {
	                console.debug("csrfToken refreshed", resp);
	                ActionCsrfToken.csrfToken = resp;
	                if (typeof config.success === "function") {
	                    config.success(ActionCsrfToken.csrfToken.hash);
	                }
	                defer.resolve(resp);
	            }
	        });
	        return defer;
	    };
	    return ActionCsrfToken;
	}());
	exports.__esModule = true;
	exports["default"] = ActionCsrfToken;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/// <reference path="jquery-scrollTo.d.ts" />
	__webpack_require__(3);
	var ActionPlugin_1 = __webpack_require__(5);
	var ActionMsgbox = (function (_super) {
	    __extends(ActionMsgbox, _super);
	    function ActionMsgbox() {
	        _super.apply(this, arguments);
	    }
	    ActionMsgbox.prototype.init = function (action) {
	        var _this = this;
	        var actionId = action.actionName.replace(/::/g, '-');
	        var self = this;
	        this.action = action;
	        this.form = action.form().get(0);
	        this.cls = 'action-' + actionId + '-result';
	        this.ccls = 'action-result';
	        if (this.config.container) {
	            this.container = jQuery(this.config.container);
	        }
	        else {
	            this.container = this.form.find('.' + this.cls);
	            if (!this.container.get(0)) {
	                this.container = jQuery('<div/>').addClass(this.cls).addClass(this.ccls);
	                this.form.prepend(this.container);
	            }
	        }
	        if (typeof this.config.clear !== "undefined") {
	            if (this.config.clear) {
	                this.container.empty().hide();
	            }
	        }
	        else {
	            this.container.empty().hide();
	        }
	        $(this.action).on('action.result', function (ev, resp) {
	            var $box, $close, $desc, $icon, $text, d, i, len, msg, ref, results;
	            $box = $('<div/>').addClass('message');
	            $text = $('<div/>').addClass('text');
	            $desc = $('<div/>').addClass('desc');
	            $icon = $('<i/>').css({
	                float: 'left'
	            }).addClass('icon fa');
	            $close = $('<span/>').css({
	                position: 'absolute',
	                top: 6,
	                right: 6
	            }).addClass('fa fa-times-circle').click(function () {
	                $box.fadeOut('slow', function () {
	                    $box.remove();
	                });
	            });
	            $box.append($icon).append($text);
	            if (resp.desc) {
	                $box.append($desc);
	            }
	            $box.append($close);
	            if (resp.success) {
	                $box.addClass('success');
	                $icon.addClass('fa-check-circle');
	                $text.text(resp.message);
	                self.container.html($box).fadeIn('fast');
	            }
	            else if (resp.error) {
	                self.container.empty();
	                $box.addClass('error');
	                $icon.addClass('fa-warning');
	                $text.text(resp.message);
	                self.container.html($box).fadeIn('fast');
	            }
	            if (resp.validations) {
	                ref = self.extErrorMsgs(resp);
	                results = [];
	                for (i = 0, len = ref.length; i < len; i++) {
	                    msg = ref[i];
	                    d = $('<div/>').addClass('error-message').html(msg);
	                    results.push($desc.append(d));
	                }
	                return results;
	            }
	        });
	        $(action).on('action.before_submit', function () {
	            _this.wait();
	        });
	    };
	    ActionMsgbox.prototype.wait = function () {
	        var _this = this;
	        var $box, $close, $desc, $icon, $text, scrollOffset;
	        $box = $('<div/>').addClass('message');
	        $text = $('<div/>').addClass('text');
	        $desc = $('<div/>').addClass('desc');
	        $icon = $('<i/>').css({
	            float: 'left'
	        }).addClass('icon icon-spinner icon-spin');
	        $close = $('<span/>').css({
	            position: 'absolute',
	            top: 6,
	            right: 6
	        }).addClass('fa fa-times-circle').click(function () {
	            $box.fadeOut('slow', function () {
	                $box.remove();
	            });
	        });
	        $box.append($icon).append($text).append($desc).append($close);
	        $box.addClass('waiting');
	        $text.text("Progressing");
	        this.container.html($box).fadeIn('fast');
	        if (!this.config.disableScroll && typeof (jQuery.scrollTo) !== "undefined" && window.pageYOffset > 20) {
	            scrollOffset = this.config.scrollOffset || -20;
	            jQuery.scrollTo($box.get(0), 200, {
	                offset: scrollOffset
	            });
	        }
	        if (this.config.fadeOut) {
	            setTimeout(function () {
	                _this.container.fadeOut('fast', function () { _this.container.empty(); });
	            }, 1200);
	        }
	    };
	    ActionMsgbox.prototype.extErrorMsgs = function (resp) {
	        var field, ref, results, v;
	        ref = resp.validations;
	        results = [];
	        for (field in ref) {
	            v = ref[field];
	            if (!v.valid || v.error) {
	                results.push(v.message);
	            }
	            else {
	                results.push(void 0);
	            }
	        }
	        return results;
	    };
	    return ActionMsgbox;
	}(ActionPlugin_1["default"]));
	exports.__esModule = true;
	exports["default"] = ActionMsgbox;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="jGrowl.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ActionPlugin_1 = __webpack_require__(5);
	var ActionGrowler = (function (_super) {
	    __extends(ActionGrowler, _super);
	    function ActionGrowler() {
	        _super.apply(this, arguments);
	    }
	    ActionGrowler.prototype.init = function (action) {
	        var _this = this;
	        $(action).on('action.result', function (ev, resp) {
	            if (resp.success) {
	                _this.growl(resp.message, _this.config.success);
	            }
	            else {
	                _this.growl(resp.message, $.extend(_this.config.error, {
	                    theme: 'error'
	                }));
	            }
	        });
	    };
	    ActionGrowler.prototype.growl = function (text, opts) {
	        jQuery.jGrowl(text, opts);
	    };
	    return ActionGrowler;
	}(ActionPlugin_1["default"]));
	exports.__esModule = true;
	exports["default"] = ActionGrowler;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ActionPlugin_1 = __webpack_require__(5);
	var BootstrapFormHighlight_1 = __webpack_require__(12);
	var ActionBootstrapHighlight = (function (_super) {
	    __extends(ActionBootstrapHighlight, _super);
	    function ActionBootstrapHighlight() {
	        _super.apply(this, arguments);
	    }
	    ActionBootstrapHighlight.prototype.init = function (action) {
	        var _this = this;
	        this.action = action;
	        this.form = action.form().get(0);
	        this.highligher = new BootstrapFormHighlight_1["default"](this.form);
	        jQuery(this.action).on('action.result', function (ev, resp) {
	            _this.highligher.cleanup();
	            _this.highligher.fromValidations(resp.validations);
	        });
	    };
	    return ActionBootstrapHighlight;
	}(ActionPlugin_1["default"]));
	exports.__esModule = true;
	exports["default"] = ActionBootstrapHighlight;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	// different from ActionBootstrapHighlight, this class 
	// takes form element as its constructor parameter.
	var BootstrapFormHighlight = (function () {
	    function BootstrapFormHighlight(form) {
	        this.form = form;
	    }
	    BootstrapFormHighlight.prototype.fromValidations = function (validations) {
	        for (var field in validations) {
	            var validation = validations[field];
	            if (validation.valid == false) {
	                this.addError(field, validation.message || validation.desc);
	            }
	            else {
	                this.addSuccess(field, validation.message || validation.desc);
	            }
	        }
	    };
	    BootstrapFormHighlight.prototype.addError = function (field, message) {
	        if (this.form[field]) {
	            var $fieldInput = $(this.form[field]);
	            var $formGroup = $($fieldInput.parents('.form-group').get(0));
	            $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-remove form-control-feedback'));
	            $fieldInput.after($('<span class="sr-only"/>').text('error'));
	            if (message) {
	                $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
	            }
	            $formGroup.addClass('has-error');
	        }
	    };
	    BootstrapFormHighlight.prototype.addWarning = function (field, message) {
	        if (this.form[field]) {
	            var $fieldInput = $(this.form[field]);
	            var $formGroup = $($fieldInput.parents('.form-group').get(0));
	            $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-sign form-control-feedback'));
	            $fieldInput.after($('<span class="sr-only"/>').text('warning'));
	            if (message) {
	                $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
	            }
	            $formGroup.addClass('has-warning');
	        }
	    };
	    BootstrapFormHighlight.prototype.addSuccess = function (field, message) {
	        if (this.form[field]) {
	            var $fieldInput = $(this.form[field]);
	            var $formGroup = $($fieldInput.parents('.form-group').get(0));
	            $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-ok form-control-feedback'));
	            $fieldInput.after($('<span class="sr-only"/>').text('success'));
	            if (message) {
	                $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
	            }
	            $formGroup.addClass('has-success');
	        }
	    };
	    BootstrapFormHighlight.prototype.cleanup = function () {
	        for (var field in this.form) {
	            var el = this.form[field];
	            if (el instanceof Node && el.nodeName == "INPUT") {
	                var $formGroup = $($(el).parents('.form-group').get(0));
	                $formGroup.removeClass('has-error has-success has-warning');
	                $formGroup.find('.glyphicon').remove();
	                $formGroup.find('.sr-only').remove();
	                $formGroup.find('.help-block-validation').remove();
	            }
	        }
	    };
	    BootstrapFormHighlight.prototype.getFirstInvalidField = function () {
	        return jQuery(this.form).find('.has-error, .has-warning').get(0);
	    };
	    return BootstrapFormHighlight;
	}());
	exports.__esModule = true;
	exports["default"] = BootstrapFormHighlight;


/***/ }
/******/ ]);