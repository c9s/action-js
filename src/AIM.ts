/**
*
*  AJAX IFRAME METHOD (AIM)
*  http://www.webtoolkit.info/
*
**/
export interface AIMConfig {
  /**
   * Handle Response Text
   */
  onComplete?: (responseText) => void;

  /**
   * what onStart returns affect the form submitting,
   * if you returns false, the form won't submit.
   */
  onStart?: () => boolean;
}


var AIM = {
  /**
   * frame function returns the iframe name.
   */
  frame: function(c:AIMConfig) : string {
    // iframe id
    var n:string = 'f' + Math.floor(Math.random() * 99999);

    // create a div and insert into the document
    var d:HTMLElement = document.createElement('DIV');
    d.innerHTML = '<iframe style="display:none" id="'+n+'" name="'+n+'" onload="AIM.loaded(\''+n+'\')"></iframe>';
    document.body.appendChild(d);

    // get the iframe element
    var i:HTMLIFrameElement = <HTMLIFrameElement>document.getElementById(n);
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
  submit:function(f:HTMLFormElement, c:AIMConfig) : boolean {
    console.debug('AIM.submit');
    // Setup form target to the name of the iframe.
    f.setAttribute('target', AIM.frame(c));
    if (c && typeof(c.onStart) === 'function') {
      console.debug("AIM.onStart");
      return c.onStart();
    }
    return true;
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
    // chances are, the page might be about:blank initially.
    if (d.location.href === "about:blank") {
      return;
    }
    if (typeof(i['onComplete']) === 'function') {
      var responseText = d.body.textContent || d.body.innerHTML;
      console.debug("AIM.onComplete", responseText);
      // detect json output
      var match = /(\{.+\})/.exec(responseText);
      if (match) {
        console.debug("AIM.onComplete with JSON",match[1]);
        i['onComplete'](match[1]);
      } else {
        throw "AIM:Unexpected response format";
      }
    }
  }
}
export default AIM;
