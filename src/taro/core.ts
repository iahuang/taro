import { StateValue, StateArray } from "./state";

export default class Taro {
    static create(
        tagName: string,
        attrs: { [key: string]: any },
        ...content: any[]
    ) {
        let el = document.createElement(tagName);
        for (let [attr, e] of Object.entries(attrs)) {
            if (["onClick"].includes(attr)) {
                el.onclick = () => {
                    e();
                };
            } else {
                el.setAttribute(attr, e);
            }
        }

        for (let child of content) {
            let childNode = this.valueToNode(child);
            el.appendChild(childNode);
        }
        return el;
    }

    static setBody(node: any) {
        document.body.appendChild(node);
    }

    static valueToNode(value: any) {
        if (typeof value !== "object") {
            return document.createTextNode(value);
        }
        if (value instanceof StateValue) {
            let tmp = document.createDocumentFragment()
            value.createDependentNodes(tmp);
            value._applyToDOM();
            return tmp;
        }
        if (value instanceof Node) {
            return value;
        }
        if (value instanceof Array) {
            let tmp = document.createDocumentFragment()
            for (let subChild of value) {
                tmp.appendChild(subChild);
            }
            return tmp;
        }
        throw new Error("Invalid child type");
    }
}
