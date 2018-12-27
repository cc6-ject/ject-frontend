import React, { Component } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Button,
  Typography,
  List,
  ListItem,
  IconButton
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { API, Auth } from 'aws-amplify';
import config from './config';
import { play as playSound, APPLAUSE, TICK } from './lib/sound';
import { getRandomCompliment, randomKaraokeTitle, views } from './Constants';
import Description from './Description';
import AudioTool from './lib/AudioTool';

const KARAOKE_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  TALKING: 'talking',
  COMPLETE: 'complete'
};

const IS_PRODUCTION = config.state === 'prod';
const TALKING_COUNT_DOWN = 300;
const TALKING_COUNT_DOWN_DELAY = IS_PRODUCTION ? 1000 : 200; // 5-min : 1-min
const STARTING_COUNT_DOWN = 5;
const STARTING_COUNT_DOWN_DELAY = 1000;
const STEP_TYPE_TEXT = 'stepText';
const STEP_TYPE_IMAGE = 'stepImage';
const STEP_MAX = 7;

const styles = {
  startingCountDown: {
    fontWeight: 'bold'
  },
  fs400: {
    fontSize: 400
  },
  fs250: {
    fontSize: 250
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
    padding: 20,
    color: '#fff'
  },
  cardContent: {
    padding: 20,
    display: 'flex',
    flexFlow: 'column'
  },
  talkingImage: {
    borderRadius: 10
  },
  root: {
    padding: '100px 5% 5px 5%'
  },
  w100p: {
    width: '100%'
  },
  w60p: {
    width: '60%'
  },
  ar: {
    textAlign: 'right'
  },
  ac: {
    textAlign: 'center'
  },
  mbt10p: {
    marginTop: '10%',
    marginBottom: '10%'
  }
};

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
      compliment: '',
      descriptionOpen: true,
      isPhone: false
    };

    this.stepIndex = 0;
    this.audioTool = new AudioTool();
    this.timerId = null;
  }

  async componentDidMount() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    try {
      // TODO: be passed from component.
      const data = await Auth.currentAuthenticatedUser();
      this.setState({ username: data.id });
    } catch (error) {
      console.log(error);
    }

    this.audioTool.openAudio(
      () => {
        console.log('Audio was opened.');
      },
      () => {
        console.log('Audio was not opened.');
      }
    );
    await this.initialize();
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
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
          this.timerId = setTimeout(this.countDown, STARTING_COUNT_DOWN_DELAY);
        }
        break;
      case KARAOKE_STATE.TALKING:
        talkingCountDown--;
        if (talkingCountDown < 1) {
          playSound(APPLAUSE);
          this.updateKaraokeState(KARAOKE_STATE.COMPLETE);
        } else {
          this.updateStep(talkingCountDown);
          this.timerId = setTimeout(this.countDown, TALKING_COUNT_DOWN_DELAY);
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
        this.timerId = setTimeout(this.countDown, STARTING_COUNT_DOWN_DELAY);
        break;
      case KARAOKE_STATE.TALKING:
        talkingCountDown = TALKING_COUNT_DOWN;
        this.audioTool.startListening();
        this.timerId = setTimeout(this.countDown, TALKING_COUNT_DOWN_DELAY);
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

  handleDescriptionOpen = () => {
    this.setState({
      descriptionOpen: true
    });
  };

  handleDescriptionClose = () => {
    this.setState({
      descriptionOpen: false
    });
  };

  handleWindowResize = () => {
    const isPhone = window.innerWidth < 768;
    this.setState({ isPhone });
  };

  renderIdle() {
    const { isLoading, isPhone } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Button
          color="secondary"
          disabled={isLoading}
          variant="contained"
          onClick={() => this.updateKaraokeState(KARAOKE_STATE.STARTING)}
        >
          <Typography
            variant={isPhone ? 'h4' : 'h2'}
            className={classNames(classes.startButton)}
          >
            {isLoading ? 'Loading...' : 'Start'}
          </Typography>
        </Button>
      </div>
    );
  }

  renderStarting() {
    const { classes } = this.props;
    const { startingCountDown, isPhone } = this.state;

    return (
      <div>
        <Typography
          className={classNames(
            classes.startingCountDown,
            isPhone ? classes.fs250 : classes.fs400
          )}
        >
          {startingCountDown}
        </Typography>
      </div>
    );
  }

  renderTalking() {
    const { talkingCountDown, steps, isPhone } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.flexCenter}>
          <Typography variant={isPhone ? 'h6' : 'h4'}>
            {`0${Math.floor(talkingCountDown / 60)} : ${
              talkingCountDown % 60 < 10 ? `0` : ``
            }${talkingCountDown % 60}`}
          </Typography>
        </div>
        {this.stepIndex === 0 || this.stepIndex === STEP_MAX - 2 ? (
          <Typography
            variant={isPhone ? 'h6' : 'h4'}
            className={classes.mbt10p}
          >
            {steps[this.stepIndex].data}
          </Typography>
        ) : (
          <div>
            <img
              className={classNames(
                classes.talkingImage,
                isPhone ? classes.w100p : classes.w60p
              )}
              src={`data:image/jpeg;base64,${steps[this.stepIndex].data}`}
              alt="Random Topic"
            />
          </div>
        )}
      </div>
    );
  }

  renderComplete() {
    const { classes, switchView } = this.props;
    const { compliment, isPhone } = this.state;
    let avgDb = this.audioTool.getAvgDecibel();
    avgDb = Number.isNaN(avgDb) ? 0 : Math.round(avgDb);
    const wordsPerEachMinute = this.audioTool.getWordsPerEachMinute();
    let avgWpm =
      wordsPerEachMinute.reduce((acc, wpm) => acc + wpm, 0) /
      wordsPerEachMinute.length;
    avgWpm = Number.isNaN(avgWpm) ? 0 : Math.round(avgWpm);

    return (
      <div className={classes.flexColumn}>
        <div className={classes.flexCenter}>
          <Typography variant={isPhone ? 'h6' : 'h4'}>{compliment}</Typography>
        </div>
        <div className={classNames(classes.flexCenter, classes.mt50)}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => this.updateKaraokeState(KARAOKE_STATE.IDLE)}
          >
            <Typography
              variant={isPhone ? 'h4' : 'h2'}
              className={classNames(classes.startButton)}
            >
              OK
            </Typography>
          </Button>
        </div>
        <div className={classNames(classes.flexCenter, classes.mt50)}>
          <List>
            <ListItem button>
              <Typography variant={isPhone ? 'h6' : 'h4'}>
                AVG dB: {avgDb}
              </Typography>
            </ListItem>
            <ListItem button>
              <Typography variant={isPhone ? 'h6' : 'h4'}>
                AVG WPM: {avgWpm}
              </Typography>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                onClick={() => switchView(views.activity.TITLE)}
              >
                <Typography variant={isPhone ? 'h6' : 'h4'}>
                  Go to Activity
                </Typography>
              </Button>
            </ListItem>
          </List>
        </div>
      </div>
    );
  }

  render() {
    const { karaokeState, descriptionOpen } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Card>
          <CardContent
            className={classNames(classes.flexCenter, classes.cardContent)}
          >
            <div className={classes.ar}>
              <IconButton style={{ padding: 0 }}>
                <Info onClick={this.handleDescriptionOpen} />
              </IconButton>
            </div>
            <div className={classes.ac}>
              {karaokeState === KARAOKE_STATE.IDLE
                ? this.renderIdle()
                : karaokeState === KARAOKE_STATE.STARTING
                ? this.renderStarting()
                : karaokeState === KARAOKE_STATE.TALKING
                ? this.renderTalking()
                : karaokeState === KARAOKE_STATE.COMPLETE
                ? this.renderComplete()
                : null}
            </div>
          </CardContent>
        </Card>
        <Description
          open={descriptionOpen}
          onClose={this.handleDescriptionClose}
          viewTitle={views.karaoke.TITLE}
        />
      </div>
    );
  }
}

export default withStyles(styles)(KaraokeMenu);
