import "./style.css";
import React from "react";
import ReactDOM from "react-dom";
import ThreeRenderer from "./threeRenderer";

const divStyle = {
  border: "red",
  borderStyle: "solid",
  borderWidth: "0px",
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
      currentPaletteIndex: 0,
      stateUndoAvailable: false
    };
    this.handleSculptClick = this.handleSculptClick.bind(this);
    this.handleColorizeClick = this.handleColorizeClick.bind(this);
    this.handleChangeColorClick = this.handleChangeColorClick.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKey);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKey);
  }

  // Keyboard shortcut to sculpt/colorize without having to used action buttons.
  handleKey(e) {
    const keyCode = e.which;
    if (keyCode === 83) {
      if (this.threeRendererRef) this.threeRendererRef.sculpt();
    } else if (keyCode === 67) {
      if (this.threeRendererRef) this.threeRendererRef.colorize();
    }
  }

  // call the ThreeRenderer sculpt() function.
  handleSculptClick() {
    if (this.threeRendererRef) this.threeRendererRef.sculpt();
  }

  // call the ThreeRenderer colorize() function.
  handleColorizeClick() {
    if (this.threeRendererRef) this.threeRendererRef.colorize();
  }

  // change the current color ; increase the current index or cycle back to 0.
  handleChangeColorClick() {
    this.setState(prevState => ({
      currentPaletteIndex:
        (prevState.currentPaletteIndex + 1) % pico8Palette.length
    }));
  }

  handleUndoClick() {
    if (this.threeRendererRef) this.threeRendererRef.undo();
  }

  render() {
    // convert current color value to hex string format + padded up to 6 characters (filled with '0').
    const c = pico8Palette[this.state.currentPaletteIndex]
      .toString(16)
      .padStart(6, "0");

    // button used to change color is displayed with a beackground of the current color.
    const syncButtonStyle = {
      backgroundColor: `#${c}`
    };

    return (
      <ThreeRenderer
        palette={pico8Palette}
        paletteIndex={this.state.currentPaletteIndex}
        ref={el => (this.threeRendererRef = el)}
        cbUndoAvailable={b => this.setState({ stateUndoAvailable: b })}
      />
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
