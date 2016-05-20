
/*
CsrfToken manager

  ActionCsrfToken.get success: (csrfToken) ->
    ....
  */

 // ActionCsrfToken
export default {
  requestSession: function() {
    return jQuery.ajax({
      url: '/=/current_user/csrf',
      error: (function(_this) {
        return function(resp) {
          return console.error(resp);
        };
      })(this)
    });
  },
  get: function(config) {
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
      this.requestSession().success((function(_this) {
        return function(resp) {
          if (resp.error) {
            console.error("requestSession error", resp.error);
            if (resp.redirect) {
              return window.location = resp.redirect;
            }
          } else {
            console.debug("csrfToken refreshed", resp);
            _this._csrfToken = resp;
            if (typeof config.success === "function") {
              config.success(_this._csrfToken.hash);
            }
            return defer.resolve(resp);
          }
        };
      })(this));
      return defer;
    }
  }
};
