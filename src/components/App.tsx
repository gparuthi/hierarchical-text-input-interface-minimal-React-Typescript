import * as React from "react";
import { NodeList } from "./NodeList";

export class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <NodeList />
    }
}