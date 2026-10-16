import 'core-js/stable';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import ResizeObserver from 'resize-observer-polyfill';
if (!window.ResizeObserver) window.ResizeObserver = ResizeObserver;
if (!NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;
if (!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function () {return document.documentElement.contains(this);}});
if (!Element.prototype.replaceChildren) Element.prototype.replaceChildren = function () {
  while (this.firstChild) this.removeChild(this.firstChild);
  for (var i = 0; i < arguments.length; i++) this.appendChild(typeof arguments[i] === 'string' ? document.createTextNode(arguments[i]) : arguments[i]);
};
