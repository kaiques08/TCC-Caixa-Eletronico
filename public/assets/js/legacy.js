(function () {
  "use strict";

  if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (search, replacement) {
      return this.split(search).join(replacement);
    };
  }

  if (!Array.prototype.includes) {
    Array.prototype.includes = function (value, start) {
      return this.indexOf(value, start || 0) !== -1;
    };
  }

  if (!Object.entries) {
    Object.entries = function (object) {
      return Object.keys(object).map(function (key) { return [key, object[key]]; });
    };
  }

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var node = this;
      while (node && node.nodeType === 1) {
        if (node.matches(selector)) return node;
        node = node.parentElement;
      }
      return null;
    };
  }
})();
