import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import {
  Home,
  RecordVoiceOver,
  InsertEmoticon,
  TrendingUp,
  Replay5
} from '@material-ui/icons';
import { views, LOGO } from './Constants';

const styles = () => ({
  logoDiv: {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'flex-start'
  },
  logoText: {
    padding: '0 24px',
    fontWeight: 1000
  },
  logo: {
    width: '50px',
    height: '50px'
  },
  itemIcon: {
    margin: 0
  },

  itemDiv: {
    display: 'flex',
    'align-items': 'center'
  },
  item: {
    padding: '0 24px',
    fontWeight: 500,
    '& svg': {
      fontSize: 20
    }
  }
});

class DrawerMenuItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, toggleDrawer, switchView } = this.props;
    return (
      <div className="side-drawer">
        <List>
          <ListItem>
            <div className={classes.logoDiv}>
              <ListItemIcon className={classes.itemIcon}>
                <img src={LOGO} alt="logo" className={classes.logo} />
              </ListItemIcon>
              <Typography className={classes.logoText} variant="h6">
                JECT
              </Typography>
            </div>
          </ListItem>
          <Divider />
          {Object.keys(views)
            .filter(
              key =>
                views[key].TITLE !== 'Login' &&
                views[key].TITLE !== 'Sign Up' &&
                views[key].TITLE !== 'Challenge'
            )
            .map((key, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  toggleDrawer(false);
                  switchView(views[key].TITLE);
                }}
              >
                <div className={classes.itemDiv}>
                  <ListItemIcon className={classes.itemIcon}>
                    {key === 'home' ? (
                      <Home />
                    ) : key === 'projection' ? (
                      <RecordVoiceOver />
                    ) : key === 'tongueTwister' ? (
                      <InsertEmoticon />
                    ) : key === 'karaoke' ? (
                      <Replay5 />
                    ) : (
                      <TrendingUp />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    className={classes.item}
                    primary={views[key].TITLE}
                  />
                </div>
              </ListItem>
            ))}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(DrawerMenuItems);
