import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { randomTongueTwister } from './TongueTwisterFiles';

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
//recognition.maxAlternatives = 10; //<- supposed to give alternatives
//recognition.continous = true; //<- maybe this needs to be deleted for better tt reading?
//recognition.interimResults = true; //<-will need to delete so it doesn't auto correct

let transcript = '';

class TongueTwisterPractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //tongueTwisters: [twistersArray],
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
  toggleListen() {
    this.setState(
      {
        listening: !this.state.listening
      },
      this.handleListen
    );
  }

  updateTwister() {
    console.log('enter');
    console.log(randomTongueTwister(this.lastTongueTwister));
    const newTT = randomTongueTwister(this.lastTongueTwister);
    console.log('newTT..', newTT);
    this.setState(
      {
        currentTwister: newTT
      },
      () => {
        console.log(this.state.currentTwister, 'currentTwister');
      }
    );
  }

  updateResult(newResult) {
    console.log('firing', newResult);
    this.setState({ twisterTranscript: newResult });
  }

  handleListen() {
    console.log('listening?', this.state.listening);

    if (this.state.listening) {
      recognition.start();
      // recognition.onend = () => {
      //   console.log('...continue listening...');
      //   recognition.start();
      //   };
      // } else {
      //   recognition.stop();
      //   recognition.onend = () => {
      //     console.log('Stopped listening per click');
      //   };
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
              // onClick={this.startTwister.bind(this)}
              //onClick={this.startTwister}
            >
              {/* Place Holder */}
              {/* {TongueTwisterFiles.randomArrayIndex(this.lastTongueTwister)} */}
              {this.state.currentTwister}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper} onClick={this.toggleListen}>
              Start
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              {this.state.twisterTranscript}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(TongueTwisterPractice);
