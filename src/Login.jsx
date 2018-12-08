import React from "react";
import LoaderButton from "./LoaderButton";
import FacebookButton from "./FacebookButton";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false
    };
  }

  handleChange = e => {
    const key = e.target.id;
    const value = e.target.value;
    this.setState({ [key]: value });
  };
  validataForm = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true });

    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);

      alert("Logged in");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
    this.props.toggleLogin();
  };

  handleFbLogin = () => {
    this.props.userHasAuthenticated(true);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <FacebookButton
          onLogin={this.handleFbLogin}
          toggleLogin={this.props.toggleLogin}
        />
        <br />
        <form onSubmit={this.handleSubmit}>
          <TextField
            id="email"
            label="email"
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange}
            margin="normal"
          />
          <TextField
            id="password"
            label="password"
            className={classes.textField}
            value={this.state.password}
            onChange={this.handleChange}
            margin="normal"
          />
          <LoaderButton
            color="inherit"
            type="submit"
            disabled={!this.validataForm()}
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Loggin in..."
          />
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
