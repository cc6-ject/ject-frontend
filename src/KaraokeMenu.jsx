import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardContent, Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { API, Auth } from 'aws-amplify';
import config from './config';
import { play as playSound, APPLAUSE, TICK } from './lib/sound';
import { getRandomCompliment, randomKaraokeTitle } from './Constants';
import AudioTool from './lib/AudioTool';

const KARAOKE_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  TALKING: 'talking',
  COMPLETE: 'complete'
};

const PRODUCTION = true;
const TALKING_COUNT_DOWN = PRODUCTION ? 300 : 20;
const TIMER_DELAY = PRODUCTION ? 1000 : 1000;
const STARTING_COUNT_DOWN = PRODUCTION ? 5 : 1;
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

const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
// recognition.continuous = true;
recognition.interimResults = true;

class KaraokeMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startingCountDown: STARTING_COUNT_DOWN,
      talkingCountDown: TALKING_COUNT_DOWN,
      steps: [],
      // fillers: {},
      // wordsPerMin: [],
      // stringPerMin: [],
      karaokeState: KARAOKE_STATE.IDLE,
      isLoading: false,
      compliment: ''
    };

    this.stepIndex = 0;
    this.audioTool = new AudioTool();
  }

  async componentDidMount() {
    try {
      // TODO: be passed from component.
      const data = await Auth.currentAuthenticatedUser();
      this.setState({ username: data.id });
    } catch (error) {
      console.log(error);
    }

    this.audioTool.openAudio(() => {
      console.log('Audio was opened.');
    });
    await this.initialize();
  }

  componentWillUnmount() {
    this.audioTool.closeAudio(() => {
      console.log('Audio was closed.');
    });
  }

  initialize = () => {
    this.setState({
      isLoading: true
    });
    new Promise(resolve => {
      resolve();
    })
      .then(() => this.initializeSteps())
      .then(() => {
        this.setState({
          isLoading: false,
          compliment: getRandomCompliment()
        });
      })
      .catch();

    this.initializeSteps();
  };

  initializeSteps = () => {
    const { randomImage } = config;
    // For async process, it sets a buffer first.
    const steps = Array(7).fill('');
    const axiosConfig = {
      responseType: 'arraybuffer'
    };

    this.stepIndex = 0;
    const promises = [];
    for (let i = 0; i < STEP_MAX; i++) {
      const newStep = {};
      if (i === 0) {
        const promise = new Promise(resolve => {
          newStep.type = STEP_TYPE_TEXT;
          newStep.data = randomKaraokeTitle();
          steps[i] = newStep;
          resolve(STEP_TYPE_TEXT);
        });
        promises.push(promise);
      } else if (i === STEP_MAX - 2) {
        const promise = new Promise(resolve => {
          newStep.type = STEP_TYPE_TEXT;
          newStep.data = 'In Conclusion';
          steps[i] = newStep;
          resolve(STEP_TYPE_TEXT);
        });
        promises.push(promise);
      } else {
        const promise = new Promise(resolve => {
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
              this.setState(
                {
                  steps
                },
                resolve(STEP_TYPE_IMAGE)
              );
            })
            .catch(error => {
              console.log(error);
            });
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  };

  updateStep = count => {
    const unit = Math.floor(TALKING_COUNT_DOWN / STEP_MAX);
    if (count <= unit * (STEP_MAX - 1) && count % unit === 0) {
      // console.log(count, unit * 6, this.stepIndex);
      this.stepIndex++;
    }
  };

  countDown = () => {
    let { startingCountDown, talkingCountDown } = this.state;
    const { karaokeState } = this.state;
    switch (karaokeState) {
      case KARAOKE_STATE.STARTING:
        playSound(TICK);
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
          playSound(APPLAUSE);
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

  updateKaraokeState = async karaokeState => {
    let { startingCountDown, talkingCountDown } = this.state;

    switch (karaokeState) {
      case KARAOKE_STATE.IDLE:
        startingCountDown = STARTING_COUNT_DOWN;
        talkingCountDown = TALKING_COUNT_DOWN;
        await this.initialize();
        break;
      case KARAOKE_STATE.STARTING:
        startingCountDown = STARTING_COUNT_DOWN;
        setTimeout(this.countDown, TIMER_DELAY);
        break;
      case KARAOKE_STATE.TALKING:
        talkingCountDown = TALKING_COUNT_DOWN;
        this.audioTool.startListening();
        setTimeout(this.countDown, TIMER_DELAY);
        break;
      case KARAOKE_STATE.COMPLETE:
        this.audioTool.stopListening(async () => {
          const body = {
            avgDecibel: this.audioTool.getAvgDecibel(),
            decibels: this.audioTool.getDecibels(),
            pics: [] /* FIXME: error happens when adding base64 images, steps.map((step, index) =>
              !(index === 0 || index === STEP_MAX - 2) ? step.data : undefined
            ) */,
            wordsPerEachMinute: this.audioTool.getWordsPerEachMinute(),
            fillerWords: this.audioTool.getFillerWords(),
            wordCounts: this.audioTool.getWordCounts(),
            transcripts: this.audioTool.getTranscripts(),
            duration: this.audioTool.getDuration(),
            startedAt: this.audioTool.getStartedAt(),
            finishedAt: this.audioTool.getFinishedAt()
          };

          console.log(body);
          try {
            await this.saveToAWS(body);
          } catch (e) {
            console.log(e.message);
          }
        });
        break;
      default:
    }

    console.log(karaokeState);
    this.setState({
      karaokeState,
      startingCountDown,
      talkingCountDown
    });
  };

  // TODO: make a lib file.
  saveToAWS = body => {
    const { username } = this.state;
    // TODO: set these as constants
    API.post('ject', '/karaoke', {
      body,
      requestContext: {
        identity: {
          cognitoIdentityId: username
        }
      }
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
    const { compliment } = this.state;

    return (
      <div className={classes.flexColumn}>
        <div className={classes.flexCenter}>
          <Typography variant="h3">{compliment}</Typography>
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
