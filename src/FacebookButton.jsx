import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import LoaderButton from './LoaderButton';

function waitForInit() {
  return new Promise(resolve => {
    const hasFbLoaded = () => {
      if (window.FB) {
        resolve();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

export default class FacebookButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  // Init FB SDK => Can LOGIN!
  async componentDidMount() {
    await waitForInit();
    this.setState({ isLoading: false });
  }

  statusChangeCallback = response => {
    if (response.status === 'connected') {
      this.handleResponse(response.authResponse);
    } else {
      this.handleError(response);
    }
  };

  checkLoginState = () => {
    window.FB.getLoginStatus(this.statusChangeCallback);
  };

  handleClick = () => {
    window.FB.login(this.checkLoginState, { scope: 'public_profile,email' });
  };

  handleError = () => {};

  async handleResponse(data) {
    const { email, accessToken: token, expiresIn } = data;
    const expiresAt = expiresIn * 1000 + new Date().getTime();
    const user = { email };
    const { onFacebookLogin, onLogin } = this.props;

    this.setState({ isLoading: true });

    try {
      const response = await Auth.federatedSignIn(
        'facebook',
        { token, expiresAt },
        user
      );
      this.setState({ isLoading: false });
      onFacebookLogin(response);
      onLogin();
    } catch (e) {
      this.setState({ isLoading: false });
      this.handleError(e);
    }
  }

  render() {
    const { isLoading } = this.state;

    return (
      <LoaderButton
        className="FacebookButton"
        disabled={isLoading}
        handleClick={this.handleClick}
        text="Login with Facebook"
        customColor="facebook"
      />
    );
  }
}
