/**
*
*  AJAX IFRAME METHOD (AIM)
*  http://www.webtoolkit.info/
*
**/
var AIM = {
  frame: function(c) {
    // iframe id
    var n:string = 'f' + Math.floor(Math.random() * 99999);

    // create a div and insert into the document
    var d:HTMLElement = document.createElement('DIV');
    d.innerHTML = '<iframe style="display:none" id="'+n+'" name="'+n+'" onload="AIM.loaded(\''+n+'\')"></iframe>';
    document.body.appendChild(d);

    // get the iframe element
    var i:HTMLElement = document.getElementById(n);
    if (c && typeof(c.onComplete) == 'function') {
      // assign on complete handler on the element
      i['onComplete'] = c.onComplete;
    }
    return n;
  },

  form : function(f, name) {
    f.setAttribute('target', name);
  },


  /**
    * what onStart returns affect the form submitting,
    * if you returns false, the form won't submit.
    */
  submit : function(f:HTMLFormElement, c) {
      AIM.form(f, AIM.frame(c));
      if (c && typeof(c.onStart) === 'function') {
          console.debug("AIM.onStart");
          return c.onStart();
      } else {
          return true;
      }
  },

  loaded: function(id:string) {
    var i = <HTMLIFrameElement>document.getElementById(id);
    var d:Document;
    if (i.contentDocument) {
      d = i.contentDocument;
    } else if (i.contentWindow) {
      d = i.contentWindow.document;
    } else {
      d = window.frames[id].document;
    }

    if (d.location.href === "about:blank") {
      return;
    }
    if (typeof(i['onComplete']) === 'function') {
      if (window.console) {
          console.debug("AIM.onComplete");
      }
      var match = /(\{.+\})/.exec(d.body.innerHTML);
      if (match) {
        console.debug("AIM.onComplete with JSON",match[1]);
        i['onComplete'](match[1]);
      }
    }
  }
};
export default AIM;
