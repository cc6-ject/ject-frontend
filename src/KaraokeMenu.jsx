import React, { Component } from 'react';
import { Card, CardContent, Button } from '@material-ui/core';
import config from './config';

const KARAOKE_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  TALKING: 'talking',
  COMPLETE: 'complete'
};

const START_COUNT_DOWN = 5;
const TALKING_COUNT_DOWN = 300;
const TIMER_DELAY = 1000;
const TIMER_DELAY_FAST = 10;

class KaraokeMenu extends Component {
  constructor(props) {
    super(props);

    // TODO: get db values
    this.state = {
      startCountDown: 5,
      talkingCountDown: 300,
      // pictures: [],
      // fillers: {},
      // wordsPerMin: [],
      // stringPerMin: [],
      // finishedAt: null,
      karaokeState: KARAOKE_STATE.IDLE
    };
    this.startCountDownTimer = null;
    this.takingCountDownTimer = null;
  }

  componentDidMount() {
    console.log(config);
  }

  countDownStart = () => {
    let { startCountDown, talkingCountDown, karaokeState } = this.state;
    startCountDown -= 1;
    if (startCountDown > 0) {
      setTimeout(this.countDownStart, TIMER_DELAY);
    } else {
      karaokeState = KARAOKE_STATE.TALKING;
      talkingCountDown = TALKING_COUNT_DOWN;
      setTimeout(this.countDownTalking, TIMER_DELAY_FAST);
    }

    this.setState({
      startCountDown,
      talkingCountDown,
      karaokeState
    });
  };

  countDownTalking = () => {
    console.log('count down');
    let { talkingCountDown, karaokeState } = this.state;
    talkingCountDown -= 1;
    if (talkingCountDown > 0) {
      setTimeout(this.countDownTalking, TIMER_DELAY_FAST);
    } else {
      karaokeState = KARAOKE_STATE.COMPLETE;
    }

    this.setState({
      talkingCountDown,
      karaokeState
    });
  };

  updateKaraokeState = karaokeState => {
    // TODO: START_COUNT_DOWN?
    this.setState(
      {
        karaokeState,
        startCountDown: START_COUNT_DOWN
      },
      () => {
        setTimeout(this.countDownStart, TIMER_DELAY);
      }
    );
  };

  render() {
    const { karaokeState, startCountDown, talkingCountDown } = this.state;

    return (
      <div>
        <Card>
          <CardContent>
            {karaokeState === KARAOKE_STATE.IDLE ? (
              <Button
                color="primary"
                onClick={() => this.updateKaraokeState(KARAOKE_STATE.STARTING)}
              >
                Start
              </Button>
            ) : karaokeState === KARAOKE_STATE.STARTING ? (
              <div>{startCountDown}</div>
            ) : karaokeState === KARAOKE_STATE.TALKING ? (
              <div>asdfasdfasdfs: {talkingCountDown}</div>
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
