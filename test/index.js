"use strict";

var DEBUG = process.env.DEBUG;

typeof DEBUG === "string" ? process.env.DEBUG += ",DOMinate:index.js" :
process.env.DEBUG = "DOMinate:index.js";

var val_gens = require("../lib/val-gens.js");
var DOMinate = require("../lib/index.js");

describe("DOMinate exported methods", function() {
  it("should have exported of val_gen's exported", function() {
    Object.keys(val_gens).forEach(function(methName) {
      expect(DOMinate[methName]).not.toBeUndefined;
      expect(DOMinate[methName]).toEqual(jasmine.any(Function));
    }, null);
  });
});

describe("closurize()", function() {
  var closurize = DOMinate.closurize;
  it("is exported when in debug mode", function() {
    expect(DOMinate.closurize).not.toBeUndefined();
  });

  it("returns the usable api", function() {
    var incrementColor = val_gens.incrementColor;

    expect(closurize({}, "color", incrementColor, "blue", [10,10,10])).toEqual(
      jasmine.any(Function)
    );
  });
});

describe("using a DOMinate method, ", function() {
  it ("incrementColor()", function () {
    var observeMe = [100, 110, 120];
    var intervals = [10, 10, 10];
    var max = Infinity, min = 0;
    var incrementColor = DOMinate.incrementColor;
    var cb = incrementColor({}, "blah", observeMe, intervals, max, min);
    var totalCalls = 5;
    var expected = new Array(3);

    observeMe.forEach(function (val, ind) {
      expected[ind] = val;
    }, undefined);

    // run and keep tests DRY
    while (totalCalls--) {
    /*console.log("HEXADECIMAL VALUE: ",*/ cb()/*)*/
      // update expected
      for (var i = 0, val; i < 3; i++) {
        val = expected[i] + intervals[i];
        val = val > max ? val - max : val;
        val = val < min ? min : val;
        expected[i] = val;
      }
      expect(observeMe).toEqual(expected);
    }
  });
});
