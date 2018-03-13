import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/App";
import { NodeHolder } from "./store/NodeHolder";

ReactDOM.render(
    <App id="container" />,
    document.getElementById("example")
);