![logo](https://github.com/iahuang/taro/raw/master/readme_assets/taro.png)

A web framework inspired by Svelte and ReactJS

# Features

## Declarative UI

Taro makes use of JSX syntax to make the composition of UI elements quick and concise
```jsx
function animalWidget(animal) {
    return (
        <div>
            <img src={animal.thumbnail} alt={"Picture of "+animal.name}>
            <h1>{animal.name}</h1>
            <p>{animal.description}</p>
        </div>
    );
}
```

## Typescript support

Taro itself as a library is written in Typescript, allowing native use with the language without any extra work.

## Reactive State

In Taro, state variables are manipulated using special wrappers called `StateValue`s. Because of this, Taro can detect whenever your app's state is modified and apply the changes in the DOM automatically. Additionally, you can have special states that react to changes in other states. Take the following code, for example:

```jsx
let a = new StateNumeric(1); // StateNumeric is a StateValue specific to number values
let b = new StateNumeric(2);

let sum = add(a, b);
```

When either `a` or `b` is updated, the value of `sum` changes as well. As `a` and `b` are state wrappers, so is `sum`. Hence, all the special behaviors that `a` and `b` exhibit apply to `sum` as well. Likewise, because we are working with *wrappers* around numerical values instead of the values themselves, uses a special `add()` function that is designed to operate on both `StateValues` and regular Javascript values.

# Examples

```tsx
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
