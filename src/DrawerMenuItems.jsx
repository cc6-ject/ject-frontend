import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import {
  Home,
  RecordVoiceOver,
  InsertEmoticon,
  TrendingUp,
  Replay5
} from '@material-ui/icons';
import { views } from './Constants';

const styles = () => ({
  itemDiv: {
    display: 'flex',
    'align-items': 'center'
  },
  item: {
    // display: 'inline-block',
    padding: '0 24px',
    fontWeight: 500,
    '& svg': {
      fontSize: 20
    }
  },
  itemIcon: {
    // display: 'inline-block',
    margin: 0
    // margin: 0
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
                <Divider />
              </ListItem>
            ))}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(DrawerMenuItems);
