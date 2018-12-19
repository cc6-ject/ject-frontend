import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { views } from './Constants';

const DrawerMenuItems = ({ toggleDrawer, switchView }) => (
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
            {/* TODO: Icon? */}
            <ListItemText primary={views[key].TITLE} />
          </ListItem>
        ))}
    </List>
  </div>
);

export default DrawerMenuItems;
