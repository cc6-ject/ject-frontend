import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: 500
  }
});

class HomePage extends Component {
  constructor(props) {
    super(props);
  }
  //methods go here

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
            <Paper className={classes.paper}>Practice Projection</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>Tounge Twisters</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>Challenge Mode</Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
