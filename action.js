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
	var ActionPlugin_1 = __webpack_require__(7);
	window.FormUtils = FormUtils_1["default"];
	window.ActionPlugin = ActionPlugin_1["default"];
	window.Action = Action_1["default"];
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
	var FormUtils_1 = __webpack_require__(2);
	var AIM_1 = __webpack_require__(5);
	var assign = __webpack_require__(6);
	var Action = (function () {
	    function Action(arg1, arg2) {
	        var _this = this;
	        if (arg1 === void 0) { arg1 = null; }
	        if (arg2 === void 0) { arg2 = null; }
	        this.plugins = [];
	        this.actionPath = null;
	        this.options = { "disableInput": true };
	        var form, opts = {};
	        if (arg1 instanceof jQuery) {
	            form = arg1;
	        }
	        else if (arg1 instanceof HTMLFormElement) {
	            form = arg1;
	        }
	        else if (typeof arg1 === "string") {
	            form = arg1;
	        }
	        else if (arg1 && arg2) {
	            form = arg1;
	        }
	        else if (!arg2 && typeof arg1 === "object") {
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
	            this.options.plugins.forEach(function (p) {
	                _this.plug(p);
	            });
	        }
	        Action._globalPlugins.forEach(function (p, i) {
	            var plugin = new plugin(_this, p.options);
	            _this.plug(plugin);
	        });
	    }
	    /**
	     * @param {HTMLFormElement|jQuery} f
	     */
	    Action.prototype.setForm = function (f) {
	        var _this = this;
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
	        return this.formEl.submit(function () {
	            var e, ret;
	            try {
	                ret = _this.submit();
	                if (ret) {
	                    return ret;
	                }
	            }
	            catch (_error) {
	                e = _error;
	                if (window.console) {
	                    console.error("Form submit error", e.message, e);
	                }
	            }
	            return false;
	        });
	    };
	    Action.prototype.form = function (f) {
	        if (f === void 0) { f = null; }
	        if (f) {
	            this.setForm(f);
	        }
	        return this.formEl;
	    };
	    /**
	     * add plugin
	     */
	    Action.prototype.plug = function (plugin) {
	        plugin.init(this);
	        this.plugins.push(plugin);
	    };
	    /**
	     * set action path
	     */
	    Action.prototype.setPath = function (path) {
	        return this.actionPath = path;
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
	    Action.prototype._processElementOptions = function (options) {
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
	        if (retrycb === void 0) { retrycb = null; }
	        var $self, self;
	        self = this;
	        $self = jQuery(self);
	        return function (resp) {
	            var debugDiv, ret;
	            $self.trigger('action.result', [resp]);
	            if (formEl && options.disableInput) {
	                FormUtils_1["default"].enableInputs(formEl);
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
	            }
	            else if (resp.error) {
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
	            if (formEl && options.disableInput) {
	                return FormUtils_1["default"].enableInputs(formEl);
	            }
	        };
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
	    Action.prototype.run = function (actionName, args, arg1, arg2) {
	        var _this = this;
	        if (arg1 === void 0) { arg1 = null; }
	        if (arg2 === void 0) { arg2 = null; }
	        var cb, payload;
	        if (typeof arg1 === "function") {
	            cb = arg1;
	        }
	        else if (typeof arg1 === "object") {
	            this.options = jQuery.extend(this.options, arg1);
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
	            var errorHandler, formEl, postUrl, successHandler;
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
	            else if (_this.actionPath) {
	                postUrl = _this.actionPath;
	            }
	            else if (Action.ajaxOptions.url) {
	                postUrl = Action.ajaxOptions.url;
	            }
	            else {
	                postUrl = window.location.pathname;
	            }
	            errorHandler = _this._createErrorHandler(formEl, deferred, _this.options);
	            successHandler = _this._createSuccessHandler(formEl, deferred, _this.options, cb);
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
	     */
	    Action.prototype.submit = function (arg1, arg2) {
	        if (arg1 === void 0) { arg1 = null; }
	        if (arg2 === void 0) { arg2 = null; }
	        var $form, cb, data, ret, that;
	        that = this;
	        if (typeof arg1 === "object") {
	            this.options = jQuery.extend(this.options, arg1);
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
	            this.submitWithAIM(data, cb);
	            return false;
	        }
	        this.run(data.action, data);
	        return false;
	    };
	    Action.prototype.submitWithAIM = function (data, cb) {
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
	        if (typeof AIM_1["default"] === "undefined") {
	            alert("AIM is required for uploading file in ajax mode.");
	        }
	        actionName = $form.find('input[name="__action"]').val();
	        if (!actionName) {
	            throw "action name field is required";
	        }
	        that = this;
	        AIM_1["default"].submit($form.get(0), {
	            onStart: function () {
	                if (that.options.beforeUpload) {
	                    that.options.beforeUpload.call(that, $form);
	                }
	                return true;
	            },
	            onComplete: function (responseText) {
	                var e, json;
	                try {
	                    json = JSON.parse(responseText);
	                    successHandler(json, that.options.onUpload);
	                    if (that.options.afterUpload) {
	                        that.options.afterUpload.call(that, $form, json);
	                    }
	                }
	                catch (_error) {
	                    e = _error;
	                    errorHandler(e);
	                }
	                return true;
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
	        data = jQuery.extend(this.getFormData(), extendData);
	        return this.run(data.action, data, options, cb);
	    };
	    /**
	     * Construct an Action from form elements
	     */
	    Action.form = function (formsel, opts) {
	        if (opts === void 0) { opts = {}; }
	        return new Action(formsel, opts);
	    };
	    Action.plug = function (plugin, opts) {
	        if (opts === void 0) { opts = {}; }
	        return Action._globalPlugins.push({
	            plugin: plugin,
	            options: opts
	        });
	    };
	    Action.reset = function () {
	        return Action._globalPlugins = [];
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
/***/ function(module, exports) {

	"use strict";
	/**
	*
	*  AJAX IFRAME METHOD (AIM)
	*  http://www.webtoolkit.info/
	*
	**/
	var AIM = {
	    frame: function (c) {
	        // iframe id
	        var n = 'f' + Math.floor(Math.random() * 99999);
	        // create a div and insert into the document
	        var d = document.createElement('DIV');
	        d.innerHTML = '<iframe style="display:none" id="' + n + '" name="' + n + '" onload="AIM.loaded(\'' + n + '\')"></iframe>';
	        document.body.appendChild(d);
	        // get the iframe element
	        var i = document.getElementById(n);
	        if (c && typeof (c.onComplete) == 'function') {
	            // assign on complete handler on the element
	            i['onComplete'] = c.onComplete;
	        }
	        return n;
	    },
	    form: function (f, name) {
	        f.setAttribute('target', name);
	    },
	    /**
	      * what onStart returns affect the form submitting,
	      * if you returns false, the form won't submit.
	      */
	    submit: function (f, c) {
	        AIM.form(f, AIM.frame(c));
	        if (c && typeof (c.onStart) === 'function') {
	            console.debug("AIM.onStart");
	            return c.onStart();
	        }
	        else {
	            return true;
	        }
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
	        if (d.location.href === "about:blank") {
	            return;
	        }
	        if (typeof (i['onComplete']) === 'function') {
	            if (window.console) {
	                console.debug("AIM.onComplete");
	            }
	            var match = /(\{.+\})/.exec(d.body.innerHTML);
	            if (match) {
	                console.debug("AIM.onComplete with JSON", match[1]);
	                i['onComplete'](match[1]);
	            }
	        }
	    }
	};
	exports.__esModule = true;
	exports["default"] = AIM;


/***/ },
/* 6 */
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
/* 7 */
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


/***/ }
/******/ ]);