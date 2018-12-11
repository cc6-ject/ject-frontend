import React from 'react';
import './App.css';
import Menu from './Menu';
import HomePage from './HomePage';
import TongueTwisterMenu from './TongueTwisterMenu';
import TongueTwisterPractice from './TongueTwisterPractice';
import ProjectionMenu from './ProjectionMenu';
import ChallengeMenu from './ChallengeMenu';
import Login from './Login';
import Signup from './Signup';
import { Auth } from 'aws-amplify';
import config from './config';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuHeading: '',
      toggleHomePage: true,
      toggleTongueTwister: false,
      toggleProjection: false,
      toggleChallenge: false,
      isTryLogin: false,
      isTrySignin: false,
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  // Check if user is already logined and load FB SDK
  async componentDidMount() {
    this.loadFacebookSDK();

    try {
      await Auth.currentAuthenticatedUser();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
      console.log(e);
    }
    this.setState({ isAuthenticating: false });
  }

  loadFacebookSDK() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: config.social.FB,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.1'
      });
    };

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  toggleLogin = () => {
    this.setState({ isTryLogin: !this.state.isTryLogin });
    this.setState({ isTrySignin: false });
  };
  handleLogout = async () => {
    this.setState({ isTryLogin: false });
    await Auth.signOut();
    this.userHasAuthenticated(false);
  };

  toggleSignup = () => {
    this.setState({ isTrySignin: !this.state.isTrySignin });
    this.setState({ isTryLogin: false });
  };

  toggleHome() {
    this.setState({ menuHeading: '' });
    this.setState({ toggleChallenge: false });
    this.setState({ toggleTongueTwister: false });
    this.setState({ toggleProjection: false });
    this.setState({ toggleHomePage: true });
    this.setState({ isTryLogin: false });
    this.setState({ isTrySignin: false });
  }

  // react wants you to build keys, but not use them
  toggleState(pageHeading, pageToRender) {
    const key = 'toggle' + pageToRender;
    this.setState({ toggleHomePage: false });
    this.setState({ [key]: true });
    this.setState({ menuHeading: pageHeading });
  }

  render() {
    const isAunthenticating = !this.state.isTryLogin && !this.state.isTrySignin;
    return (
      !this.state.isAuthenticating && (
        <div className="App">
          <header className="App-header">
            <div className="Wrapper">
              <Menu
                menuHeading={this.state.menuHeading}
                toggleHome={this.toggleHome.bind(this)}
                isTryLogin={this.state.isTryLogin}
                isTrySignin={this.state.isTrySignin}
                toggleLogin={this.toggleLogin}
                handleLogout={this.handleLogout}
                toggleSignup={this.toggleSignup}
                isAuthenticated={this.state.isAuthenticated}
              />
              {this.state.isTryLogin ? (
                <Login
                  userHasAuthenticated={this.userHasAuthenticated}
                  isAuthenticated={this.state.isAuthenticated}
                  toggleLogin={this.toggleLogin}
                />
              ) : null}
              {this.state.isTrySignin ? (
                <Signup
                  toggleSignup={this.toggleSignup}
                  toggleLogin={this.toggleLogin}
                  userHasAuthenticated={this.userHasAuthenticated}
                />
              ) : null}

              {isAunthenticating && this.state.toggleHomePage ? (
                <HomePage
                  toggleState={this.toggleState.bind(this)}
                  toggleProjection={this.state.toggleProjection}
                  toggleTongueTwister={this.state.toggleTongueTwister}
                  toggleChallenge={this.state.toggleChallenge}
                />
              ) : null}
              {isAunthenticating && this.state.toggleTongueTwister ? (
                <TongueTwisterPractice />
              ) : null}
              {isAunthenticating && this.state.toggleProjection ? (
                <ProjectionMenu />
              ) : null}
              {isAunthenticating && this.state.toggleChallenge ? (
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
