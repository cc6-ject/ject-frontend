import React from "react";
import "./App.css";
import Menu from "./Menu";
import HomePage from "./HomePage";
import TongueTwisterMenu from "./TongueTwisterMenu";
import ProjectionMenu from "./ProjectionMenu";
import ChallengeMenu from "./ChallengeMenu";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuHeading: "",
      toggleHomePage: true,
      toggleTongueTwister: false,
      toggleProjection: false,
      toggleChallenge: false
    };
  }

  toggleHome() {
    this.setState({ menuHeading: "" });
    this.setState({ toggleChallenge: false });
    this.setState({ toggleTongueTwister: false });
    this.setState({ toggleProjection: false });
    this.setState({ toggleHomePage: true });
  }

  // react wants you to build keys, but not use them
  toggleState(pageHeading, pageToRender) {
    const key = "toggle" + pageToRender;
    this.setState({ toggleHomePage: false });
    this.setState({ [key]: true });
    this.setState({ menuHeading: pageHeading });
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
              <HomePage
                toggleState={this.toggleState.bind(this)}
                toggleProjection={this.state.toggleProjection}
                toggleTongueTwister={this.state.toggleTongueTwister}
                toggleChallenge={this.state.toggleChallenge}
              />
            ) : null}
            {this.state.toggleTongueTwister ? <TongueTwisterMenu /> : null}
            {this.state.toggleProjection ? <ProjectionMenu /> : null}
            {this.state.toggleChallenge ? <ChallengeMenu /> : null}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
