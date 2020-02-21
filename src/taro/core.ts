import { StateValue, StateArray } from "./state";
import Component from "./component";

export default class Taro {
    static bindValue(formElement: HTMLElement, to: StateValue<any>, valueTransform: ((value: string)=>any) | null) {
        let eventListenerCallback = (event: Event) => {
            let inputValue = (event.target as HTMLInputElement).value;
            if (valueTransform) {
                to.set(valueTransform(inputValue));
            } else {
                to.set(inputValue);
            }
        }

        switch (formElement.tagName.toLocaleLowerCase()) {
            case "textarea":
            case "input":
                formElement.addEventListener("input", eventListenerCallback);
                to.subscribe(boundValue=>(formElement as HTMLInputElement).value = boundValue);
                break;
            case "select":
                formElement.addEventListener("change", eventListenerCallback);
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
        let transformer: ((value: string)=>any) | null = null;

        for (let [attr, e] of Object.entries(attrs)) { // look for modifiers
            switch (attr) {
                case "inputValueTransform":
                    transformer = e;
                    break;
            }
        }

        for (let [attr, e] of Object.entries(attrs)) {
            switch (attr) {
                case "onClick":
                    el.onclick = () => {
                        e();
                    };
                    break;
                case "bindValue":
                    Taro.bindValue(el, e, transformer);
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
