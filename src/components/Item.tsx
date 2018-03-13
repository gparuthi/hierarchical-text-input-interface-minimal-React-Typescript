import * as React from "react";
import { NodeHolder } from "../store/NodeHolder";

type Context = {
    node: NodeHolder,
    onclick: any
}

type Props = {
    node: NodeHolder,
    context: Context
}
type State = {
    title: "hello"
}

export class Item extends React.Component<Props, any> {
    _input:any

    constructor(props: Props) {
        super(props);
        this.state = {
            node: props.node
        };
        this.handleChange = this.handleChange.bind(this);
        this._handleRef = this._handleRef.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidUpdate() {
        if (this.props.context.node.tid==this.props.node.tid) {
            this._input.focus()
        }   
    }
    componentDidMount() {
        this._input.focus();
    }
    handleChange(event: any) {
        this.state.node.title = event.target.value
        this.setState({node: this.state.node})
    }
    _handleRef(c:any) {
        this._input = c;
    }
    handleClick(e:any){
        this.props.context.onclick(this.state.node)
    }
    render() {
            var liClassName = ((a: number) => {
                switch (a) {
                    case 2: return "indent1"
                    case 3: return "indent2"
                    case 4: return "indent3"
                    default: return "indent0"
                }
            })(this.state.node.depth)

            liClassName += " item"
            return (
                <li className={liClassName} key={this.state.node.tid}>
                    <input ref={this._handleRef} 
                    className="itemText" 
                    value={this.state.node.title} 
                    onChange={this.handleChange} 
                        onClick={this.handleClick}
                    type="title" id="hiddenInput"></input>
                </li>)
    }
}