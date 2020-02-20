import { Reactive } from "./reactive";
import Taro from "./core";

export class StateValue<T> {
    protected value: T;
    dependentNodes: Node[] = [];
    reactiveDependents: Reactive[] = [];
    constructor(initial: T) {
        this.value = initial; // redundant; only to appease the compiler
    }

    renderAsNode() {
        console.log('rendering',this);
        let newNode: Node;
        let valuePrimitiveType = typeof this.value;
        if (valuePrimitiveType != "object") {
            // you can probably just represent it as a string
            newNode = document.createTextNode(
                (this.value as Object).toString()
            );
        } else {
            if (this.value === null) {
                newNode = document.createTextNode("");
            } else if (this.value instanceof Node) {
                newNode = this.value;
            } else {
                console.log(this.value);
                throw new Error("Unable to render value " + this.value);
            }
        }
        return newNode;
    }

    _applyToDOM() {
        let newDependentNodes: Node[] = [];
        let newNode = this.renderAsNode();
        for (let node of this.dependentNodes) {
            node.parentNode?.replaceChild(newNode, node);
            newDependentNodes.push(newNode);
        }

        this.dependentNodes = newDependentNodes;

        for (let dep of this.reactiveDependents) {
            dep.refresh();
        }
    }

    set(to: T) {
        this.value = to;
        this._applyToDOM();
    }

    createDependentNodes(at: Node) {
        let newNode = document.createTextNode("");
        this.dependentNodes.push(newNode);
        at.appendChild(newNode);
    }

    setFunction(to: T) {
        return (() => this.set(to)).bind(this);
    }

    update(cb: (old: T) => T) {
        this.set(cb(this.value));
    }

    updateFunction(cb: (old: T) => T) {
        return (() => this.update(cb)).bind(this);
    }

    incr(by: any = 1) {
        this.update(v => v + by);
    }

    read() {
        return this.value;
    }
}

export class Const<T> extends StateValue<T> {
    constructor(initial: T) {
        super(initial);
    }
}

export class StateNumeric extends StateValue<number> {
    constructor(initial: number = 0) {
        super(initial);
    }
    decr(by: any = 1) {
        this.update(v => v - by);
    }
}
function insertAfter(el: Node, referenceNode: Node) {
    referenceNode.parentNode?.insertBefore(el, referenceNode.nextSibling);
}

export class StateArray<T> extends StateValue<T[]> {
    arrayMarkerNodes: Node[] = [];
    arrayContentNodes: Node[] = [];

    constructor(initial: T[] = []) {
        super(initial);
    }

    _applyToDOM() {
        for (let contentNode of this.arrayContentNodes) {
            contentNode.parentNode?.removeChild(contentNode);
        }
        for (let marker of this.arrayMarkerNodes) {
            let fragment = document.createDocumentFragment();
            for (let item of this.value) {
                let newElement = Taro.valueToNode(item);
                
                fragment.appendChild(newElement);
            }
            for (let child of Array.from(fragment.childNodes)) {
                this.arrayContentNodes.push(child);
            }
            insertAfter(fragment, marker);
        }
    }

    createDependentNodes(at: Node) {
        let newNode = document.createTextNode("");
        this.arrayMarkerNodes.push(newNode);
        at.appendChild(newNode);
    }

    push(item: T) {
        this.update(arr => arr.concat(item));
    }
}

// export class DerivedStateArray