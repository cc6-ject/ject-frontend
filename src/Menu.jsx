import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleLogin: true,
      toggleSettings: true
    };
  }
  //methods go here

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{ marginBottom: 50 }}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={() =>
                this.setState({ toggleSettings: !this.state.toggleSettings })
              }
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Ject
            </Typography>
            <Button
              color="inherit"
              onClick={() =>
                this.setState({ toggleLogin: !this.state.toggleLogin })
              }
            >
              {this.state.toggleLogin ? "Login" : "Logout"}
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Menu);
