import { StateValue, Const, StateArray } from "./state";

export class Reactive extends StateValue<any> {
    dependencies: StateValue<any>[] = [];
    reaction: (...depValues: any)=>any;
    constructor(reaction: (...depValues: any)=>any, ...dependencies: StateValue<any>[]) {
        super(null);
        this.dependencies = dependencies;
        for (let dep of dependencies) {
            dep.subscribe(this.refresh.bind(this))
        }
        this.reaction = reaction;
        this.refresh();
    }

    refresh() {
        let dependentValues = this.dependencies.map(dep=>dep.read());
        //console.log(dependentValues,this.reaction(...dependentValues))
        this.set(this.reaction(...dependentValues));
    }
}

type operand = StateValue<any> | number | string;

function constTypeCoerce(x: operand) {
    if (x instanceof StateValue) {
        return x;
    }
    return new Const(x);
}

// uhhh basically just a wrapper for Reactive
export function stateExpr(stateArgs: StateValue<any>[], expr: (...values: any)=>any) {
    return new Reactive(expr, ...stateArgs);
}

export function singleStateExpr<T>(state: StateValue<T>, expr: (state: T)=>any) {
    return new Reactive(expr, state);
}

export function add(a: operand, b: operand) {
    [a,b] = [constTypeCoerce(a), constTypeCoerce(b)];
    return new Reactive((a: any, b: any)=>a+b, a, b);
}

export function sub(a: operand, b: operand) {
    [a,b] = [constTypeCoerce(a), constTypeCoerce(b)];
    return new Reactive((a: any, b: any)=>a-b, a, b);
}

export function mul(a: operand, b: operand) {
    [a,b] = [constTypeCoerce(a), constTypeCoerce(b)];
    return new Reactive((a: any, b: any)=>a*b, a, b);
}

export function div(a: operand, b: operand) {
    [a,b] = [constTypeCoerce(a), constTypeCoerce(b)];
    return new Reactive((a: any, b: any)=>a/b, a, b);
}

export function eq(a: operand, b: operand) {
    [a,b] = [constTypeCoerce(a), constTypeCoerce(b)];
    return new Reactive((a: any, b: any)=>a==b, a, b);
}

export function lt(a: operand, b: operand) {
    [a,b] = [constTypeCoerce(a), constTypeCoerce(b)];
    return new Reactive((a: any, b: any)=>a<b, a, b);
}

export function gt(a: operand, b: operand) {
    [a,b] = [constTypeCoerce(a), constTypeCoerce(b)];
    return new Reactive((a: any, b: any)=>a>b, a, b);
}

export function ternary(condition: StateValue<boolean>, a: any, b: any) {
    [a,b] = [constTypeCoerce(a), constTypeCoerce(b)];
    return new Reactive((cd: any, a: any, b: any)=>(cd ? a : b), condition, a, b);
}