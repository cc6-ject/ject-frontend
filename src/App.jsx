import React, { Component } from "react";
import "./App.css";
import Menu from "./Menu";
import HomePage from "./HomePage";
import TongueTwisterMenu from "./TongueTwisterMenu";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuHeading: "",
      toggleHomePage: true,
      toggleTongueTwister: false
    };
  }

  toggleHome() {
    this.setState({ menuHeading: "" });
    this.setState({ toggleTongueTwister: false });
    this.setState({ toggleHomePage: true });
  }

  // togglePage(pageBoolean, stateToToggle, toggleBoolean) {
  //   this.toggleState(stateToToggle, toggleBoolean);
  //   this.setState({ pageBoolean: true });
  // }

  toggleState(stateToToggle, pageToRender) {
    if (stateToToggle === "HomePage" && pageToRender === "TongueTwist") {
      this.setState({ toggleHomePage: false });
      this.setState({ toggleTongueTwister: true });
      this.setState({ menuHeading: "Tongue Twisters" });
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="Wrapper">
            <Menu
              menuHeading={this.state.menuHeading}
              toggleHome={this.toggleHome.bind(this)}
            />
            {this.state.toggleHomePage ? (
              <HomePage toggleState={this.toggleState.bind(this)} />
            ) : // <HomePage togglePage={this.togglePage.bind(this)} />
            null}
            {this.state.toggleTongueTwister ? <TongueTwisterMenu /> : null}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
