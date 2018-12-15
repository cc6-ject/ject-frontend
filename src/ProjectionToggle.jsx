import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

class ProjectionToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const {
      isFinish,
      isListen,
      avgDecibels,
      handleClick,
      handleClose
    } = this.props;
    return (
      <div className="ProjectionToggle">
        {isFinish ? (
          <Typography variant="h5" gutterBottom>
            AVG dB {avgDecibels[avgDecibels.length - 1]}
          </Typography>
        ) : (
          <br />
        )}
        {!isListen ? (
          <Fab
            color="secondary"
            className={classes.fab}
            onClick={() => handleClick()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            </svg>
          </Fab>
        ) : (
          <Fab
            color="secondary"
            className={classes.fab}
            onClick={() => handleClose()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
            </svg>
          </Fab>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ProjectionToggle);
