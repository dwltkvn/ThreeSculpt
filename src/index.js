import "../node_modules/grommet-css";

import React from "react";
import ReactDOM from "react-dom";
import ThreeRenderer from "./threeRenderer";

import Button from "grommet/components/Button";

const divStyle = {
  border: "red",
  borderStyle: "solid",
  borderWidth: "1px",
  flexDirection: "column",
  flex: 1,
  display: "flex"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.threeRendererRef) this.threeRendererRef.sculpt();
  }

  render() {
    return (
      <div className="App" style={divStyle}>
        <ThreeRenderer ref={el => (this.threeRendererRef = el)} />
        <Button label="Sculpt" onClick={() => this.handleClick()} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
