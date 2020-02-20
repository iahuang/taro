import Taro from "./taro/core";
import { StateNumeric, StateValue, StateArray } from "./taro/state";
import { add, ternary, gt, stateExpr, map } from "./taro/reactive";

let names = new StateArray<string>();

function application() {
    return (
        <div>
            {names}
            <button onClick={()=>{
                names.push('lmao')
            }}>Add one</button>
            <button onClick={()=>{
                names.push('lmao')
            }}>Add one</button>
            <button onClick={()=>{
                names.set([]);
            }}>clear</button>
        </div>
    );
}

Taro.setBody(application());
