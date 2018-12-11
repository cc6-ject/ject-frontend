import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  GridList,
  GridListTile,
  GridListTileBar
} from '@material-ui/core';
import { views } from './Constants';

const styles = () => ({
  root: {
    flexGrow: 1
  },
  gridRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: 'inherit'
  },
  gridList: {
    width: '100%'
    // height: 600,
  },
  gridIcon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
});

const tileData = [
  {
    img: views.projection.IMAGE,
    title: views.projection.TITLE,
    description: 'Description of Practice Projection...'
  },
  {
    img: views.tongueTwister.IMAGE,
    title: views.tongueTwister.TITLE,
    description: 'Description of Tongue Twisters...'
  },
  {
    img: views.challenge.IMAGE,
    title: views.challenge.TITLE,
    description: 'Description of Challenge Mode...'
  },
  {
    img: views.karaoke.IMAGE,
    title: views.karaoke.TITLE,
    description: 'Description of Karaoke...'
  }
];

const HomePage = ({ classes, switchView }) => (
  <div className={classes.gridRoot}>
    <GridList
      cellHeight={400}
      className={classes.gridList}
      style={{ paddingLeft: 20, paddingRight: 20 }}
    >
      {tileData.map((tile, index) => (
        <GridListTile key={index}>
          <Button
            style={{ padding: 0 }}
            onClick={() => {
              switchView(tile.title);
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
