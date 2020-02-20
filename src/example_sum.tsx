import Taro from "./taro/core";
import { StateNumeric, StateValue } from "./taro/state";
import { add, ternary, gt, stateExpr } from "./taro/reactive";

let a = new StateNumeric();
let b = new StateNumeric();

let sum = add(a, b);

function application() {
    return (
        <div>
            <div>
                <p>A: {a}</p>
                <button onClick={a.updateFunction(n => n - 1)}>(-)</button>
                <button onClick={a.updateFunction(n => n + 1)}>(+)</button>
            </div>
            <div>
                <p>B: {b}</p>
                <button onClick={b.updateFunction(n => n - 1)}>(-)</button>
                <button onClick={b.updateFunction(n => n + 1)}>(+)</button>
            </div>
            <p>A+B = {sum}</p>
            <p>
                {stateExpr([sum], sum =>
                    sum > 10 ? "wow a+b is very large" : null
                )}
            </p>
        </div>
    );
}

Taro.setBody(application());
