"use strict";
define("Taro", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Taro = void 0;
    var Taro = /** @class */ (function () {
        function Taro() {
        }
        return Taro;
    }());
    exports.Taro = Taro;
    var __TaroReact = /** @class */ (function () {
        function __TaroReact() {
        }
        __TaroReact.prototype.createElement = function (tagName, args, children) {
            console.log(tagName, args);
        };
        return __TaroReact;
    }());
    window.React = new __TaroReact();
});
/*
    Type definitions for Taro/React. Adapted from @types/react

    (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)

*/
