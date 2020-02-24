import Taro from "./taro/core.js";
import { StateValue, StateDict, StateNumeric } from "./taro/state.js";

let people = new StateDict<string, number>();
let newName = new StateValue('');
let newAge = new StateNumeric(0);

function makePersonList() {
    let entries = people.entries();
    return entries.map(entry=>{
        return <p>name: {entry[0]} age: {entry[1]}</p>
    })
}

function application() {
    return (
        <div>
            {makePersonList()}

            <input placeholder="name" bindValue={newName}></input>
            <input
                placeholder="age"
                bindValue={newAge}
                inputValueTransform={(value: string)=>Number.parseInt(value)}
                updateOnConfirm
            ></input>
            
            <button onClick={()=>{
                people.enter(newName.read(), newAge.read())
                newName.set('');
                newAge.set(0);
            }}>Add</button>

            <button onClick={()=>{
                people.clear();
            }}>Clear</button>

            <button onClick={()=>{
                for (let [name, age] of people.entries()) {
                    age.incr();
                }
            }}>Age everyone</button>
        </div>
    );
}

Taro.setBody(application());
