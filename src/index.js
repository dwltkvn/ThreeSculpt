import "../node_modules/grommet-css";
import "./style.css";
import React from "react";
import ReactDOM from "react-dom";
import ThreeRenderer from "./threeRenderer";

import Button from "grommet/components/Button";
import Responsive from "grommet/utils/Responsive";

import SyncIcon from "grommet/components/icons/base/Sync";
import EditIcon from "grommet/components/icons/base/Edit";
import TroisDIcon from "grommet/components/icons/base/3d";
import DownloadIcon from "grommet/components/icons/base/Download";
import RevertIcon from "grommet/components/icons/base/Revert";

const divStyle = {
  border: "red",
  borderStyle: "solid",
  borderWidth: "0px",
  flexDirection: "column",
  flex: 1.0,
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
    this._onResponsive = this._onResponsive.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKey);
    this._responsive = Responsive.start(this._onResponsive);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKey);
    this._responsive.stop();
  }

  // callback used to determine if current screen display is small or large.
  _onResponsive(small) {
    this.setState({ small });
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
      <div className="App" style={divStyle}>
        <div className="headerDivStyle">
          {/* Scultp button, callback to handleSculptClick(), doesn't display its text if on small screen */}
          <Button
            icon={<TroisDIcon />}
            label={this.state.small ? null : "(S)culpt"}
            onClick={() => this.handleSculptClick()}
          />
          {/* Not used yet */}
          <Button icon={<RevertIcon />} />
          {/* Apply color button, callback to handleColorizeClick(), doesn't display its text if on small screen */}
          <Button
            icon={<EditIcon />}
            label={this.state.small ? null : "(C)olorize"}
            onClick={() => this.handleColorizeClick()}
          />
          {/* Change current color */}
          <Button
            style={syncButtonStyle}
            icon={<SyncIcon />}
            onClick={() => this.handleChangeColorClick()}
          />
          {/* Not used yet */}
          <Button
            icon={<DownloadIcon />}
            label={this.state.small ? null : "Export"}
          />
        </div>
        {/* The 3D view display
            - props palette contain an array of available colors
            - props paletteIndex contain current selected color index
            - ref is used to expose sculpt() and colorize() functions, which can be invoked by action buttons.
        */}
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
