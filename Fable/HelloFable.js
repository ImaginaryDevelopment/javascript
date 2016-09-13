(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["fable-core"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("fable-core"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.fableCore);
    global.HelloFable = mod.exports;
  }
})(this, function (_fableCore) {
  "use strict";

  (function main(argv) {
    return argv.length === 0 ? function () {
      _fableCore.String.fsFormat("Please provide an argument")(function (x) {
        console.log(x);
      });

      return 1;
    }() : function () {
      _fableCore.String.fsFormat("Hello %s")(function (x) {
        console.log(x);
      })(argv[0]);

      return 0;
    }();
  })(process.argv.slice(2));
});