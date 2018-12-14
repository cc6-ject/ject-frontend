import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardContent, Button } from '@material-ui/core';
import config from './config';

const KARAOKE_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  TALKING: 'talking',
  COMPLETE: 'complete'
};

const STARTING_COUNT_DOWN = 1;
const TALKING_COUNT_DOWN = 10;
// const TIMER_DELAY = 1000;
const TIMER_DELAY = 1000;
const STEP_TYPE_TEXT = 'stepText';
const STEP_TYPE_IMAGE = 'stepImage';
const STEP_MAX = 7;

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
        newStep.data = 'Title';
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

  render() {
    const {
      steps,
      karaokeState,
      startingCountDown,
      talkingCountDown,
      isLoading
    } = this.state;

    return (
      <div>
        <Card>
          <CardContent>
            {karaokeState === KARAOKE_STATE.IDLE ? (
              <Button
                disabled={isLoading}
                color="primary"
                onClick={() => this.updateKaraokeState(KARAOKE_STATE.STARTING)}
              >
                {isLoading ? 'Loading...' : 'Start'}
              </Button>
            ) : karaokeState === KARAOKE_STATE.STARTING ? (
              <div>{startingCountDown}</div>
            ) : karaokeState === KARAOKE_STATE.TALKING ? (
              <div>
                Remaining Time: {talkingCountDown}
                <div>{this.stepIndex}</div>
                <div>{steps[this.stepIndex].data}</div>
                {this.stepIndex === 0 || this.stepIndex === 5 ? (
                  <div>{this.stepIndex}</div>
                ) : (
                  // steps[this.stepIndex].data
                  <div>
                    <img
                      src={`data:image/jpeg;base64,${
                        steps[this.stepIndex].data
                      }`}
                      alt="Random Topic"
                    />
                  </div>
                )}
              </div>
            ) : karaokeState === KARAOKE_STATE.COMPLETE ? (
              <div>
                Yay!!!!!
                <Button
                  color="primary"
                  onClick={() => this.updateKaraokeState(KARAOKE_STATE.IDLE)}
                >
                  OK
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default KaraokeMenu;
