"use strict";
var Taro = /** @class */ (function () {
    function Taro() {
    }
    return Taro;
}());
var __TaroReact = /** @class */ (function () {
    function __TaroReact() {
    }
    __TaroReact.prototype.createElement = function (tagName, args, children) {
        console.log(tagName, args);
    };
    return __TaroReact;
}());
window.React = new __TaroReact();
window.Taro = new Taro();
define("test", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.main = void 0;
    function main() {
        console.log(React.createElement("div", null, "hi"));
    }
    exports.main = main;
});
