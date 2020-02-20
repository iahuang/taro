import Taro from "./taro/core";
import { StateArray, StateValue, StateDict } from "./taro/state";

let people = new StateDict<string, number>();
let newName = new StateValue('');
let newAge = new StateValue<number | null>(null);

function makePersonList() {
    let entries = people.entries();
    return entries.map(_entry=>{
        let entry = _entry.read()
        return <p>name: {entry[0]} age: {entry[1]}</p>
    })
}

function application() {
    return (
        <div>
            {makePersonList()}

            <input placeholder="name" bindValue={newName}></input>
            <input placeholder="age" bindValue={newAge}></input>
            
            <button onClick={()=>{
                people.enter(newName.read(), newAge.read() as number)
                newName.set('');
            }}>Add</button>

            <button onClick={()=>{
                people.clear();
            }}>Clear</button>

            
        </div>
    );
}

Taro.setBody(application());
