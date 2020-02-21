![logo](https://github.com/iahuang/taro/raw/master/readme_assets/taro.png)

A web framework inspired by Svelte and ReactJS

## Examples

```js
import Taro from "./taro/core";
import { StateNumeric, } from "./taro/state";
import { add, stateExpr } from "./taro/reactive";

let a = new StateNumeric(0);
let b = new StateNumeric(0);

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
```

# Comparison with React

![logo](https://github.com/iahuang/taro/raw/master/readme_assets/compare.png)

## Result

![result](https://github.com/iahuang/taro/raw/master/readme_assets/compare_result.png)
