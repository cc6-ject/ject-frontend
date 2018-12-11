import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  GridList,
  GridListTile,
  GridListTileBar
} from '@material-ui/core';
import { menus } from './Constants';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 500
  },
  gridRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 200,
    hei1ght: 200
  },
  gridIcon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
});

const tileData = [
  {
    img: menus.projection.IMAGE,
    title: menus.projection.TITLE,
    description: 'Description of Practice Projection...'
  },
  {
    img: menus.tongueTwister.IMAGE,
    title: menus.tongueTwister.TITLE,
    description: 'Description of Tongue Twisters...'
  },
  {
    img: menus.challenge.IMAGE,
    title: menus.challenge.TITLE,
    description: 'Description of Challenge Mode...'
  },
  {
    img: menus.karaoke.IMAGE,
    title: menus.karaoke.TITLE,
    description: 'Description of Karaoke...'
  }
];

const HomePage = ({ classes, switchMenu }) => (
  <div classes={classes.gridRoot}>
    <GridList
      cellHeight={400}
      classes={classes.gridList}
      style={{ paddingLeft: 20, paddingRight: 20 }}
    >
      {tileData.map((tile, index) => (
        <GridListTile key={index}>
          <Button
            style={{ padding: 0 }}
            onClick={() => {
              switchMenu(tile.title);
            }}
          >
            <img src={tile.img} alt={tile.title} />
          </Button>
          <GridListTileBar
            title={tile.title}
            subtitle={<span>{tile.description}</span>}
          />
        </GridListTile>
      ))}
    </GridList>
  </div>
);

export default withStyles(styles)(HomePage);
