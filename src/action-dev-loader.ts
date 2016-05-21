
/*
 * ActionDevLoader.update()
 */
export default {
  update: function() {
    var el;
    el = document.createElement("script");
    el.setAttribute("type", "text/javascript");
    el.setAttribute("src", "/assets/action-js/action.js?_=" + (new Date).getTime());
    return document.getElementsByTagName("head")[0].appendChild(el);
  }
};
