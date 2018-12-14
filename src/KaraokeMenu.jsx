import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardContent, Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import config from './config';
import { getRandomCompliment, randomKaraokeTitle } from './Constants';

const KARAOKE_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  TALKING: 'talking',
  COMPLETE: 'complete'
};

const STARTING_COUNT_DOWN = 5;
const TALKING_COUNT_DOWN = 300;
// const TIMER_DELAY = 1000;
const TIMER_DELAY = 80;
const STEP_TYPE_TEXT = 'stepText';
const STEP_TYPE_IMAGE = 'stepImage';
const STEP_MAX = 7;

const styles = {
  startingCountDown: {
    fontSize: 500,
    fontWeight: 'bold'
  },
  flexColumn: {
    display: 'flex',
    flexFlow: 'column'
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  mt50: {
    marginTop: 50
  },
  mt200: {
    marginTop: 200
  },
  startButton: {
    width: 300,
    height: 150,
    fontSize: 50,
    color: '#fff'
  },
  cardContent: {
    height: 700,
    padding: 50
  },
  talkingImage: {
    borderRadius: 10
  }
};

class KaraokeMenu extends Component {
  constructor(props) {
    super(props);

    this.stepIndex = 0;
    // TODO: get db values
    this.state = {
      startingCountDown: STARTING_COUNT_DOWN,
      talkingCountDown: TALKING_COUNT_DOWN,
      steps: [],
      // fillers: {},
      // wordsPerMin: [],
      // stringPerMin: [],
      // finishedAt: null,
      karaokeState: KARAOKE_STATE.IDLE,
      isLoading: false
    };
  }

  async componentDidMount() {
    await this.initializeSteps();
  }

  initializeSteps = () => {
    const { randomImage } = config;
    // For async process, it sets a buffer first.
    const steps = Array(7).fill('');
    const axiosConfig = {
      responseType: 'arraybuffer'
    };

    this.stepIndex = 0;
    this.setState({
      isLoading: true
    });

    for (let i = 0; i < STEP_MAX; i++) {
      const newStep = {};
      if (i === 0) {
        newStep.type = STEP_TYPE_TEXT;
        newStep.data = randomKaraokeTitle();
        steps[i] = newStep;
      } else if (i === STEP_MAX - 2) {
        newStep.type = STEP_TYPE_TEXT;
        newStep.data = 'In Conclusion';
        steps[i] = newStep;
      } else {
        newStep.type = STEP_TYPE_IMAGE;
        axios
          .get(randomImage.URL, axiosConfig)
          .then(response => {
            const { data } = response;
            // FIXME: deprecated.
            /* eslint-disable no-buffer-constructor */
            newStep.data = new Buffer(data, 'binary').toString('base64');
            /* eslint-enable no-buffer-constructor */
            steps[i] = newStep;
            this.setState({
              steps,
              isLoading: false
            });
          })
          .catch(error => {
            console.log(error);
            this.setState({
              isLoading: false
            });
          });
      }
    }
  };

  updateStep = count => {
    const unit = Math.floor(TALKING_COUNT_DOWN / STEP_MAX);
    if (count <= unit * (STEP_MAX - 1) && count % unit === 0) {
      console.log(count, unit * 6, this.stepIndex);
      this.stepIndex++;
    }
  };

  countDown = () => {
    let { startingCountDown, talkingCountDown } = this.state;
    const { karaokeState } = this.state;
    switch (karaokeState) {
      case KARAOKE_STATE.STARTING:
        // TODO: play tick sound.
        startingCountDown--;
        if (startingCountDown < 1) {
          this.updateKaraokeState(KARAOKE_STATE.TALKING);
        } else {
          setTimeout(this.countDown, TIMER_DELAY);
        }
        break;
      case KARAOKE_STATE.TALKING:
        talkingCountDown--;
        if (talkingCountDown < 1) {
          // TODO: play applouse
          this.updateKaraokeState(KARAOKE_STATE.COMPLETE);
        } else {
          this.updateStep(talkingCountDown);
          setTimeout(this.countDown, TIMER_DELAY);
        }
        break;
      default:
    }

    this.setState({
      startingCountDown,
      talkingCountDown
    });
  };

  updateKaraokeState = karaokeState => {
    let { startingCountDown, talkingCountDown } = this.state;

    switch (karaokeState) {
      case KARAOKE_STATE.IDLE:
        startingCountDown = STARTING_COUNT_DOWN;
        talkingCountDown = TALKING_COUNT_DOWN;
        this.initializeSteps();
        break;
      case KARAOKE_STATE.STARTING:
        startingCountDown = STARTING_COUNT_DOWN;
        setTimeout(this.countDown, TIMER_DELAY);
        break;
      case KARAOKE_STATE.TALKING:
        talkingCountDown = TALKING_COUNT_DOWN;
        setTimeout(this.countDown, TIMER_DELAY);
        break;
      default:
    }

    this.setState({
      karaokeState,
      startingCountDown,
      talkingCountDown
    });
  };

  renderIdle() {
    const { isLoading } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Button
          className={classNames(classes.startButton, classes.mt200)}
          disabled={isLoading}
          color="secondary"
          variant="contained"
          onClick={() => this.updateKaraokeState(KARAOKE_STATE.STARTING)}
        >
          {isLoading ? 'Loading...' : 'Start'}
        </Button>
      </div>
    );
  }

  renderStarting() {
    const { classes } = this.props;
    const { startingCountDown } = this.state;

    return (
      <div>
        <Typography
          component="h1"
          variant="h1"
          className={classNames(classes.startingCountDown)}
        >
          {startingCountDown}
        </Typography>
      </div>
    );
  }

  renderTalking() {
    const { talkingCountDown, steps } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.flexCenter}>
          <Typography variant="h3">
            {`0${Math.floor(talkingCountDown / 60)} : ${
              talkingCountDown % 60 < 10 ? `0` : ``
            }${talkingCountDown % 60}`}
          </Typography>
        </div>
        {this.stepIndex === 0 || this.stepIndex === STEP_MAX - 2 ? (
          <Typography variant="h3" className={classes.mt200}>
            {steps[this.stepIndex].data}
          </Typography>
        ) : (
          <div>
            <img
              className={classes.talkingImage}
              src={`data:image/jpeg;base64,${steps[this.stepIndex].data}`}
              alt="Random Topic"
            />
          </div>
        )}
      </div>
    );
  }

  renderComplete() {
    const { classes } = this.props;

    return (
      <div className={classes.flexColumn}>
        <div className={classes.flexCenter}>
          <Typography variant="h3">{getRandomCompliment()}</Typography>
        </div>
        <div className={classNames(classes.flexCenter, classes.mt50)}>
          <Button
            className={classes.startButton}
            color="secondary"
            variant="contained"
            onClick={() => this.updateKaraokeState(KARAOKE_STATE.IDLE)}
          >
            OK
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { karaokeState } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Card>
          <CardContent
            className={classNames(classes.flexCenter, classes.cardContent)}
          >
            {karaokeState === KARAOKE_STATE.IDLE
              ? this.renderIdle()
              : karaokeState === KARAOKE_STATE.STARTING
              ? this.renderStarting()
              : karaokeState === KARAOKE_STATE.TALKING
              ? this.renderTalking()
              : karaokeState === KARAOKE_STATE.COMPLETE
              ? this.renderComplete()
              : null}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(KaraokeMenu);
