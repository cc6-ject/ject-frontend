import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

class HomePage extends Component {
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
          <Grid item xs={4}>
            <Paper
              className={classes.paper}
              onClick={this.props.toggleState.bind(
                this,
                'Projection Practice',
                'Projection'
              )}
            >
              Practice Projection
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              className={classes.paper}
              onClick={this.props.toggleState.bind(
                this,
                'Tongue Twisters',
                'TongueTwister'
              )}
            >
              Tounge Twisters
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              className={classes.paper}
              onClick={this.props.toggleState.bind(
                this,
                'Challenge Mode',
                'Challenge'
              )}
            >
              Challenge Mode
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
