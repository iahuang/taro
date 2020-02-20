import { Reactive } from "./reactive";
import Taro from "./core";

export class StateValue<T> {
    protected value: T;
    dependentNodes: Node[] = [];
    protected subscribers: ((value: T) => void)[] = [];

    constructor(initial: T) {
        this.value = initial;
    }

    subscribe(cb: (value: T) => void) {
        this.subscribers.push(cb);
    }

    renderAsNode() {
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
    }

    protected notifySubscribers() {
        for (let cb of this.subscribers) {
            cb(this.value);
        }
    }

    set(to: T) {
        this.value = to;
        this._applyToDOM();
        this.notifySubscribers();
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

    map(func: (item: T) => unknown) {
        return new StateArrayDerivative<T>(this, arr => arr.map(func));
    }
    filter(func: (item: T) => unknown) {
        return new StateArrayDerivative<T>(this, arr => arr.filter(func));
    }
}

export class StateArrayDerivative<T> extends StateArray<any> {
    // pretty similar to Reactive
    derivation: (arr: T[]) => unknown[];
    constructor(source: StateArray<T>, derivation: (arr: T[]) => unknown[]) {
        super([]);
        this.derivation = derivation;
        source.subscribe(this.refresh.bind(this));
    }
    refresh(arr: T[]) {
        this.set(this.derivation(arr));
    }
}

export class StateDict<K, V> extends StateValue<Map<K,V>> {
    arrayMarkerNodes: Node[] = [];
    arrayContentNodes: Node[] = [];

    constructor(initial: Map<K, V> = new Map<K, V>()) {
        super(initial);
    }

    _applyToDOM() {
        throw new Error("Cannot display StateDict instance in DOM");
    }

    set(to: Map<K,V>) {
        this.value = to;
        this.notifySubscribers();
    }

    enter(k: K, v: V) {
        this.value.set(k, v);
        this.notifySubscribers();
    }

    get(k: K) {
        return this.value.get(k);
    }

    clear() {
        this.set(new Map<K,V>());
    }

    entries() {
        return new StateDictEntries<K,V>(this);
    }
}

export class StateDictEntries<K,V> extends StateArray<StateArray<any>> {
    // pretty similar to Reactive
    constructor(source: StateDict<K,V>) {
        super([]);
        source.subscribe(this.refresh.bind(this));
    }
    refresh(map: Map<K,V>) {
        let entries = new Array<StateArray<any>>();
        for (let [k, v] of map.entries()) {
            entries.push(new StateArray([k,v]));
        }
        this.set(entries);
    }
}