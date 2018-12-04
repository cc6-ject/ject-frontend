import React, { Component } from "react";
import "./App.css";
import Menu from "./Menu";
import HomePage from "./HomePage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="Wrapper">
            <Menu />
            <HomePage />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
