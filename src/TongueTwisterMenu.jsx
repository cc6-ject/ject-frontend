import React, { Component } from 'react';
/* eslint-disable*/
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {
  randomTongueTwister,
  updateLastTongueTwister,
  splitResults,
  targetStringToArray
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
      toggleRepCount: false
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.repCount = 0;
    this.outOf = ' out of 10';
    // dont use state for TT transcript - to slow define here and access here
  }

  componentDidMount() {
    this.setState({
      currentTwister: randomTongueTwister(this.lastTongueTwister)
    });
  }

  updateLastTwister(newTT) {
    this.setState({
      lastTongueTwister: updateLastTongueTwister(newTT)
    });
  }

  toggleListen() {
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
    // count length here for rep count?
    // this.repCount++;
    this.setState({ toggleRepCount: true });
  }

  handleListen() {
    if (this.state.listening) recognition.start();

    let finalTranscript = '';
    recognition.onresult = event => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += `${transcript} `;
        else interimTranscript += transcript;
      }
    };

    recognition.onstart = () => {
      this.setState({
        statusMessage: 'Listening!'
      });
      recognition.onresult = event => {
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        this.updateResult(transcript);
      };
    };
  }

  printResults() {
    const targetString = this.state.currentTwister;
    const table = [];
    setTimeout(() => {
      console.log('NOW!');
    }, 3000);
    // const endTimer = clearTimeout(timer);
    // const timer = setTimeout;
    // const count = 0;
    for (let i = 0; i < this.state.twisterTranscript.length; i++) {
      // clearTimeout(timer);
      // timer(() => {
      table.push(
        <p id={i}>
          {this.state.twisterTranscript[i]}
          {this.state.twisterTranscript[i] === targetString ? ' OK' : ' FAIL!'}
        </p>
      );
      this.repCount = i + 1;
      // }, 2000);

      // const test = function() {

      // };

      setTimeout(() => {}, 2000);
    }
    return table;
  }

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
            {this.state.toggleRepCount ? (
              <Paper className={classes.paper}>
                {this.repCount}
                {this.outOf}
              </Paper>
            ) : null}
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>{this.printResults()}</Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(TongueTwisterPractice);
