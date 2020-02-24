export type Props = { [name: string]: any };

export default class Component {
    props: Props;
    constructor(props: Props) {
        this.props = props;
    }
    render(): Element {
        throw new Error("Cannot instantiate base Component class");
    }
}