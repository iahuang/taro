import { StateValue, StateArray } from "./state";
import Component from "./component";

export default class Taro {
    static bindValue(formElement: HTMLElement, to: StateValue<any>) {
        switch (formElement.tagName.toLocaleLowerCase()) {
            case "textarea":
            case "input":
                formElement.addEventListener("input", event => {
                    to.set((event.target as HTMLInputElement).value);
                });
                to.subscribe(boundValue=>(formElement as HTMLInputElement).value = boundValue);
                break;
            case "select":
                formElement.addEventListener("change", event => {
                    to.set((event.target as HTMLInputElement).value);
                });
                to.subscribe(boundValue=>(formElement as HTMLInputElement).value = boundValue);
                break;
            default:
                throw new Error("Cannot use bindValue on HTML tag "+formElement.tagName.toLocaleLowerCase());
        }
    }

    static create(
        tagName: string,
        attrs: { [name: string]: any },
        ...content: any[]
    ) {
        let el = document.createElement(tagName);
        for (let [attr, e] of Object.entries(attrs)) {
            switch (attr) {
                case "onClick":
                    el.onclick = () => {
                        e();
                    };
                    break;
                case "bindValue":
                    Taro.bindValue(el, e);
                    break;
                default:
                    el.setAttribute(attr, e);
            }
        }

        for (let child of content) {
            let childNode = this.valueToNode(child);
            el.appendChild(childNode);
        }
        return el;
    }

    static createComponent(
        compType: typeof Component,
        props: { [name: string]: any },
        ...content: any[]
    ) {
        let component = new compType(props);

        let el = component.render();
        console.log(el)
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
            let tmp = document.createDocumentFragment();
            value.createDependentNodes(tmp);
            value._applyToDOM();
            return tmp;
        }
        if (value instanceof Node) {
            return value;
        }
        if (value instanceof Array) {
            let tmp = document.createDocumentFragment();
            for (let subChild of value) {
                tmp.appendChild(subChild);
            }
            return tmp;
        }
        throw new Error("Invalid child type");
    }
}
