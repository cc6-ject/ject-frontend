import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
// import { API } from "aws-amplify";
import "./ProjectionMenu.css";

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
      volume: { transform: "rotate(0deg)" },
      isTry: false,
      intervalID: null,
      wholeDecibel: [],
      avgDecibel: null
    };
  }

  handleClick = () => {
    const id = setInterval(() => {
      this.setState({
        volume: { transform: `rotate(${-180 + 3 * average}deg)` },
        wholeDecibel: [...this.state.wholeDecibel, average]
      });
    }, 500);
    this.setState({ isTry: !this.state.isTry, intervalID: id });

    navigator.getUserMedia(
      {
        audio: true
      },
      function(stream) {
        // Create analyser interface to get frequency and time-domain analysis
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
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
          console.log("VOLUME:" + average);
        };
      },
      function(err) {
        console.log("The following error occured: " + err.name);
      }
    );
  };

  handleClose = () => {
    audioContext.close();

    const state = this.state;
    let infinityCounter = 0;
    const sum = state.wholeDecibel.reduce((total, val) => {
      console.log(val);
      if (val !== -Infinity) {
        return total + val;
      }
      infinityCounter++;
      return total;
    }, 0);
    const avgDecibel = sum / (state.wholeDecibel.length - infinityCounter);

    this.setState({
      isTry: !state.isTry,
      volume: { transform: `rotate(0deg)` },
      avgDecibel: avgDecibel,
      wholeDecibel: []
    });
    clearInterval(state.intervalID);
  };
  componentWillUnmount() {
    this.handleClose();
  }
  render() {
    const { classes } = this.props;
    console.log(this.state);
    return (
      <div className="Projection">
        <svg
          className="ThumbCheck"
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          style={this.state.volume}
        >
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
        </svg>
        <br />
        <br />
        <br />

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
      </div>
    );
  }
}

function getAverageVolume(array) {
  let values = 0;
  const length = array.length;

  for (let i = 0; i < length; i++) {
    if (values < array[i]) {
      values = array[i];
    }
  }
  average = 25 * Math.log10(values);
  return average;
}

export default withStyles(styles)(ProjectionMenu);
