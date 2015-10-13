"use strict";

"string" === typeof process.env.DEBUG ? process.env.DEBUG += ",DOMinate:val-gens.js" :
  process.env.DEBUG = "DOMinate:val-gens.js";

var val_gens = require("../lib/val-gens.js");

describe("incrementColor()", function() {
  var incrementColor = val_gens.incrementColor;


  it("increments", function() {
    var expHex;
    expHex = "#" + (55).toString(16) + (60).toString(16) + (65).toString(16);
    expect(incrementColor([50,50,50], [5, 10, 15])).toEqual(expHex);
  });

  it("accepts css color names", function() {
    // green  rgb(0, 128, 0)
    var res = incrementColor.call(null, "green", [10,15,20]);
    expect(res).toMatch(RegExp("#0a8f14", "i"));
  });

  it("accepts hex values", function() {
    // #3d87f4 rgb(61, 135, 244)
    // plus5(rgb(61,135,255)) => #428CF9
    var expRes = "#428CF9";

    expect(incrementColor("#3d87f4", [5,5,5])).toMatch(RegExp(expRes, "i"));
  });

  it("accepts string rgb values seperated by , or space", function() {
    // rgb(20) => hex 14
    var exp = (20).toString(16);
    var expRes = exp + exp + exp;

    expect(incrementColor([10,15,20], [10, 5, 0])).toMatch(RegExp(expRes, "i"));
  });
});
