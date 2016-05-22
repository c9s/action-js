/// <reference path="Cookies.d.ts" />

/*
CsrfToken manager

  ActionCsrfToken.get success: (csrfToken) ->
    ....
  */


export default class ActionCsrfToken {

  static _csrfToken:any;

  static requestSession(): JQueryXHR {
    return jQuery.ajax({
      url: '/=/current_user/csrf',
      error: (function(_this) {
        return function(resp) {
          return console.error(resp);
        };
      })(this)
    });
  }

  static get(config) {
    var cookieCsrf, csrfToken, defer, tokenExpired;
    tokenExpired = true;
    csrfToken = this._csrfToken;
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
    } else {
      defer = $.Deferred();

      // TODO: handle fail(), always() as well.
      this.requestSession().done(
        (resp) => {
          if (resp.error) {
            console.error("requestSession error", resp.error);
            if (resp.redirect) {
              return window.location = resp.redirect;
            }
          } else {
            console.debug("csrfToken refreshed", resp);
            this._csrfToken = resp;
            if (typeof config.success === "function") {
              config.success(this._csrfToken.hash);
            }
            return defer.resolve(resp);
          }
        }
      );
      return defer;
    }
  }
}
