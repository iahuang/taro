import { Taro } from "../src/taro";
import "../src/taro/react_typings";

function App() {
    let a = Taro.state.number(1);
    let b = Taro.state.number(1);
    let c = Taro.add(a, b);
    (window as any).vars = [a, b];
    return (
        <div>
            <h1>TaroJS Example Project</h1>
            <div>
                Edit <code>app.tsx</code> to get started.
            </div>
            <div>
                A: {a} <button onClick={() => a.increment(1)}>Add one</button>
            </div>
            <div>
                B: {b} <button onClick={() => b.increment(1)}>Add one</button>
            </div>
            <div>A plus B: {c} </div>
            <div>A plus one: {Taro.add(a, 1)} </div>
        </div>
    );
}

Taro.render(App(), document.body);
