/// <reference path="Cookies.d.ts" />

/*
CsrfToken manager

  ActionCsrfToken.get success: (csrfToken) ->
    ....
*/


interface CsrfTokenRequest {
  success(hash:string);
}

interface CsrfTokenData {
  hash: string;
  timestamp: number;
  ttl: number;
}

export default class ActionCsrfToken {

  static csrfToken:CsrfTokenData;

  static requestSession(): JQueryXHR {
    return jQuery.ajax({
      "url": '/=/current_user/csrf',
      "error": (resp) => { console.error(resp); }
    });
  }


  /**
   * the config.success defines the callback for csrf token response
   */
  static get(config:CsrfTokenRequest) {
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
    ActionCsrfToken.requestSession().done(
      (resp) => {
        if (resp.error) {
          console.error("requestSession error", resp.error);
          if (resp.redirect) {
            return window.location = resp.redirect;
          }
        } else {
          console.debug("csrfToken refreshed", resp);
          ActionCsrfToken.csrfToken = resp;
          if (typeof config.success === "function") {
            config.success(ActionCsrfToken.csrfToken.hash);
          }
          defer.resolve(resp);
        }
      }
    );
    return defer;
  }
}
