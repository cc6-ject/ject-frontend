// TODO:
/* eslint-disable */
import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardContent, Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { API, Auth } from 'aws-amplify';
import config from './config';
import { play as playSound, APPLAUSE, TICK } from './libs/sound';
import { getRandomCompliment, randomKaraokeTitle } from './Constants';
import getAverageVolume from './libs/getAverageVolume';

const KARAOKE_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  TALKING: 'talking',
  COMPLETE: 'complete'
};

const PRODUCTION = false;
const TALKING_COUNT_DOWN = PRODUCTION ? 300 : 10;
const TIMER_DELAY = PRODUCTION ? 1000 : 100;
const STARTING_COUNT_DOWN = 5;
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

let audioContext;
let analyser;
let average = 0;
const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
// recognition.continuous = true;
recognition.interimResults = true;
let [transcript, processScript] = ['', ''];

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
      // TODO: TEST ▼▼▼▼
      volume: { transform: 'rotate(0deg)' },
      isListen: false,
      isFinish: false,
      intervalAudioId: null,
      intervalSpeechId: null,
      decibels: [],
      transcripts: [],
      durations: [],
      avgDecibels: [],
      username: '',
      startTime: 0,
      // finishedAt: null,
      // startedAt: null,
      // TODO: TEST ▲▲▲▲▲▲
      karaokeState: KARAOKE_STATE.IDLE,
      isLoading: false,
      compliment: ''
    };
  }

  async componentDidMount() {
    // TODO: be passed from component.
    try {
      const data = await Auth.currentAuthenticatedUser();
      this.setState({ username: data.id });
    } catch (error) {
      console.log(error);
    }
    await this.initialize();
  }

  componentWillUnmount() {
    if (audioContext) this.handleClose();
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

    // TODO: start dB
    // TODO: wait until user approved to use mic.
    console.log('hey!!!');
    const constraint = { audio: true };
    // navigator.getUserMedia(constraint, this.handleSuccess, this.handleError);
    navigator.getUserMedia(constraint, this.handleSuccess, () => alert('fail'));
    // TODO: start transcript

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
      console.log(count, unit * 6, this.stepIndex);
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
        setTimeout(this.countDown, TIMER_DELAY);
        break;
      case KARAOKE_STATE.COMPLETE:
        this.handleClose();
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

  // TEST　▼▼▼▼▼▼
  handleSuccess = stream => {
    const { isListen } = this.state;

    const intervalAudioId = setInterval(() => {
      const { decibels } = this.state;
      this.setState({
        volume: { transform: `rotate(${-180 + 3 * average}deg)` },
        decibels: [...decibels, average]
      });
    }, 500);

    const intervalSpeechId = setInterval(() => {
      const { transcripts } = this.state;
      this.setState({
        transcripts: [...transcripts, transcript]
      });
      transcript = '';
    }, 10000);

    this.setState({ isListen: !isListen, intervalAudioId, intervalSpeechId });

    this.handleSpeech();
    this.handleAudio(stream);
  };

  handleError = error => {
    console.log(`The following error occured: ${error.name}`);
  };

  handleAudio = stream => {
    // Create analyser interface to get frequency and time-domain analysis
    audioContext = new AudioContext();
    console.log('Audio context', typeof audioContext.close);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.maxDecibels = 0;

    // Input is microphone
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    // Pass microphone data to processor
    const processor = audioContext.createScriptProcessor(256, 1, 1);
    analyser.connect(processor);
    processor.connect(audioContext.destination);

    // Do something with streaming PCM data
    processor.onaudioprocess = function() {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      average = getAverageVolume(array);
    };
  };

  handleSpeech = () => {
    const { isListen } = this.state;
    if (isListen) {
      recognition.start();
    }

    recognition.onresult = event => {
      processScript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      if (event.results[0].isFinal) {
        if (transcript === '') {
          transcript = transcript.concat('', processScript);
        } else {
          transcript = transcript.concat('. ', processScript);
        }
        console.log('TRANSCRIPT', transcript);
      }
    };
    recognition.onend = () => {
      const { isListen } = this.state;
      if (isListen) {
        recognition.start();
      }
    };
  };

  handleClose = async () => {
    // TDOO: sometimes handle was not closed?
    console.log('Audio context handleClose', typeof audioContext.close);
    audioContext.close();
    recognition.stop();
    const { decibels, startTime, transcripts } = this.state;

    const sum = decibels.reduce((total, val) => total + val, 0);
    let avgDecibel = sum / decibels.length;
    avgDecibel = Math.floor(avgDecibel * 100) / 100;

    // Sec
    const endTime = performance.now();
    const duration = Math.floor((endTime - startTime) / 1000);

    const { isAuthenticated } = this.props;
    console.log('INIT AWS', isAuthenticated, decibels.length);
    if (isAuthenticated && decibels.length > 1) {
      try {
        // TODO: do some process
        console.log('Before AWS');
        await this.saveToAWS(decibels, avgDecibel, duration, transcripts);
        console.log('After AWS');
      } catch (e) {
        console.log(e.message);
      }
    }

    this.init(avgDecibel, duration);
  };

  saveToAWS = (decibels, avgDecibel, duration, transcripts) => {
    console.log('AWS!!!!!');
    const { username } = this.state;
    const body = {
      avgDecibel: 40,
      countWord: '{"abc":1}',
      createdAt: 1544695930530,
      decibels: '[11,11]',
      finishedAt: 11,
      pics: '["URL1","URL2"]',
      text: 'YEAH',
      userId: 'ap-northeast-1:f141c3c4-f5a5-41b7-a07f-4ee573089f45',
      wpm: 40
    };

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

  init = (avgDecibel, duration) => {
    const {
      isListen,
      intervalAudioId,
      intervalSpeechId,
      avgDecibels,
      durations
    } = this.state;
    // const state = this.state;

    this.setState({
      isListen: !isListen,
      volume: { transform: `rotate(0deg)` },
      decibels: [],
      avgDecibels: [...avgDecibels, avgDecibel],
      transcripts: [],
      durations: [...durations, duration],
      isFinish: true
    });
    transcript = '';
    processScript = '';

    clearInterval(intervalAudioId);
    clearInterval(intervalSpeechId);
  };

  // TEST　▲▲▲▲▲▲▲

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
