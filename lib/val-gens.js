"use strict";

var debug;

/val_gens\.js/i.test(process.env.DEBUG) ? exports.colorPalette = colorPalette :
void 0;

try {
  debug = require("debug")("DOMinate:val-gens.js");
} catch(e){
  debug = function NOP(){}
}

var cssColorNames =
require("../node_modules/css-color-names/css-color-names.json");


/**
* @api private
* @param {Array} pal
* @param {Array} intervals
* @param {number} [min]
* @param {number} [max]
* @return {Array} pal
*/

function percOf(perc, of) {
  return (perc / 100) * of;
}

function incrementPalette(pal, intervals, min, max) {
  if (!(pal instanceof Array && intervals instanceof Array))
    throw new TypeError("invalid arg");
  min = min instanceof Number ? min : 0;
  max = max instanceof Number ? max : Infinity;

  var diff, holder = [];

  // interval elmts are (%, of) pairs
  if (intervals[0] instanceof Array) {
    intervals.forEach(function(pair, ind) {
      var perc = pair[0], outOf = pair[1];

      if (typeof perc !== "number") throw new TypeError;
      if (outOf instanceof Function)  outOf = outOf();
      if (typeof outOf !== "number") throw new TypeError;

      holder[ind] = percOf(perc, outOf);
    }, null);

    intervals = holder;
  }

  pal.forEach(function(n, ind) {
    n += intervals[ind];
    if (n > max) {
      diff = n - max;
      n = min + diff;
    } else if (n < min) {
      n = min;
    }

    pal[ind] = n;
  });

  return pal;
}


/**
* @api private
* @param [Mixed] color
* @return [Array] color in rgb form per element
* String color vals could be in form of hex "#xxxxxx" or rgb "xxxxxx" or
* word "green". Goal is to get it to a three piece array.
*/

function colorPalette(color) {
  var type = typeof color,
      HEX = /^\s*#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})\s*$/,
      RGB = /^(\d\d?\d?)(?:\s|,)(\d\d?\d?)(?:\s|,)(\d\d?\d?)$/;

  var tmp, format, shouldExit;

  debug("colorPalette: type = " + type);
  if (type !== "string") {
    if (!(type === "object" && type !== null))
      return;
  }

  debug("color instanceof Array && color.length !== e => " +
  (color instanceof Array && color.length !== 3));

  if (color instanceof Array && color.length !== 3) return;

  if (type === "string") {
  // string to array
  if (color in cssColorNames) {
    debug("colorPalette: color '" + color + "' found in cssColorNames");
    color = cssColorNames[color];
    format = "hex";
  } else {
    HEX.test(color) ? format = "hex" : RGB.test(color) ? format = "rgb" : void 0;
    if (format === undefined) return;// neither hex nor rgb
  }

  tmp = format === "hex" ? HEX.exec(color) : RGB.exec(color);
  debug("colorPalette: format = " + format);

  switch (format) {
    case "hex":
    tmp = tmp.slice(1, 4);
    tmp[0] = parseInt(tmp[0], 16);
    tmp[1] = parseInt(tmp[1], 16);
    tmp[2] = parseInt(tmp[2], 16);

    case "rgb":
    color = tmp;
    break;

    default:
    throw new Error("unexpected fall-through");
  }

  }
  debug("colorPalette: `color` after switch => " + color);

  // array of (supposedly) rgb values, let's check
  shouldExit = color.every(function(curr, ind) {
    color[ind] = +curr;
    if (0 <= curr <= 255) {
      return true;
    } else {
      return false;
    }
  });

  shouldExit = !shouldExit;

  debug("colorPalette: shouldExit=" + shouldExit);
  if (shouldExit) return;

  return color;
}


/**
* @api private
* @param {Array} pal
* @return {string} hex
*/

function paletteToHex(pal) {
  var hex = "#";

  pal.forEach(function(rgb, ind) {
    var single;

    if (ind < 3)  {
      single = rgb.toString(16);
      // pad
      single.length !== 2 ? single = "0" + single : void null;
      hex += single;
    }
  }, null);

  return hex;
}


/**
* @api public
* @param {Mixed} color
* @param {Array} intervals
* @param {min} [min]
* @param {max} [max]
*/

exports.incrementColor = incrementColor;
function incrementColor(color, intervals, min, max) {
  var pal;

  pal = colorPalette(color);
  debug("incrementColor: pal = colorPalette(color) => " + pal);
  pal = incrementPalette(pal, intervals, min, max);

  return paletteToHex(pal);
}

// expected args for charge
incrementColor.expArgs = ["str Str arr", "arr", "undefined num Num",
                          "undefined num Num"]


/**
* @api public
* @param {Mixed} color
* @param {Array} intervals
* @param {min} [min]
* @param {max} [max]
*/

exports.decrementColor = decrementColor;
function decrementColor(color, intervals, min, max) {
  intervals.forEach(function(val, ind, a) {
    a[ind] = -a[ind];
  }, null);

  return incrementColor(pal, intervals, min, max);
}

// expected args for charge
decrementColor.expArgs = ["str Str arr", "arr", "undefined num Num",
                          "undefined num Num"];

/**
* @api public
* @param {Array|Function} queue gives uri address to fetch from
* @return {File} fileObject object returned by uri
*/

function fetch(queue) {
  //... XHR usage
}


// LEGACY
/******************************************************************************/

function isRGB(s) {
  return !(s.length % 2) && this.isHex(s) && chopNTest(s);
  function chopNTest(s) {
    return s.split(/(?:([a-f]|[0-9]){2})/gi).every(function(s) {
      // for undefined returns of the regex
      if (!s.length) return true;
      return 0 <= parseInt(s, 16) <= 255
    }, null);
  }
}
