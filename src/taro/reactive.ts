import { observe, TaroBaseMutableState, TaroStateObject, TaroStateObservable } from "./core";

export type TaroReactiveTransformer<T> = (...dep: TaroStateObservable<any>[]) => T;

export class TaroReactiveState<T> extends TaroStateObject<T> {
    dependencies: TaroStateObservable<any>[];
    transformer: TaroReactiveTransformer<T>;

    constructor(dep: TaroStateObservable<any>[], t: TaroReactiveTransformer<T>) {
        super();
        this.dependencies = dep;
        this.transformer = t;
    }

    getValue() {
        return this.transformer(...this.dependencies);
    }
}

export class NumericStateVar extends TaroBaseMutableState<number> {
    constructor(n: number) {
        super(n);
    }

    increment(n: TaroStateObservable<number>) {
        this.updateValue(this.value + observe(n));
    }
}
