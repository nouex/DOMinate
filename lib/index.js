"use strict";

var val_gens = require("./val-gens.js");
var charge = require("ch-arge");

// export

for (var method in val_gens) {
  if (val_gens.hasOwnProperty(method)) {
    exports[method] = (function() {
      var valGen = val_gens[method];

      return function (el, style) {
        var args = [].slice.call(arguments, 2);

        return closurize.apply(undefined, [el, style, valGen].concat(args));
      }
    })();
  }
}


/**
* @api private
* @param {function} styler changes a style of a node
* @param {function} valGen value for styler
* @param {Array}    arguments passed to valGen
* @return {Function} the async function
*/

RegExp("DOMinate:index.js", "i").test(process.env.DEBUG) ?
module.exports.closurize = closurize : void null;

function closurize (el, style, valGen) {
  var args;

  args = Array.prototype.slice.call(arguments, 3);
  valGen.expArgs.forEach(function(arg, ind) {
    charge(args[ind], arg);
  }, null);

  return function () {
    return el[style] = valGen.apply(null, args);
  };
}
