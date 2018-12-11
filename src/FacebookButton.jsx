import React from 'react';
import { Auth } from 'aws-amplify';
import LoaderButton from './LoaderButton';

function waitForInit() {
  return new Promise((res, rej) => {
    const hasFbLoaded = () => {
      if (window.FB) {
        res();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

class FacebookButton extends React.Component {
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

  handleError(error) {
    alert(error);
  }

  async handleResponse(data) {
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };

    this.setState({ isLoading: true });

    try {
      const response = await Auth.federatedSignIn(
        'facebook',
        { token, expires_at },
        user
      );
      this.setState({ isLoading: false });
      this.props.onLogin(response);
      this.props.toggleLogin();
    } catch (e) {
      this.setState({ isLoading: false });
      this.handleError(e);
    }
  }

  render() {
    return (
      <LoaderButton
        color="inherit"
        disabled={this.state.isLoading}
        handleClick={this.handleClick}
        text="Login with Facebook"
      />
    );
  }
}

export default FacebookButton;
