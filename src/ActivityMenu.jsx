import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class ActivityMenu extends React.Component {
  render() {
    const props = this.props;
    return (
      <div>
        <Button
          aria-owns={props.anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={props.handleClick}
        >
          {props.view}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={props.anchorEl}
          open={Boolean(props.anchorEl)}
          onClose={props.handleClose}
        >
          <MenuItem onClick={props.handleClose}>Days</MenuItem>
          <MenuItem onClick={props.handleClose}>Weeks</MenuItem>
          <MenuItem onClick={props.handleClose}>Months</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default ActivityMenu;
