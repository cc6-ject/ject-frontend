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
import classNames from 'classnames';
import DrawerMenuItems from './DrawerMenuItems';
import { LOGO, views } from './Constants';

const drawerWidth = 200;
const styles = theme => ({
  root: {
    flexGrow: 1
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
  toolbar: theme.mixins.toolbar,
  appBar: {
    padding: '5px 5%'
  },
  center: {
    textAlign: 'center'
  }
});

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawerOpen: false,
      titleHide: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    // TODO: What is this meaning?
    // https://stackoverflow.com/questions/44480053/how-to-detect-if-screen-size-has-changed-to-mobile-in-react?rq=1
    this.handleWindowResize();
  }

  handleDrawerToggle = open => {
    this.setState({ drawerOpen: open });
  };

  handleWindowResize = () => {
    // for md
    this.setState({
      titleHide: window.innerWidth < 768
    });
  };

  render() {
    const {
      classes,
      switchView,
      currentView,
      isAuthenticated,
      onLogout
    } = this.props;
    const { drawerOpen, titleHide } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
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
            {!titleHide ? (
              <Fragment>
                <img src={LOGO} alt="Logo" style={{ height: 40 }} />
                <Button
                  color="inherit"
                  onClick={() => switchView(views.home.TITLE)}
                >
                  <Typography variant="h6" color="inherit">
                    Ject
                  </Typography>
                </Button>
              </Fragment>
            ) : null}
            <Typography
              variant="h6"
              color="inherit"
              className={classNames(classes.grow, classes.center)}
            >
              {currentView}
            </Typography>
            {isAuthenticated ? (
              <Fragment>
                {!titleHide ? (
                  <IconButton color="inherit">
                    <AccountCircle />
                  </IconButton>
                ) : null}
                <Button color="inherit" onClick={onLogout}>
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

export default withStyles(styles)(Navbar);
