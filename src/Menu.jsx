import React, { Fragment } from 'react';

import SideTab from './SideTab';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
    marginBottom: 24
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleLogin: true,
      toggleDrawer: false,
      toggleSignup: false
    };
  }
  toggleDrawer = open => {
    this.setState({ toggleDrawer: open });
  };

  render() {
    const { classes } = this.props;
    const props = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              onClick={() => {
                this.toggleDrawer(true);
              }}
            >
              <MenuIcon
                onClick={() => {
                  this.toggleDrawer(true);
                }}
              />
            </IconButton>
            <Drawer
              open={this.state.toggleDrawer}
              onClose={() => {
                this.toggleDrawer(false);
              }}
              style={{
                contentContainer: {
                  height: 100,
                  backgroundColor: 'black'
                }
              }}
            >
              <SideTab toggleDrawer={this.toggleDrawer} />
            </Drawer>
            <Typography
              onClick={props.toggleHome}
              variant="h6"
              color="inherit"
              className={classes.grow}
            >
              Ject
            </Typography>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {this.props.menuHeading}
            </Typography>
            {props.isAuthenticated ? (
              <Button color="inherit" onClick={props.handleLogout}>
                LOGOUT
              </Button>
            ) : (
              <Fragment>
                <Button color="inherit" onClick={props.toggleSignup}>
                  SIGNUP
                </Button>
                <Button color="inherit" onClick={props.toggleLogin}>
                  LOGIN
                </Button>
              </Fragment>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Menu);
