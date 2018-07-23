import "../node_modules/grommet-css";

import React from "react";
import ReactDOM from "react-dom";
import ThreeRenderer from "./threeRenderer";

import Button from "grommet/components/Button";
import Box from "grommet/components/Box";
import SyncIcon from "grommet/components/icons/base/Sync";

const divStyle = {
  border: "red",
  borderStyle: "solid",
  borderWidth: "1px",
  flexDirection: "column",
  flex: 1,
  display: "flex"
};

const pico8Palette = [
  0x000000,
  0x1d2b53,
  0x7e2553,
  0x008751,
  0xab5236,
  0x5f574f,
  0xc2c3c7,
  0xfff1e8,
  0xff004d,
  0xffa300,
  0xffec27,
  0x00e436,
  0x29adff,
  0x83769c,
  0xff77a8,
  0xffccaa
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPaletteIndex: 0
    };
    this.handleSculptClick = this.handleSculptClick.bind(this);
    this.handleColorizeClick = this.handleColorizeClick.bind(this);
    this.handleChangeColorClick = this.handleChangeColorClick.bind(this);
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
    } else if (keyCode === 67) {
      if (this.threeRendererRef) this.threeRendererRef.colorize();
    }
  }

  handleSculptClick() {
    if (this.threeRendererRef) this.threeRendererRef.sculpt();
  }

  handleColorizeClick() {
    if (this.threeRendererRef) this.threeRendererRef.colorize();
  }

  handleChangeColorClick() {
    this.setState({ currentPaletteIndex: 3 });
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
            onClick={() => this.handleSculptClick()}
          />
          <Button
            icon={<SyncIcon />}
            onClick={() => this.handleChangeColorClick()}
          />
          <Button
            fill={true}
            label="(C)olorize"
            onClick={() => this.handleColorizeClick()}
          />
        </Box>
        <ThreeRenderer
          palette={pico8Palette}
          paletteIndex={this.state.currentPaletteIndex}
          ref={el => (this.threeRendererRef = el)}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
