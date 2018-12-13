import React, { Component } from 'react';
import { Card, CardContent, Button } from '@material-ui/core';
import config from './config';

const KARAOKE_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  TALKING: 'talking',
  COMPLETE: 'complete'
};

const STARTING_COUNT_DOWN = 2;
const TALKING_COUNT_DOWN = 100;
const TIMER_DELAY = 1000;
const TIMER_DELAY_FAST = 10;

class KaraokeMenu extends Component {
  constructor(props) {
    super(props);

    // TODO: get db values
    this.state = {
      startingCountDown: STARTING_COUNT_DOWN,
      talkingCountDown: TALKING_COUNT_DOWN,
      // pictures: [],
      // fillers: {},
      // wordsPerMin: [],
      // stringPerMin: [],
      // finishedAt: null,
      karaokeState: KARAOKE_STATE.IDLE
    };
    this.startingCountDownTimer = null;
    this.takingCountDownTimer = null;
  }

  componentDidMount() {
    console.log(config);
  }

  countDown = () => {
    let { startingCountDown, talkingCountDown } = this.state;
    const { karaokeState } = this.state;
    console.log(karaokeState);
    switch (karaokeState) {
      case KARAOKE_STATE.STARTING:
        startingCountDown -= 1;
        if (startingCountDown < 1) {
          this.updateKaraokeState(KARAOKE_STATE.TALKING);
        } else {
          setTimeout(this.countDown, TIMER_DELAY);
        }
        break;
      case KARAOKE_STATE.TALKING:
        talkingCountDown -= 1;
        if (talkingCountDown < 1) {
          this.updateKaraokeState(KARAOKE_STATE.COMPLETE);
        } else {
          setTimeout(this.countDown, TIMER_DELAY_FAST);
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
        break;
      case KARAOKE_STATE.STARTING:
        startingCountDown = STARTING_COUNT_DOWN;
        setTimeout(this.countDown, TIMER_DELAY);
        break;
      case KARAOKE_STATE.TALKING:
        talkingCountDown = TALKING_COUNT_DOWN;
        setTimeout(this.countDown, TIMER_DELAY_FAST);
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
    const { karaokeState, startingCountDown, talkingCountDown } = this.state;

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
              <div>{startingCountDown}</div>
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
