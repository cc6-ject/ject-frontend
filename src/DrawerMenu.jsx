import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer
} from '@material-ui/core';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';
import DrawerMenuItems from './DrawerMenuItems';
import { LOGO, views } from './Constants';

const drawerWidth = 200;
const styles = theme => ({
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
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  toolbar: theme.mixins.toolbar
});

class DrawerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawerOpen: false
    };
  }

  handleDrawerToggle = open => {
    this.setState({ drawerOpen: open });
  };

  render() {
    const {
      classes,
      switchView,
      currentView,
      isAuthenticated,
      logout
    } = this.props;
    const { drawerOpen } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              onClick={() => {
                this.handleDrawerToggle(true);
              }}
            >
              <MenuIcon />
            </IconButton>
            <img src={LOGO} alt="Logo" style={{ height: 40 }} />
            <Typography
              onClick={() => switchView(views.home.TITLE)}
              variant="h6"
              color="inherit"
              className={classes.grow}
            >
              Ject
            </Typography>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {currentView}
              {currentView.title}
            </Typography>
            {isAuthenticated ? (
              <Fragment>
                <IconButton>
                  <AccountCircle />
                </IconButton>
                <Button color="inherit" onClick={logout}>
                  LOGOUT
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button
                  color="inherit"
                  onClick={() => switchView(views.signUp.TITLE)}
                >
                  SIGN UP
                </Button>
                <Button
                  color="inherit"
                  onClick={() => switchView(views.login.TITLE)}
                >
                  LOGIN
                </Button>
              </Fragment>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          open={drawerOpen}
          onClose={() => {
            this.handleDrawerToggle(false);
          }}
        >
          <DrawerMenuItems
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
            toggleDrawer={this.handleDrawerToggle}
            switchView={switchView}
          />
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(DrawerMenu);
