import React, { Component } from "react";
import "./App.css";
import Menu from "./Menu";
import HomePage from "./HomePage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleHomePage: true
    };
  }
  toggleState(stateToToggle) {
    if (stateToToggle === "HomePage") {
      this.setState({ toggleHomePage: !this.state.toggleHomePage });
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="Wrapper">
            <Menu />
            {this.state.toggleHomePage ? (
              <HomePage toggleState={this.toggleState.bind(this)} />
            ) : null}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
