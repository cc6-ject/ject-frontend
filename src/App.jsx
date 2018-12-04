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
  toggleState(stateToToggle, toggleBoolean) {
    if (stateToToggle === "HomePage") {
      this.setState({ toggleHomePage: toggleBoolean });
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="Wrapper">
            <Menu toggleState={this.toggleState.bind(this)} />
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
