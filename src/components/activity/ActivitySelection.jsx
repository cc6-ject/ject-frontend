import React from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import '../../assets/Activity.css';

const styles = () => ({
  button: {
    margin: 20
  }
});

class ActivitySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      classes,
      activity,
      activityAnchorEl,
      handleActivityClick,
      handleActivityClose
    } = this.props;
    return (
      <div className="activitySelection">
        <Button
          variant="contained"
          className={classes.button}
          aria-owns={activityAnchorEl ? 'activity-menu' : undefined}
          aria-haspopup="true"
          onClick={handleActivityClick}
        >
          {activity}
        </Button>
        <Menu
          id="activity-menu"
          anchorEl={activityAnchorEl}
          open={Boolean(activityAnchorEl)}
          onClose={handleActivityClose}
        >
          <MenuItem onClick={handleActivityClose}>Projection</MenuItem>
          <MenuItem onClick={handleActivityClose}>Tongue Twister</MenuItem>
          <MenuItem onClick={handleActivityClose}>Karaoke</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(ActivitySelection);
