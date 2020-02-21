"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _default;

var core = require("@babel/core");
let types = core.types;
var util = require('util')
function _default() {
    return {
        visitor: {
            JSXElement: function(path) {
                let opening = path.node.openingElement;
                let attrs = opening.attributes;
                let elementTypeName = opening.name.name;
                let children = path.node.children;
                if (elementTypeName.charAt(0) == elementTypeName.charAt(0).toUpperCase()) {
                    path.replaceWithSourceString(`Taro.createComponent(${elementTypeName})`);
                } else {
                    path.replaceWithSourceString(`Taro.create("${elementTypeName}")`);
                }
                
                let attrsNode = types.objectExpression([]);
                for (let attr of attrs) {
                    let attrName = attr.name.name;
                    let attrValue = attr.value;
                    if (attrValue == null) {
                        attrValue = types.booleanLiteral(true);
                    }

                    if (types.isJSXExpressionContainer(attrValue)) {
                        attrValue = attrValue.expression;
                    }

                    attrsNode.properties.push(types.objectProperty(types.stringLiteral(attrName), attrValue));
                }
                let callArgs = path.node.arguments;
                callArgs.push(attrsNode);
                for (let child of children) {
                    callArgs.push(child)
                }
                
            },
            JSXText: function(path) {
                path.replaceWith(types.stringLiteral(path.node.value));
            },
            JSXExpressionContainer: function(path) {
                path.replaceWith(path.node.expression)
            }
        },
    };
}