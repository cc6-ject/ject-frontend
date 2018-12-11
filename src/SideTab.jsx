import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from '@material-ui/core/ListItemText';
// import Divider from "@material-ui/core/Divider";

class SideTab extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    // const { classes } = this.props;
    const props = this.props;

    return (
      <div
        tabIndex={0}
        role="button"
        onClick={() => {
          props.toggleDrawer(false);
        }}
        onKeyDown={() => {
          props.toggleDrawer(false);
        }}
      >
        <List>
          {['Profile', 'Activity', 'Settings'].map((text, index) => (
            <ListItem button key={text}>
              {/* <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        {/* <Divider /> */}
      </div>
    );
  }
}

export default SideTab;
