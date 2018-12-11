import React, { Component } from 'react';
// import { Auth } from 'aws-amplify';
import DrawerMenu from './DrawerMenu';
import HomePage from './HomePage';
import TongueTwisterMenu from './TongueTwisterMenu';
import ProjectionMenu from './ProjectionMenu';
import ChallengeMenu from './ChallengeMenu';
import KaraokeMenu from './KaraokeMenu';
import Login from './Login';
import SignUp2 from './SignUp2';
// import config from './config';
import { views } from './Constants';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: views.home.TITLE,
      isAuthenticated: false,
      isAuthenticating: false
    };
  }

  // Check if user is already logined and load FB SDK
  async componentDidMount() {
    // TODO: call from libs.
    // this.loadFacebookSDK();
    // try {
    //   await Auth.currentAuthenticatedUser();
    //   this.userHasAuthenticated(true);
    // } catch (e) {
    //   if (e !== 'No current user') {
    //     // alert(e);
    //     console.log(e);
    //   }
    //   console.log(e);
    // }
    // this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogin = async () => {
    console.log('handleLogin');
    // TODO: actual login and authenticating
    // await Auth.signOut();
    this.userHasAuthenticated(true);
  };

  handleLogout = async () => {
    console.log('handleLogout');
    // await Auth.signOut();
    this.userHasAuthenticated(false);
  };

  handleSignUp2 = async () => {
    console.log('handleSignUp2');
    // TODO:
    this.userHasAuthenticated(true);
  };

  handleViewSwitch = viewTitle => {
    this.setState({
      currentView: viewTitle
    });
  };

  // TODO: move to libs.
  // loadFacebookSDK() {
  //   window.fbAsyncInit = function() {
  //     window.FB.init({
  //       appId: config.social.FB,
  //       autoLogAppEvents: true,
  //       xfbml: true,
  //       version: 'v3.1'
  //     });
  //   };

  //   (function(d, s, id) {
  //     const fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) {
  //       return;
  //     }
  //     const js = d.createElement(s);
  //     js.id = id;
  //     js.src = 'https://connect.facebook.net/en_US/sdk.js';
  //     fjs.parentNode.insertBefore(js, fjs);
  //   })(document, 'script', 'facebook-jssdk');
  // }

  render() {
    const { currentView, isAuthenticated, isAuthenticating } = this.state;

    return (
      <div className="app">
        <header className="app-header">
          <div className="wrapper">
            <DrawerMenu
              switchView={this.handleViewSwitch}
              currentView={currentView}
              isAuthenticated={isAuthenticated}
              isAuthenticating={isAuthenticating}
            />
            {/* TODO: React Router DOM */}
            {currentView === views.home.TITLE ? (
              <HomePage switchView={this.handleViewSwitch} />
            ) : currentView === views.projection.TITLE ? (
              <ProjectionMenu />
            ) : currentView === views.tongueTwister.TITLE ? (
              <TongueTwisterMenu />
            ) : currentView === views.challenge.TITLE ? (
              <ChallengeMenu />
            ) : currentView === views.karaoke.TITLE ? (
              <KaraokeMenu />
            ) : currentView === views.login.TITLE ? (
              <Login login={this.handleLogin} />
            ) : currentView === views.signUp.TITLE ? (
              <SignUp2 signUp={this.handleSignUp} />
            ) : null}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
