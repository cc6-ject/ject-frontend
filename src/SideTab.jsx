import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
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
          {["Profile", "Starred", "Send email", "Drafts"].map((text, index) => (
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
      // <div>
      //   <MenuIcon
      //     aria-owns={anchorEl ? "simple-menu" : undefined}
      //     aria-haspopup="true"
      //     onClick={this.handleClick}
      //   >
      //     Open Menu
      //   </MenuIcon>
      //   <Menu
      //     id="simple-menu"
      //     anchorEl={anchorEl}
      //     open={Boolean(anchorEl)}
      //     onClose={this.handleClose}
      //   >
      //     <MenuItem onClick={this.handleClose}>Profile</MenuItem>
      //     <MenuItem onClick={this.handleClose}>Settings</MenuItem>
      //     <MenuItem onClick={this.handleClose}>Statistics</MenuItem>
      //   </Menu>
      // </div>
    );
  }
}

export default SideTab;
