import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { API, Auth } from 'aws-amplify';
import {
  Grid,
  Paper,
  Fab,
  Card,
  FormControl,
  MenuItem,
  Select,
  OutlinedInput
} from '@material-ui/core';
import {
  randomTongueTwister,
  targetLength,
  checkFailure
} from './TongueTwisterFiles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '100px 5% 5px 5%'
  },
  center: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing.unit
  },
  formControl: {
    textAlign: 'center',
    margin: theme.spacing.unit,
    minWidth: 220
  },
  input: {
    display: 'Select Tongue Twister'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 200
  },
  card: {
    paddingTop: 50,
    height: 400
  }
});
const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.maxAlternatives = 1;
recognition.continous = true;
recognition.interimResults = true;

let transcript = '';

class TongueTwisterPractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTwister: 'Practice Random Tongue Twister',
      listening: false,
      statusMessage: 'Start',
      coverage: 0,
      failWord: '',
      username: null,
      endMessage: '',
      openMenu: false
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
    } catch (error) {
      console.log(error);
    }
  }

  handleChange = event => {
    this.setState({ currentTwister: event.target.value });
  };

  handleListen() {
    const { listening, currentTwister } = this.state;
    if (listening) recognition.start();
    this.setState({ coverage: 0, failWord: '' });
    this.wrongResult = '';
    const sentenceLength = targetLength(currentTwister);
    let updateLength = sentenceLength;
    let startIndex = 0;
    let correct = 0;
    recognition.onstart = () => {
      this.setState({
        statusMessage: 'Listening!'
      });
      recognition.onresult = event => {
        const target = currentTwister;
        const processScript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        const temp = processScript.slice(startIndex, updateLength);
        console.log('ON RESULT', temp);

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
        }
      };
      recognition.onend = () => {
        const { failWord } = this.state;
        console.log('onend happened');
        this.toggleError = true;
        this.setState({
          listening: false,
          statusMessage: 'End'
        });
        if (failWord.length < 1) {
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
        coverage,
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
  }

  updateTwister() {
    const newTT = randomTongueTwister(this.lastTongueTwister);
    this.setState({
      currentTwister: newTT
    });
  }

  handleMenu() {
    const { openMenu } = this.state;
    this.setState({
      openMenu: !openMenu
    });
  }

  toggleListen() {
    const { listening } = this.state;
    this.toggleError = false;
    this.setState(
      {
        listening: !listening
      },
      this.handleListen
    );
  }

  render() {
    const { classes } = this.props;
    const {
      statusMessage,
      currentTwister,
      coverage,
      endMessage,
      failWord
    } = this.state;
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={24}
          >
            <Grid item xs>
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  value={currentTwister}
                  onChange={this.handleChange}
                  input={<OutlinedInput />}
                >
                  <MenuItem value="she sells seashells by the seashore">
                    she sells seashells by the seashore
                  </MenuItem>
                  <MenuItem value="red lorry yellow lorry">
                    red lorry yellow lorry
                  </MenuItem>
                  <MenuItem value="unique New York">unique New York</MenuItem>
                  <MenuItem value="mixed biscuits">mixed biscuits</MenuItem>
                  <MenuItem value="a proper copper coffee pot">
                    a proper copper coffee pot
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {!this.listening ? (
              <Fab
                color="secondary"
                className={classes.fab}
                onClick={this.toggleListen}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                </svg>
              </Fab>
            ) : (
              <Fab color="secondary" className={classes.fab}>
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
            <p>{statusMessage}</p>
            <Grid item xs>
              <Paper className={classes.paper}>
                {coverage === 0 ? 0 : coverage < 10 ? coverage : 10}
                {this.outOf}
              </Paper>
            </Grid>
            <Grid item xs>
              {this.toggleError ? (
                <Paper className={classes.paper}>
                  {this.toggleError ? endMessage + failWord : null}
                </Paper>
              ) : null}
            </Grid>
          </Grid>
        </Card>
        {/* </Fab> */}
      </div>
    );
  }
}

export default withStyles(styles)(TongueTwisterPractice);
