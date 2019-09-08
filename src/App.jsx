import React, { Component } from 'react';
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';
import { Auth } from 'aws-amplify';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import TongueTwisterMenu from './components/toungueTwister/TongueTwisterMenu';
import ProjectionMenu from './components/projection/ProjectionMenu';
import ChallengeMenu from './components/ChallengeMenu';
import KaraokeMenu from './components/karaoke/KaraokeMenu';
import Activity from './components/activity/Activity';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import { views } from './Constants';
import './assets/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const browserError = !(
      window.webkitSpeechRecognition || window.SpeechRecognition
    );
    this.state = {
      currentView: views.home.TITLE,
      isAuthenticated: false,
      isAuthenticating: false,
      disableAll: browserError,
      dialogOpen: browserError
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

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false
    });
  };

  render() {
    const {
      currentView,
      isAuthenticated,
      isAuthenticating,
      disableAll,
      dialogOpen
    } = this.state;

    return (
      <div className="app">
        <div className="app--header">
          <Navbar
            disabled={disableAll}
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
            <HomePage
              disabled={disableAll}
              switchView={this.handleViewSwitch}
            />
          ) : currentView === views.projection.TITLE ? (
            <ProjectionMenu
              isAuthenticated={isAuthenticated}
              switchView={this.handleViewSwitch}
            />
          ) : currentView === views.tongueTwister.TITLE ? (
            <TongueTwisterMenu
              isAuthenticated={isAuthenticated}
              switchView={this.handleViewSwitch}
            />
          ) : currentView === views.challenge.TITLE ? (
            <ChallengeMenu
              isAuthenticated={isAuthenticated}
              switchView={this.handleViewSwitch}
            />
          ) : currentView === views.karaoke.TITLE ? (
            <KaraokeMenu
              isAuthenticated={isAuthenticated}
              switchView={this.handleViewSwitch}
            />
          ) : currentView === views.activity.TITLE ? (
            <Activity isAuthenticated={isAuthenticated} />
          ) : currentView === views.login.TITLE ? (
            <Login onLogin={this.handleLogin} />
          ) : currentView === views.signUp.TITLE ? (
            <SignUp onLogin={this.handleLogin} />
          ) : null}
          {/* </div> */}
        </div>
        <div className="app--footer">
          <div className="app--footer--container">
            <Typography variant="overline" gutterBottom color="primary">
              Created by Daenam, Matt, Toru @ Code Chrysalis Cohort 6 2018. Ject
              logo made with{' '}
              <a
                href="https://www.designevo.com/en/"
                title="Free Online Logo Maker"
              >
                DesignEvo{' '}
              </a>
              . Menu images with{' '}
              <a
                href="https://dribbble.com/shots"
                title="Beautiful image sources"
              >
                dribbble
              </a>
              .
            </Typography>
          </div>
        </div>
        <Dialog
          open={dialogOpen}
          scroll="paper"
          fullWidth
          onClick={this.handleDialogClose}
        >
          <DialogTitle>Does Not Support This Browser</DialogTitle>
          <DialogContent>Please use the latest Chrome browser.</DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
