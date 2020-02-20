import Taro from "./taro/core";
import { StateArray, StateValue } from "./taro/state";
import Component, { Props } from "./taro/component";

let names = new StateArray<string>();
let newName = new StateValue('');

class Name extends Component {
    name: string
    constructor (props: Props) {
        super(props);
        this.name = this.props.name;
    }
    render() {
        return <p>{this.name}</p>
    }
}

function application() {
    return (
        <div>
            {names.map(name => <Name name={name} /> )}
            <input placeholder="name" bindValue={newName}></input>
            <button onClick={()=>{
                names.push(newName.read())
                newName.set('');
            }}>Add</button>
            <button onClick={()=>{
                names.set([]);
            }}>Clear</button>
        </div>
    );
}

Taro.setBody(application());
