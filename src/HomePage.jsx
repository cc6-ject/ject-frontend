import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, GridListTile, GridListTileBar } from '@material-ui/core';
import classNames from 'classnames';
import { views } from './Constants';

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: 'inherit',
    padding: '100px 5% 0 5%'
  },
  gridIcon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  p0: {
    padding: 0
  },
  gridListTile: {},
  gridTileBar: {
    backgroundColor: '#000000d0',
    transition: 'background-color 1s ease'
  },
  w100: {
    width: '100%'
  },
  w110: {
    width: '110%'
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
      <div className={classes.root} style={{ style: '100%' }}>
        {tileData.map((tile, index) => (
          <Grid xs={12} md={6}>
            <GridListTile key={index}>
              <Button
                className={classNames(classes.p0, classes.w100)}
                onClick={() => {
                  switchView(tile.title);
                }}
                onMouseEnter={() => this.handleImagePlay(index, true)}
                onMouseLeave={() => this.handleImagePlay(index, false)}
              >
                <img
                  className={classes.w110}
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
          </Grid>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
