import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import {
  List,
  ListItem,
  TextField,
  Card,
  CardContent,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LoaderButton from './LoaderButton';
import FacebookButton from './FacebookButton';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 240
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 240
  },
  center: {
    margin: '0 auto'
  }
});

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null,
      errorMessage: ''
    };
  }

  validateForm = () => {
    const { email, password, confirmPassword } = this.state;
    return (
      email.length > 0 && password.length > 0 && password === confirmPassword
    );
  };

  validateConfirmationForm = () => {
    const { confirmationCode } = this.state;
    return confirmationCode.length > 0;
  };

  handleChange = event => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true, errorMessage: '' });

    const { email, password } = this.state;

    try {
      const newUser = await Auth.signUp(email, password);
      this.setState({ newUser, isLoading: false });
      console.log(newUser);
    } catch (error) {
      this.setState({
        isLoading: false,
        errorMessage: error.message
      });
    }
  };

  handleConfirmationSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    const { email, password, confirmationCode } = this.state;
    const { onLogin } = this.props;

    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      onLogin();
    } catch (error) {
      this.setState({
        isLoading: false,
        errorMessage: error.message
      });
    }
  };

  handleFacebookLogin = () => {
    // TODO: check callback.
    const { onLogin } = this.props;
    onLogin();
  };

  renderForm = () => {
    const { classes } = this.props;
    const {
      email,
      password,
      confirmPassword,
      isLoading,
      errorMessage
    } = this.state;

    return (
      <List className={classes.center}>
        <ListItem>
          <FacebookButton
            onLogin={this.handleFacebookLogin}
            className={classes.center}
          />
        </ListItem>
        <ListItem>
          <Typography
            variant="button"
            gutterBottom
            color="primary"
            className={classes.center}
          >
            OR
          </Typography>
        </ListItem>
        <ListItem>
          <form onSubmit={this.handleSubmit}>
            <Card>
              <CardContent>
                <List>
                  <ListItem>
                    <TextField
                      id="email"
                      label="Email"
                      className={classes.textField}
                      value={email}
                      onChange={this.handleChange}
                      margin="normal"
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      id="password"
                      label="Password"
                      className={classes.textField}
                      value={password}
                      onChange={this.handleChange}
                      margin="normal"
                      type="password"
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      id="confirmPassword"
                      label="Confirm Password"
                      className={classes.textField}
                      value={confirmPassword}
                      onChange={this.handleChange}
                      margin="normal"
                      type="password"
                    />
                  </ListItem>
                  <ListItem>
                    <LoaderButton
                      color="inherit"
                      type="submit"
                      disabled={!this.validateForm()}
                      isLoading={isLoading}
                      text="Sign Up"
                      loadingText="Signing up..."
                    />
                  </ListItem>
                  {errorMessage && errorMessage.length > 0 ? (
                    <ListItem>
                      <Typography variant="overline" gutterBottom color="error">
                        {errorMessage}
                      </Typography>
                    </ListItem>
                  ) : null}
                </List>
              </CardContent>
            </Card>
          </form>
        </ListItem>
      </List>
    );
  };

  renderConfirmationForm = () => {
    const { confirmationCode, isLoading, errorMessage } = this.state;
    const { classes } = this.props;

    return (
      <List className={classes.center}>
        <ListItem>
          <form onSubmit={this.handleConfirmationSubmit}>
            <List>
              <ListItem>
                <Typography
                  noWrap
                  variant="button"
                  gutterBottom
                  color="primary"
                  className={classes.center}
                >
                  Please check your email for the code.
                </Typography>
              </ListItem>
              <Card>
                <CardContent>
                  <List>
                    <ListItem>
                      <TextField
                        id="confirmationCode"
                        label="Confirmation Code"
                        className={classes.textField}
                        value={confirmationCode}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                    </ListItem>
                    <ListItem>
                      <LoaderButton
                        color="inherit"
                        type="submit"
                        disabled={!this.validateConfirmationForm()}
                        isLoading={isLoading}
                        text="Verify"
                        loadingText="Verifying…"
                      />
                    </ListItem>
                    {errorMessage && errorMessage.length > 0 ? (
                      <ListItem>
                        <Typography
                          variant="overline"
                          gutterBottom
                          color="error"
                        >
                          {errorMessage}
                        </Typography>
                      </ListItem>
                    ) : null}
                  </List>
                </CardContent>
              </Card>
            </List>
          </form>
        </ListItem>
      </List>
    );
  };

  render() {
    const { newUser } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {newUser === null ? this.renderForm() : this.renderConfirmationForm()}
      </div>
    );
  }
}

export default withStyles(styles)(SignUp);
