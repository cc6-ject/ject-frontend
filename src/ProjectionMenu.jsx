import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Fab, Card, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { API, Auth } from 'aws-amplify';
import './ProjectionMenu.css';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});
let audioContext;
let analyser;
let average = 0;

class ProjectionMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: { transform: 'rotate(0deg)' },
      isTry: false,
      intervalID: null,
      trainingDecibel: [],
      durations: [],
      avgDecibels: [],
      username: '',
      isFinish: false,
      jectStartTime: 0
    };
  }

  async componentDidMount() {
    try {
      const data = await Auth.currentAuthenticatedUser();
      console.log(data.id);
      this.setState({ username: data.id });
    } catch (error) {
      console.log(error);
    }
  }

  handleClick = e => {
    const startTime = performance.now();
    this.setState({ isFinish: false, jectStartTime: startTime });
    const constraint = { audio: true };
    navigator.getUserMedia(constraint, this.handleSuccess, this.handleError);
  };

  handleSuccess = stream => {
    this.setState({ trainingDecibel: [] });
    const id = setInterval(() => {
      this.setState({
        volume: { transform: `rotate(${-180 + 3 * average}deg)` },
        trainingDecibel: [...this.state.trainingDecibel, average]
      });
    }, 500);
    this.setState({ isTry: !this.state.isTry, intervalID: id });

    // Create analyser interface to get frequency and time-domain analysis
    audioContext = new AudioContext();
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
      console.log(`VOLUME: ${average}`);
    };
  };

  handleError = error => {
    console.log(`The following error occured: ${error.name}`);
  };

  handleClose = async () => {
    audioContext.close();

    const state = this.state;
    const sum = state.trainingDecibel.reduce((total, val) => total + val, 0);
    let avgDecibel = sum / state.trainingDecibel.length;
    avgDecibel = Math.floor(avgDecibel * 100) / 100;

    // Sec
    const endTime = performance.now();
    const duration = Math.floor((endTime - state.jectStartTime) / 1000);

    if (this.props.isAuthenticated) {
      try {
        await this.saveToAWS(state.trainingDecibel, avgDecibel, duration);
      } catch (e) {
        console.log(e.message);
      }
    }

    this.setState({
      isTry: !state.isTry,
      volume: { transform: `rotate(0deg)` },
      avgDecibels: [...state.avgDecibels, avgDecibel],
      durations: [...state.durations, duration],
      isFinish: true
    });
    clearInterval(state.intervalID);
  };

  saveToAWS = (trainingDecibel, avgDecibel, duration) => {
    API.post('ject', '/decibel', {
      body: {
        decibel: JSON.stringify(trainingDecibel),
        avgDecibel,
        duration
      },
      requestContext: {
        identity: {
          cognitoIdentityId: this.state.username
        }
      }
    });
    API.post('ject', '/karaoke', {
      body: {
        finishedAt: 11,
        pics: JSON.stringify(['URL1', 'URL2']),
        decibels: JSON.stringify([11, 11]),
        wpm: 40,
        text: 'YEAH',
        avgDecibel: 40,
        countWord: JSON.stringify({ abc: 1 })
      },
      requestContext: {
        identity: {
          cognitoIdentityId: this.state.username
        }
      }
    });
    API.post('ject', '/tongueTwister', {
      body: {
        finishedAt: 11,
        name: 'Mixed Biscket',
        coverage: 90,
        faileWords: JSON.stringify({ Mixed: 2, Biscket: 1 })
      },
      requestContext: {
        identity: {
          cognitoIdentityId: this.state.username
        }
      }
    });
  };

  // "{\"finishedAt\": 1234, \"pics\":\"[URL1, URL2]\", \"decibels\":\"[35, 46]\", \"wpm\": 40, \"text\":\"YEAH\", \"avgDecibel\": 40, \"countWord\":\"[abc, def]\"}"
  componentWillUnmount() {
    if (audioContext) {
      this.handleClose();
    }
  }

  render() {
    const { classes } = this.props;
    const state = this.state;
    return (
      <div className="Projection">
        <Card style={{ textAlign: 'center', margin: 100 }}>
          <CardContent>
            <svg
              className="ThumbCheck"
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 24 24"
              style={state.volume}
            >
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
            </svg>
            {state.isFinish ? (
              <Typography variant="h5" gutterBottom>
                AVG dB {state.avgDecibels[state.avgDecibels.length - 1]}
              </Typography>
            ) : (
              <br />
            )}
            {!this.state.isTry ? (
              <Fab
                color="secondary"
                className={classes.fab}
                onClick={() => {
                  this.handleClick();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                </svg>
              </Fab>
            ) : (
              <Fab
                color="secondary"
                className={classes.fab}
                onClick={() => {
                  this.handleClose();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
                </svg>
              </Fab>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}

function getAverageVolume(array) {
  let values = 0;
  const length = array.length;
  let result;

  for (let i = 0; i < length; i++) {
    if (values < array[i]) {
      values = array[i];
    }
  }
  result = 23 * Math.log10(values);
  result = Math.floor(result * 100) / 100;
  return result === -Infinity ? 0 : result;
}

export default withStyles(styles)(ProjectionMenu);
