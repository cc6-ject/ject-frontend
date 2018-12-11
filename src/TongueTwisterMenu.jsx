import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TongueTwisterPractice from './TongueTwisterPractice';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 500
  }
});

class TongueTwisterMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleTwisterMenu: true,
      togglePractice: false
    };
  }

  togglePractice() {
    this.setState({ toggleTwisterMenu: false });
    this.setState({ togglePractice: true });
  }
  /*eslint-disable*/
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          spacing={24}
        >
          {this.state.toggleTwisterMenu ? (
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="center"
              spacing={24}
            >
              <Grid item xs={4}>
                <Paper
                  className={classes.paper}
                  onClick={this.togglePractice.bind(this)}
                >
                  Random Tounge Twister
                </Paper>
              </Grid>
            </Grid>
          ) : null}
          {this.state.togglePractice ? <TongueTwisterPractice /> : null}
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(TongueTwisterMenu);
