import React from "react";
import ReactDOM from "react-dom";
import ThreeRenderer from "./threeRenderer";

const divStyle = {
  border: "red",
  borderStyle: "solid",
  borderWidth: "1px",
  //flexDirection: "column",
  flex: 0.9,
  display: "flex"
};
function App() {
  return (
    <div className="App" style={divStyle}>
      <ThreeRenderer />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
