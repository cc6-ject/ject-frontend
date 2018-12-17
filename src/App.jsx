import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import Navbar from './Navbar';
import HomePage from './HomePage';
import TongueTwisterMenu from './TongueTwisterMenu';
import ProjectionMenu from './ProjectionMenu';
import ChallengeMenu from './ChallengeMenu';
import KaraokeMenu from './KaraokeMenu';
import Activity from './Activity';
import Login from './Login';
import SignUp from './SignUp';
import { views } from './Constants';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: views.karaoke.TITLE,
      isAuthenticated: false,
      isAuthenticating: false
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentAuthenticatedUser();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'not authenticated') {
        console.log(e);
      }
    }
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogin = async () => {
    this.userHasAuthenticated(true);
    this.handleViewSwitch(views.home.TITLE);
  };

  handleLogout = async () => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
  };

  handleViewSwitch = viewTitle => {
    this.setState({
      currentView: viewTitle
    });
  };

  render() {
    const { currentView, isAuthenticated, isAuthenticating } = this.state;

    return (
      <div className="app">
        <div className="app--header">
          <Navbar
            switchView={this.handleViewSwitch}
            currentView={currentView}
            isAuthenticated={isAuthenticated}
            isAuthenticating={isAuthenticating}
            onLogout={this.handleLogout}
          />
        </div>
        <div className="app--content">
          {/* TODO: React Router DOM */}
          {currentView === views.home.TITLE ? (
            <HomePage switchView={this.handleViewSwitch} />
          ) : currentView === views.projection.TITLE ? (
            <ProjectionMenu isAuthenticated={isAuthenticated} />
          ) : currentView === views.tongueTwister.TITLE ? (
            <TongueTwisterMenu />
          ) : currentView === views.challenge.TITLE ? (
            <ChallengeMenu />
          ) : currentView === views.karaoke.TITLE ? (
            <KaraokeMenu />
          ) : currentView === views.activity.TITLE ? (
            <Activity />
          ) : currentView === views.login.TITLE ? (
            <Login onLogin={this.handleLogin} />
          ) : currentView === views.signUp.TITLE ? (
            <SignUp onLogin={this.handleLogin} />
          ) : null}
          {/* </div> */}
        </div>
        <div className="app--footer">
          <div>
            <Typography variant="overline" gutterBottom color="primary">
              Created by Daenam, Matt, Toru at Code Chrysalis Cohort 6 2018.
            </Typography>
            <Typography variant="overline" gutterBottom color="primary">
              Ject Logo made with{' '}
              <a
                href="https://www.designevo.com/en/"
                title="Free Online Logo Maker"
              >
                DesignEvo
              </a>
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
