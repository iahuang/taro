"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
define("taro/core", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TaroBaseMutableState = exports.observe = exports.TaroStateObject = void 0;
    var DOMSubscriptionIndex = /** @class */ (function () {
        function DOMSubscriptionIndex() {
            this._table = new Map();
            this._gcCounter = 0;
            this.gcEveryNthOperation = 4;
        }
        DOMSubscriptionIndex.prototype.registerNodeSubscription = function (node, stateRoot) {
            var _a;
            if (!this._table.has(node))
                this._table.set(node, []);
            (_a = this._table.get(node)) === null || _a === void 0 ? void 0 : _a.push(stateRoot);
        };
        DOMSubscriptionIndex.prototype._collectGarbage = function () {
            var e_1, _a, e_2, _b, e_3, _c;
            var flagForRemoval = [];
            try {
                for (var _d = __values(this._table.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), node = _f[0], states = _f[1];
                    if (!document.contains(node)) {
                        try {
                            for (var states_1 = (e_2 = void 0, __values(states)), states_1_1 = states_1.next(); !states_1_1.done; states_1_1 = states_1.next()) {
                                var state = states_1_1.value;
                                state.unsubscribeNode(node);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (states_1_1 && !states_1_1.done && (_b = states_1.return)) _b.call(states_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        flagForRemoval.push(node);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var flagForRemoval_1 = __values(flagForRemoval), flagForRemoval_1_1 = flagForRemoval_1.next(); !flagForRemoval_1_1.done; flagForRemoval_1_1 = flagForRemoval_1.next()) {
                    var node = flagForRemoval_1_1.value;
                    this._table.delete(node);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (flagForRemoval_1_1 && !flagForRemoval_1_1.done && (_c = flagForRemoval_1.return)) _c.call(flagForRemoval_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        DOMSubscriptionIndex.prototype.updateGC = function () {
            this._gcCounter++;
            if (this._gcCounter >= this.gcEveryNthOperation) {
                this._collectGarbage();
                this._gcCounter = 0;
            }
        };
        return DOMSubscriptionIndex;
    }());
    var TaroInternal = /** @class */ (function () {
        function TaroInternal() {
        }
        TaroInternal.dsi = new DOMSubscriptionIndex();
        return TaroInternal;
    }());
    exports.default = TaroInternal;
    var TaroStateObject = /** @class */ (function () {
        function TaroStateObject() {
            this._name = null;
        }
        TaroStateObject.prototype.setName = function (name) {
            this._name = name;
        };
        Object.defineProperty(TaroStateObject.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        return TaroStateObject;
    }());
    exports.TaroStateObject = TaroStateObject;
    function observe(n) {
        if (n instanceof TaroStateObject) {
            return n.getValue();
        }
        return n;
    }
    exports.observe = observe;
    var TaroBaseMutableState = /** @class */ (function (_super) {
        __extends(TaroBaseMutableState, _super);
        function TaroBaseMutableState(initialValue) {
            var _this = _super.call(this) || this;
            _this.subscribers = new Map();
            _this.value = initialValue;
            return _this;
        }
        TaroBaseMutableState.prototype.getValue = function () {
            return this.value;
        };
        TaroBaseMutableState.prototype.subscribeFromNode = function (node, cb) {
            this.subscribers.set(node, cb);
            TaroInternal.dsi.registerNodeSubscription(node, this);
        };
        TaroBaseMutableState.prototype.unsubscribeNode = function (node) {
            this.subscribers.delete(node);
        };
        TaroBaseMutableState.prototype.updateValue = function (to) {
            var e_4, _a;
            this.value = to;
            var iterator = Array.from(this.subscribers.entries());
            try {
                for (var iterator_1 = __values(iterator), iterator_1_1 = iterator_1.next(); !iterator_1_1.done; iterator_1_1 = iterator_1.next()) {
                    var _b = __read(iterator_1_1.value, 2), node = _b[0], cb = _b[1];
                    cb(to);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return)) _a.call(iterator_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            TaroInternal.dsi.updateGC();
        };
        return TaroBaseMutableState;
    }(TaroStateObject));
    exports.TaroBaseMutableState = TaroBaseMutableState;
});
define("taro/reactive", ["require", "exports", "taro/core"], function (require, exports, core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumericStateVar = exports.TaroReactiveState = void 0;
    var TaroReactiveState = /** @class */ (function (_super) {
        __extends(TaroReactiveState, _super);
        function TaroReactiveState(dep, t) {
            var _this = _super.call(this) || this;
            _this.dependencies = dep;
            _this.transformer = t;
            return _this;
        }
        TaroReactiveState.prototype.getValue = function () {
            return this.transformer.apply(this, __spreadArray([], __read(this.dependencies)));
        };
        return TaroReactiveState;
    }(core_1.TaroStateObject));
    exports.TaroReactiveState = TaroReactiveState;
    var NumericStateVar = /** @class */ (function (_super) {
        __extends(NumericStateVar, _super);
        function NumericStateVar(n) {
            return _super.call(this, n) || this;
        }
        NumericStateVar.prototype.increment = function (n) {
            this.updateValue(this.value + core_1.observe(n));
        };
        return NumericStateVar;
    }(core_1.TaroBaseMutableState));
    exports.NumericStateVar = NumericStateVar;
});
define("taro/api", ["require", "exports", "taro/core", "taro/reactive"], function (require, exports, core_2, reactive_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Taro = void 0;
    var Taro = /** @class */ (function () {
        function Taro() {
        }
        Taro.render = function (el, to) {
            to.appendChild(el);
        };
        Taro.add = function (a, b) {
            return new reactive_1.TaroReactiveState([a, b], function () { return core_2.observe(a) + core_2.observe(b); });
        };
        Taro.state = {
            number: function (initial) {
                return new reactive_1.NumericStateVar(initial);
            },
        };
        return Taro;
    }());
    exports.Taro = Taro;
});
define("taro/react_dom", ["require", "exports", "taro/core", "taro/reactive"], function (require, exports, core_3, reactive_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.__TaroReact = void 0;
    function assertInstanceOf(obj, t, message) {
        if (!(obj instanceof t)) {
            throw new Error(message);
        }
    }
    var __TaroReact = /** @class */ (function () {
        function __TaroReact() {
        }
        /*
            A class that implements a subset of the React object. Used to define React calls
            generated by the Typescript JSX generator.
        */
        // domBindings = new Map<Node, TaroStateObject<any>>();
        __TaroReact.prototype._createNodeBinding = function (node, obj) {
            var e_5, _a;
            var _this = this;
            //this.domBindings.set(node, obj);
            var dependsOn;
            if (obj instanceof reactive_2.TaroReactiveState) {
                dependsOn = this.getTopLevelDependencies(obj);
            }
            else if (obj instanceof core_3.TaroBaseMutableState) {
                dependsOn = [obj];
            }
            else {
                throw new Error("");
            }
            try {
                for (var dependsOn_1 = __values(dependsOn), dependsOn_1_1 = dependsOn_1.next(); !dependsOn_1_1.done; dependsOn_1_1 = dependsOn_1.next()) {
                    var dep = dependsOn_1_1.value;
                    dep.subscribeFromNode(node, function (v) {
                        var newNode = _this._toDOMNode(obj.getValue());
                        _this._createNodeBinding(newNode, obj);
                        node.replaceWith(newNode);
                    });
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (dependsOn_1_1 && !dependsOn_1_1.done && (_a = dependsOn_1.return)) _a.call(dependsOn_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        __TaroReact.prototype._garbageCollect = function () { };
        __TaroReact.prototype._toDOMNode = function (obj) {
            if (typeof obj === "string") {
                return document.createTextNode(obj);
            }
            if (typeof obj === "bigint" || typeof obj === "number" || typeof obj === "boolean") {
                return document.createTextNode(obj.toString());
            }
            if (obj === null || obj === undefined) {
                return document.createTextNode("");
            }
            if (obj instanceof HTMLElement) {
                return obj;
            }
            if (obj instanceof core_3.TaroStateObject) {
                var node = this._toDOMNode(obj.getValue());
                this._createNodeBinding(node, obj);
                return node;
            }
            throw new Error("Cannot represent object " + obj + " as a DOM Node");
        };
        __TaroReact.prototype.getTopLevelDependencies = function (stateObj) {
            var all = [];
            this._getTLDep(stateObj, all);
            return all;
        };
        __TaroReact.prototype._getTLDep = function (obj, all) {
            var e_6, _a;
            try {
                for (var _b = __values(obj.dependencies), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var d = _c.value;
                    if (d instanceof core_3.TaroStateObject) {
                        if (d instanceof core_3.TaroBaseMutableState) {
                            all.push(d);
                        }
                        else if (d instanceof reactive_2.TaroReactiveState) {
                            this._getTLDep(d, all);
                        }
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        };
        __TaroReact.prototype.createElement = function (tagName, args) {
            var e_7, _a, e_8, _b;
            var children = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                children[_i - 2] = arguments[_i];
            }
            var el = document.createElement(tagName);
            try {
                for (var _c = __values(Object.entries(args || {})), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), argName = _e[0], value = _e[1];
                    // hack to check for an event listener tag like "onClick"
                    // and add it as an eventListener instead of an html tag
                    if (argName.match(/on[A-Z]/)) {
                        var ev = argName.substring(2).toLowerCase();
                        assertInstanceOf(value, Function, "Event listeners must be a function.");
                        el.addEventListener(ev, value);
                        continue;
                    }
                    el.setAttribute(argName, value);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_7) throw e_7.error; }
            }
            try {
                for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                    var child = children_1_1.value;
                    var node = this._toDOMNode(child);
                    if (node)
                        el.appendChild(node);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (children_1_1 && !children_1_1.done && (_b = children_1.return)) _b.call(children_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return el;
        };
        return __TaroReact;
    }());
    exports.__TaroReact = __TaroReact;
});
define("taro", ["require", "exports", "taro/api", "taro/api", "taro/react_dom"], function (require, exports, api_1, api_2, react_dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Taro = void 0;
    Object.defineProperty(exports, "Taro", { enumerable: true, get: function () { return api_2.Taro; } });
    window.React = new react_dom_1.__TaroReact();
    window.Taro = api_1.Taro;
});
/*
    Type definitions for Taro/React. Adapted from @types/react

    (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)

*/
