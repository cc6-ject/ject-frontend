/* eslint-disable */
import React from 'react';
// import TextField from '@material-ui/core/TextField';
// import { Auth } from 'aws-amplify';
// import { List, ListItem } from '@material-ui/core';
// import LoaderButton from './LoaderButton';
// import FacebookButton from './FacebookButton';

class SignUp2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isLoading: false,
      // email: '',
      // password: '',
      // confirmPassword: '',
      // confirmationCode: '',
      // newUser: null
    };
  }

  // validateForm = () => {
  //   const { email, password, confirmPassword } = this.state;
  //   console.log(
  //     email.length > 0 && password.length > 0 && password === confirmPassword
  //   );
  //   return (
  //     email.length > 0 && password.length > 0 && password === confirmPassword
  //   );
  // };

  // validateConfirmationForm() {
  //   return this.state.confirmationCode.length > 0;
  // }

  // handleChange = e => {
  //   console.log(e.target.id, e.target.value);
  //   const key = e.target.id;
  //   const value = e.target.value;
  //   this.setState({ [key]: value });
  // };

  // handleSubmit = async e => {
  //   e.preventDefault();

  //   this.setState({ isLoading: true });
  //   try {
  //     const newUser = await Auth.signUp({
  //       username: this.state.email,
  //       password: this.state.password
  //     });
  //     this.setState({ newUser });
  //   } catch (e) {
  //     // alert(e.message);
  //   }
  //   this.setState({ isLoading: false });
  // };

  // handleConfirmationCode = async e => {
  //   e.preventDefault();
  //   this.setState({ isLoading: true });

  //   try {
  //     await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
  //     await Auth.signIn(this.state.email, this.state.password);

  //     this.props.userHasAuthenticated(true);
  //     this.props.toggleSignup();
  //     this.props.toggleLogin();
  //   } catch (e) {
  //     // alert(e.message);
  //     this.setState({ isLoading: false });
  //   }
  // };

  // renderConfirmation = () => {};

  // handleFbLogin = () => {
  //   this.props.userHasAuthenticated(true);
  // };

  // renderForm = () => (
  //   <div
  //     className="sign-up-input"
  //     style={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //       justifyContent: 'center'
  //     }}
  //   >
  //     <List
  //       style={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //         justifyContent: 'center',
  //         margin: '0 auto'
  //       }}
  //     >
  //       <ListItem>
  //         <FacebookButton
  //           onLogin={this.handleFbLogin}
  //           toggleLogin={this.props.toggleSignup}
  //         />
  //       </ListItem>
  //       <ListItem>
  //         <form onSubmit={this.handleSubmit}>
  //           <List>
  //             <ListItem>
  //               <TextField
  //                 id="email"
  //                 label="email"
  //                 value={this.state.email}
  //                 onChange={this.handleChange}
  //                 margin="normal"
  //               />
  //             </ListItem>
  //             <ListItem>
  //               <TextField
  //                 id="password"
  //                 label="password"
  //                 value={this.state.password}
  //                 onChange={this.handleChange}
  //                 margin="normal"
  //                 type="password"
  //               />
  //             </ListItem>
  //             <ListItem>
  //               <TextField
  //                 id="confirmPassword"
  //                 label="confirmPassword"
  //                 value={this.state.confirmPassword}
  //                 onChange={this.handleChange}
  //                 margin="normal"
  //                 type="password"
  //               />
  //             </ListItem>
  //             <ListItem>
  //               <LoaderButton
  //                 color="inherit"
  //                 type="submit"
  //                 disabled={!this.validateForm()}
  //                 isLoading={this.state.isLoading}
  //                 text="Sign Up"
  //                 loadingText="Signing up..."
  //               />
  //             </ListItem>
  //           </List>
  //         </form>
  //       </ListItem>
  //     </List>
  //   </div>
  // );

  // renderConfirmationForm = () => (
  //   <form onSubmit={this.handleConfirmationSubmit}>
  //     Please check your email for the code.
  //     <TextField
  //       id="confirmationCode"
  //       label="confirmationCode"
  //       value={this.state.confirmationCode}
  //       onChange={this.handleChange}
  //       margin="normal"
  //     />
  //     <LoaderButton
  //       color="inherit"
  //       type="submit"
  //       disabled={!this.validateConfirmationForm()}
  //       isLoading={this.state.isLoading}
  //       text="Verify"
  //       loadingText="Verifying…"
  //     />
  //   </form>
  // );

  render() {
    return (
      <div className="sign-up">
        {/* {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()} */}
      </div>
    );
  }
}

export default SignUp2;
