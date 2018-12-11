import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {
  randomTongueTwister,
  updateLastTongueTwister,
  splitResults
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
// recognition.maxAlternatives = 10; //<- supposed to give alternatives
// recognition.continous = true; //<- maybe this needs to be deleted for better tt reading?
// recognition.interimResults = true; //<-will need to delete so it doesn't auto correct

let transcript = '';

class TongueTwisterPractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTongueTwister: -1,
      currentTwister: 'Practice Random Tongue Twister',
      twisterTranscript: '',
      listening: false
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
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
  }

  handleListen() {
    if (this.state.listening) {
      recognition.start();
      recognition.onend = () => {
        console.log('Stopped listening per click');
      };
    }

    recognition.onstart = () => {
      console.log('Listening!');
      recognition.onresult = event => {
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        this.updateResult(transcript);
      };
    };
  }

  printResults() {
    const table = [];
    for (let i = 0; i < this.state.twisterTranscript.length; i++) {
      table.push(<p id={i}>{this.state.twisterTranscript[i]}</p>);
    }
    return table;
  }

  render() {
    const { classes } = this.props;
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
              Start
            </Paper>
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
