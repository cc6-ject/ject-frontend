import React from "react";
import "./App.css";
import Menu from "./Menu";
import HomePage from "./HomePage";
import TongueTwisterMenu from "./TongueTwisterMenu";
import ProjectionMenu from "./ProjectionMenu";
import ChallengeMenu from "./ChallengeMenu";
import Login from "./Login";
import { Auth } from "aws-amplify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuHeading: "",
      toggleHomePage: true,
      toggleTongueTwister: false,
      toggleProjection: false,
      toggleChallenge: false,
      isTryLogin: false,
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };
  toggleLogin = () => {
    this.setState({ isTryLogin: !this.state.isTryLogin });
  };

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

  handleLogin = () => {
    this.setState({ isTryLogin: true });
  };
  handleLogout = async () => {
    console.log("HI logout");
    this.setState({ isTryLogin: false });
    await Auth.signOut();
    this.userHasAuthenticated(false);
  };

  render() {
    console.log(this.state);
    return (
      !this.state.isAuthenticating && (
        <div className="App">
          <header className="App-header">
            <div className="Wrapper">
              <Menu
                menuHeading={this.state.menuHeading}
                toggleHome={this.toggleHome.bind(this)}
                isTryLogin={this.state.isTryLogin}
                handleLogin={this.handleLogin}
                handleLogout={this.handleLogout}
                isAuthenticated={this.state.isAuthenticated}
              />
              {this.state.isTryLogin ? (
                <Login
                  userHasAuthenticated={this.userHasAuthenticated}
                  isAuthenticated={this.state.isAuthenticated}
                  toggleLogin={this.toggleLogin}
                />
              ) : null}

              {!this.state.isTryLogin && this.state.toggleHomePage ? (
                <HomePage
                  toggleState={this.toggleState.bind(this)}
                  toggleProjection={this.state.toggleProjection}
                  toggleTongueTwister={this.state.toggleTongueTwister}
                  toggleChallenge={this.state.toggleChallenge}
                />
              ) : null}
              {!this.state.isTryLogin && this.state.toggleTongueTwister ? (
                <TongueTwisterMenu />
              ) : null}
              {!this.state.isTryLogin && this.state.toggleProjection ? (
                <ProjectionMenu />
              ) : null}
              {!this.state.isTryLogin && this.state.toggleChallenge ? (
                <ChallengeMenu />
              ) : null}
            </div>
          </header>
        </div>
      )
    );
  }
}

export default App;
