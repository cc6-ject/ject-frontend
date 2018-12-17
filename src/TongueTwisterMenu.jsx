import React, { Component } from 'react';
/* eslint-disable*/
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { API, Auth } from 'aws-amplify';

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
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 500
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
      username: null
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.repCount = 0;
    this.wrongResult = '';
    this.toggleError = false;
    this.outOf = ' out of 10';

    // dont use state for TT transcript - to slow define here and access here
  }
  async componentDidMount() {
    this.setState({
      currentTwister: randomTongueTwister(this.lastTongueTwister)
    });
    try {
      const data = await Auth.currentAuthenticatedUser();
      this.setState({
        username: data.id
      });
    } catch (error) {
      console.log(error);
    }
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
    // for (let i = 0; i < this.state.twisterTranscript.length; i++) {
    //   if (this.state.twisterTranscript[i] !== targetString) {
    //     console.log('stop this please');
    //     this.handleClose();
    //   }
    // }
  }

  handleListen() {
    // if (this.toggleError) {
    //   this.toggleError = false;
    // }

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
            this.failAnalysis(target, temp);
            console.log('FAIL');
          } else if (temp === target) {
            console.log('check slice', temp, ' vs ', target);
            correct++;
            //console.log(correct);
            this.setState({ coverage: correct });
            if (correct >= 10) {
              if (username) {
                this.finishedPractice();
              }
              //this.printResults();
              transcript = '';
              console.log('SUCCESS');
            }
          }

          startIndex = startIndex + sentenceLength + 1;

          updateLength = updateLength + sentenceLength + 1;

          console.log('slice position', startIndex, updateLength);
        }

        if (event.results[0].isFinal) {
          if (transcript === '') {
            transcript = transcript.concat('', processScript);
          } else {
            transcript = transcript.concat('. ', processScript);
          }
          console.log('TRANSCRIPT', transcript);
          this.updateResult(transcript);
        }
      };
      recognition.onend = () => {
        this.setState({ listening: false, statusMessage: 'End' });
      };
    };
  }

  async failAnalysis(target, final) {
    try {
      const failWord = await checkFailure(target, final);
      await this.setState({ failWord });
      //this.printResults();
      this.setState({ togglePrint: true });
      if (username) {
        this.finishedPractice();
      }
    } catch (e) {
      console.log(e);
    }
  }

  finishedPractice() {
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
    await this.setState({ listening: false, statusMessage: 'End' });
    transcript = '';
  }

  // printResults() {
  //   // if (this.state.statusMessage !== 'End') {
  //   //   return;
  //   // }
  //   // this.setState({ togglePrint: false });
  //   const targetString = this.state.currentTwister;
  //   const table = [];
  //   let count = 0;

  //   for (let i = 0; i < this.state.twisterTranscript.length; i++) {
  //     if (this.state.twisterTranscript[i] === targetString) {
  //       count++;
  //     }

  //     if (this.state.twisterTranscript[i] === targetString) {
  //       table.push(<p id={i}>{targetString + '  - OK'}</p>);
  //     }
  //   }
  //   this.setState({ coverage: count });
  //   console.log('failed word?', this.state.failWord);

  //   console.log('how about this for cover', this.state.coverage);
  //   return table;
  // }

  render() {
    const { classes } = this.props;
    const { statusMessage } = this.state;
    return (
      <div>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          spacing={24}
        >
          <Grid item xs={4}>
            <Paper
              className={classes.paper}
              onClick={this.updateTwister.bind(this)}
            >
              {this.state.currentTwister}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper} onClick={this.toggleListen}>
              {statusMessage}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            {/* {this.state.toggleRepCount ? ( */}
            <Paper className={classes.paper}>
              {this.state.coverage}
              {this.outOf}
            </Paper>
            {/* ) : null} */}
          </Grid>
          <Grid item xs={4}>
            {this.toggleError ? (
              <Paper className={classes.paper}>
                {/* {this.togglePrint ? this.printResults() : null} */}
                {this.toggleError ? 'FAIL WORD = ' + this.state.failWord : null}
              </Paper>
            ) : null}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(TongueTwisterPractice);
