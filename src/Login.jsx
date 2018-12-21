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
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '100px 5% 5px 5%'
  }
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: ''
    };
  }

  handleChange = e => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  validateForm = () => {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    const { onLogin } = this.props;
    const { email, password } = this.state;

    try {
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

  render() {
    const { classes, onLogin } = this.props;
    const { email, password, isLoading, errorMessage } = this.state;

    return (
      <div className={classes.root}>
        <List className={classes.center}>
          <ListItem>
            <FacebookButton onLogin={onLogin} className={classes.center} />
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
                      <LoaderButton
                        type="submit"
                        disabled={!this.validateForm()}
                        isLoading={isLoading}
                        text="Login"
                        loadingText="Loggin in..."
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
            </form>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
