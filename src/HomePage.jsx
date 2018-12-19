import React, { Component } from 'react';
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
  },
  p0: {
    padding: 0
  },
  gridTileBar: {
    backgroundColor: '#000000d0',
    transition: 'background-color 1s ease'
  }
});

const tileData = [
  {
    gif: views.projection.GIF,
    still: views.projection.STILL,
    title: views.projection.TITLE,
    description: 'Learn how to push your voice to the back of the room'
  },
  {
    gif: views.tongueTwister.GIF,
    still: views.tongueTwister.STILL,
    title: views.tongueTwister.TITLE,
    description: 'Practice 10 times recommended by professional opera singer'
  },
  {
    gif: views.karaoke.GIF,
    still: views.karaoke.STILL,
    title: views.karaoke.TITLE,
    description: 'Practice thinking on your feet'
  },
  {
    gif: views.activity.GIF,
    still: views.activity.STILL,
    title: views.activity.TITLE,
    description: 'History what you have done.'
  }
];

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imagePlays: []
    };
  }

  componentDidMount() {
    this.myRef = React.createRef();
  }

  handleImagePlay = (index, play) => {
    const { imagePlays } = this.state;
    imagePlays[index] = play;
    this.setState({
      imagePlays
    });
  };

  render() {
    const { classes, switchView } = this.props;
    const { imagePlays } = this.state;

    return (
      <div className={classes.gridRoot}>
        <GridList cellHeight={400} className={classes.gridList}>
          {tileData.map((tile, index) => (
            <GridListTile key={index}>
              <Button
                className={classes.p0}
                onClick={() => {
                  switchView(tile.title);
                }}
                onMouseEnter={() => this.handleImagePlay(index, true)}
                onMouseLeave={() => this.handleImagePlay(index, false)}
              >
                <img
                  src={imagePlays[index] ? tile.gif : tile.still}
                  alt={tile.title}
                />
              </Button>
              <GridListTileBar
                className={imagePlays[index] ? classes.gridTileBar : null}
                title={tile.title}
                subtitle={<span>{tile.description}</span>}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
