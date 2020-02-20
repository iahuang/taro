import Taro from "./taro/core";
import { StateArray, StateValue } from "./taro/state";

let names = new StateArray<string>();
let newName = new StateValue('');

function application() {
    return (
        <div>
            {names.map(name => <p>name: {name}</p> )}
            <input placeholder="name" bindValue={newName}></input>
            <button onClick={()=>{
                names.push('Bob')
            }}>Add</button>
            <button onClick={()=>{
                names.set([]);
            }}>Clear</button>
        </div>
    );
}

Taro.setBody(application());
