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
  }
});

const tileData = [
  {
    gif: views.projection.GIF,
    still: views.projection.STILL,
    title: views.projection.TITLE,
    description:
      'Projection Practice to learn how to push your voice to the back of the room.'
  },
  {
    gif: views.tongueTwister.GIF,
    still: views.tongueTwister.STILL,
    title: views.tongueTwister.TITLE,
    description:
      'Practice Tongue Twisters 10 times. 10 times was recommended by professional opera singer.'
  },
  {
    gif: views.activity.GIF,
    still: views.activity.STILL,
    title: views.activity.TITLE,
    description: 'Activity history what you have done.'
  },
  {
    gif: views.karaoke.GIF,
    still: views.karaoke.STILL,
    title: views.karaoke.TITLE,
    description:
      'Karaoke mode is to practice thinking on your feet. Given random 5 picture and topic to talk about for 5 minutes.'
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
    this.setState(
      {
        imagePlays
      },
      console.log(JSON.stringify(this.state))
    );
  };

  render() {
    const { classes, switchView } = this.props;
    const { imagePlays } = this.state;

    return (
      <div className={classes.gridRoot}>
        <GridList cellHeight={400} className={classes.gridList}>
          {tileData.map((tile, index) => (
            <GridListTile key={index}>
              {/* {`TEST!!!! ${imagePlays[index] ? tile.img : tile.gif}`} */}
              {tile.still}
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
