import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './config';
import './index.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4A6572',
      main: '#344955',
      dark: '#344955',
      contrastText: '#fff'
    },
    secondary: {
      main: '#F9AA33',
      contrastText: '#000'
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Work Sans'
  }
});

// AWS configuration
// TODO: move to libs.
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: 'ject',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

// Facebook login init.
// TODO: move to libs.
const loadFacebookSDK = () => {
  window.fbAsyncInit = function() {
    window.FB.init({
      appId: config.social.facebook.ID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v3.1'
    });
  };

  (function(d, s, id) {
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    const js = d.createElement(s);
    js.id = id;
    js.src = config.social.facebook.URL;
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
};
loadFacebookSDK();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
