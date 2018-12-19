import React, { Component } from 'react';
/* eslint-disable*/
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { API, Auth } from 'aws-amplify';

import { Fab } from '@material-ui/core';
// import Typography from '@material-ui/core/Typography';

import {
  randomTongueTwister,
  updateLastTongueTwister,
  splitResults,
  targetLength,
  checkFailure
} from './TongueTwisterFiles';

const styles = theme => ({
  root: {
    flexGrow: 1
    // margin: 100
  },

  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 200
  }
});
const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.maxAlternatives = 1; // <- supposed to give alternatives
recognition.continous = true; // <- maybe this needs to be deleted for better tt reading?
recognition.interimResults = true; // <-will need to delete so it doesn't auto correct

let transcript = '';

class TongueTwisterPractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTongueTwister: -1,
      currentTwister: 'Practice Random Tongue Twister',
      twisterTranscript: [],
      listening: false,
      statusMessage: 'Start',
      toggleRepCount: false,
      twisterReps: 0,
      coverage: 0,
      failWord: '',
      username: null,
      endMessage: ''
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.repCount = 0;
    this.wrongResult = '';
    this.toggleError = false;
    this.outOf = ' out of 10';
  }
  async componentDidMount() {
    this.setState({
      currentTwister: randomTongueTwister(this.lastTongueTwister)
    });
    try {
      const data = await Auth.currentAuthenticatedUser();
      console.log(data);
      await this.setState({
        username: data.username
      });
      console.log(this.state.username);
    } catch (error) {
      console.log(error);
    }
    console.log(this.state.username);
  }

  updateLastTwister(newTT) {
    this.setState({
      lastTongueTwister: updateLastTongueTwister(newTT)
    });
  }

  toggleListen() {
    this.toggleError = false;
    this.setState(
      {
        listening: !this.state.listening
      },
      this.handleListen
    );
  }

  updateTwister() {
    const newTT = randomTongueTwister(this.lastTongueTwister);
    this.setState({
      currentTwister: newTT
    });
  }

  updateResult(newResult) {
    this.setState({
      twisterTranscript: splitResults(newResult, this.state.currentTwister)
    });
    this.setState({ toggleRepCount: true });
  }

  handleListen() {
    if (this.state.listening) recognition.start();
    this.setState({ coverage: 0, failWord: '' });
    this.wrongResult = '';
    const sentenceLength = targetLength(this.state.currentTwister);
    let updateLength = sentenceLength;
    let startIndex = 0;
    let correct = 0;
    recognition.onstart = () => {
      this.setState({
        statusMessage: 'Listening!'
      });
      recognition.onresult = event => {
        const target = this.state.currentTwister;
        let processScript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        let temp = processScript.slice(startIndex, updateLength);

        if (processScript.length > updateLength + 8) {
          if (temp !== target) {
            this.handleClose();
            this.wrongResult = temp;
            this.toggleError = true;
            this.setState({ endMessage: 'FAIL WORD = ' });
            this.failAnalysis(target, temp);
            console.log('FAIL');
          } else if (temp === target) {
            console.log('check slice', temp, ' vs ', target);
            correct++;
            this.setState({ coverage: correct });
            if (correct >= 10) {
              // here is if 10/10
              this.toggleError = true;
              this.setState({
                endMessage: 'Congratulations you got them all correct'
              });
              this.finishedPractice();
              transcript = '';
              console.log('SUCCESS');
            }
          }
          startIndex = startIndex + sentenceLength + 1;
          updateLength = updateLength + sentenceLength + 1;
          // console.log('slice position', startIndex, updateLength);
        }

        if (event.results[0].isFinal) {
          if (transcript === '') {
            transcript = transcript.concat('', processScript);
          } else {
            transcript = transcript.concat('. ', processScript);
          }
          // console.log('TRANSCRIPT', transcript);
          this.updateResult(transcript);
        }
      };
      recognition.onend = () => {
        console.log('onend happened');
        this.toggleError = true;
        this.setState({
          listening: false,
          statusMessage: 'End'
        });
        if (this.state.failWord.length < 1) {
          this.setState({
            endMessage: 'Timed out'
          });
        }
        this.finishedPractice();
      };
    };
  }

  async failAnalysis(target, final) {
    try {
      const failWord = await checkFailure(target, final);
      await this.setState({ failWord });
      this.finishedPractice();
    } catch (e) {
      console.log(e);
    }
  }

  finishedPractice() {
    console.log('finishedPractice');
    const { currentTwister, coverage, failWord, username } = this.state;
    API.post('ject', '/tongueTwister', {
      body: {
        name: currentTwister,
        coverage: coverage,
        failWords: JSON.stringify(failWord)
      },
      requestContext: {
        identity: {
          cognitoIdentityId: username
        }
      }
    });
  }

  async handleClose() {
    recognition.stop();
    console.log('here it is??');
    await this.setState({ listening: false, statusMessage: 'End' });
    transcript = '';
    // this.toggleError = true;
  }

  render() {
    const { classes } = this.props;
    const { statusMessage } = this.state;
    return (
      <div>
        {/* <Fab> */}
        <Grid
          container
          direction="column"
          // justify="flex-start"
          justify="center"
          alignItems="center"
          // margin="100"
          spacing={24}
        >
          {/* <Grid item xs={4}> */}
          <Grid item xs>
            <Paper
              className={classes.paper}
              onClick={this.updateTwister.bind(this)}
            >
              {this.state.currentTwister}
            </Paper>
          </Grid>
          {/* <Grid item xs={4}>
            <Paper className={classes.paper} onClick={this.toggleListen}>
              {statusMessage}
            </Paper>
          </Grid> */}
          {!this.listening ? (
            <Fab
              color="secondary"
              className={classes.fab}
              // onClick={() => handleClick()}
              onClick={this.toggleListen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
              </svg>
            </Fab>
          ) : (
            <Fab
              color="secondary"
              className={classes.fab}
              // onClick={() => handleClose()}
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
          <p>
            <p>{statusMessage}</p>
          </p>
          <Grid item xs>
            <Paper className={classes.paper}>
              {this.state.coverage === 0
                ? 0
                : this.state.coverage < 10
                ? this.state.coverage
                : 10}
              {this.outOf}
            </Paper>
          </Grid>
          <Grid item xs>
            {this.toggleError ? (
              <Paper className={classes.paper}>
                {this.toggleError
                  ? this.state.endMessage + this.state.failWord
                  : null}
              </Paper>
            ) : null}
          </Grid>
        </Grid>
        {/* </Fab> */}
      </div>
    );
  }
}

export default withStyles(styles)(TongueTwisterPractice);
