class DOMSubscriptionIndex {
    _table = new Map<Node, TaroBaseMutableState<any>[]>();
    _gcCounter = 0;
    gcEveryNthOperation = 4;

    registerNodeSubscription(node: Node, stateRoot: TaroBaseMutableState<any>) {
        if (!this._table.has(node)) this._table.set(node, []);
        this._table.get(node)?.push(stateRoot);
    }

    _collectGarbage() {
        let flagForRemoval: Node[] = [];
        for (let [node, states] of this._table.entries()) {
            if (!document.contains(node)) {
                for (let state of states) {
                    state.unsubscribeNode(node);
                }
                flagForRemoval.push(node);
            }
        }
        for (let node of flagForRemoval) {
            this._table.delete(node);
        }
    }

    updateGC() {
        this._gcCounter++;
        if (this._gcCounter >= this.gcEveryNthOperation) {
            this._collectGarbage();
            this._gcCounter = 0;
        }
    }
}

export default class TaroInternal {
    static dsi = new DOMSubscriptionIndex();
}



export type TaroStateObservable<T> = TaroStateObject<T> | T;
export abstract class TaroStateObject<T> {
    private _name: string | null = null;

    setName(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    abstract getValue(): T;
}

export function observe<T>(n: TaroStateObservable<T>) {
    if (n instanceof TaroStateObject) {
        return n.getValue();
    }
    return n;
}

type onChangeCallback<T> = (newValue: T) => void;

export class TaroBaseMutableState<T> extends TaroStateObject<T> {
    value: T;
    private subscribers = new Map<Node, onChangeCallback<T>>();
    constructor(initialValue: T) {
        super();
        this.value = initialValue;
    }

    getValue() {
        return this.value;
    }

    subscribeFromNode(node: Node, cb: onChangeCallback<T>) {
        this.subscribers.set(node, cb);
        TaroInternal.dsi.registerNodeSubscription(node, this);
    }

    unsubscribeNode(node: Node) {
        this.subscribers.delete(node);
    }

    updateValue(to: T) {
        this.value = to;
        let iterator = Array.from(this.subscribers.entries());
        for (let [node, cb] of iterator) {
            cb(to);
        }
        TaroInternal.dsi.updateGC();
    }
}
