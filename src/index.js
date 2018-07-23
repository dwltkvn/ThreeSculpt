import "../node_modules/grommet-css";

import React from "react";
import ReactDOM from "react-dom";
import ThreeRenderer from "./threeRenderer";

import Button from "grommet/components/Button";
import Box from "grommet/components/Box";

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
    this.handleKey = this.handleKey.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKey);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKey);
  }

  handleKey(e) {
    const keyCode = e.which;
    if (keyCode === 83) {
      if (this.threeRendererRef) this.threeRendererRef.sculpt();
    }
  }

  handleClick() {
    if (this.threeRendererRef) this.threeRendererRef.sculpt();
  }

  render() {
    return (
      <div className="App" style={divStyle}>
        <Box
          full="horizontal"
          direction="row"
          separator="all"
          justify="center"
          responsive={false}
        >
          <Button
            fill={true}
            label="(S)culpt"
            onClick={() => this.handleClick()}
          />
          <Button
            fill={true}
            label="(C)olorize"
            onClick={() => this.handleClick()}
          />
        </Box>
        <ThreeRenderer ref={el => (this.threeRendererRef = el)} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
