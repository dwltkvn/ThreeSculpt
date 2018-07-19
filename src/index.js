import React from "react";
import ReactDOM from "react-dom";
import ThreeRenderer from "./threeRenderer";

function App() {
  return (
    <div className="App">
      <ThreeRenderer />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
