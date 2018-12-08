import React from "react";
import FacebookButton from "./FacebookButton";
import LoaderButton from "./LoaderButton";
import TextField from "@material-ui/core/TextField";
import { Auth } from "aws-amplify";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validataForm = () => {
    const state = this.state;
    return (
      state.email.length > 0 &&
      state.password.length > 0 &&
      state.password === state.confirmPassword
    );
  };

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = e => {
    const key = e.target.id;
    const value = e.target.value;
    this.setState({ [key]: value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ isLoading: true });
    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({ newUser });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  };

  handleConfirmationCode = async e => {
    e.preventDefault();
    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);

      this.props.userHasAuthenticated(true);
      this.props.toggleSignup();
      this.props.toggleLogin();
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  renderConfirmation = () => {
    return;
  };

  handleFbLogin = () => {
    this.props.userHasAuthenticated(true);
  };

  renderForm = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        <FacebookButton onLogin={this.handleFbLogin} />
        <hr />
        <TextField
          id="email"
          label="email"
          value={this.state.email}
          onChange={this.handleChange}
          margin="normal"
        />
        <TextField
          id="password"
          label="password"
          value={this.state.password}
          onChange={this.handleChange}
          margin="normal"
        />
        <TextField
          id="confirmPassword"
          label="confirmPassword"
          value={this.state.confirmPassword}
          onChange={this.handleChange}
          margin="normal"
        />
        <LoaderButton
          color="inherit"
          type="submit"
          disabled={!this.validataForm()}
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up..."
        />
      </form>
    );
  };

  renderConfirmationForm = () => {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        Please check your email for the code.
        <TextField
          id="confirmationCode"
          label="confirmationCode"
          value={this.state.confirmationCode}
          onChange={this.handleChange}
          margin="normal"
        />
        <LoaderButton
          color="inherit"
          type="submit"
          disabled={!this.validateConfirmationForm()}
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  };

  render() {
    console.log(this.state);
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}

export default Signup;
