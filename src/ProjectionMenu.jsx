import React from 'react';
import { Card, CardContent } from '@material-ui/core';
import { API, Auth } from 'aws-amplify';
import getAverageVolume from './lib/getAverageVolume';
import ProjectionToggle from './ProjectionToggle';
import './ProjectionMenu.css';

let audioContext;
let analyser;
let average = 0;

const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continous = true;
recognition.interimResults = true;
let [transcript, processScript] = ['', ''];

class ProjectionMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: { transform: 'rotate(0deg)' },
      isListen: false,
      isFinish: false,
      intervalAudioId: null,
      intervalSpeechId: null,
      decibels: [],
      transcripts: [],
      durations: [],
      avgDecibels: [],
      username: '',
      startTime: 0
    };
  }

  async componentDidMount() {
    try {
      const data = await Auth.currentAuthenticatedUser();
      this.setState({ username: data.id });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    if (audioContext) this.handleClose();
  }

  handleClick = () => {
    const startTime = performance.now();
    this.setState({ isFinish: false, startTime });

    const constraint = { audio: true };
    navigator.getUserMedia(constraint, this.handleSuccess, this.handleError);
  };

  handleSuccess = stream => {
    const { isListen } = this.state;

    const intervalAudioId = setInterval(() => {
      const { decibels } = this.state;
      this.setState({
        volume: { transform: `rotate(${-180 + 3 * average}deg)` },
        decibels: [...decibels, average]
      });
    }, 500);

    const intervalSpeechId = setInterval(() => {
      const { transcripts } = this.state;
      this.setState({
        transcripts: [...transcripts, transcript]
      });
      transcript = '';
    }, 10000);

    this.setState({ isListen: !isListen, intervalAudioId, intervalSpeechId });

    this.handleSpeech();
    this.handleAudio(stream);
  };

  handleError = error => {
    console.log(`The following error occured: ${error.name}`);
  };

  handleAudio = stream => {
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
    };
  };

  handleSpeech = () => {
    const { isListen } = this.state;
    if (isListen) {
      recognition.start();
    }

    recognition.onresult = event => {
      processScript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      if (event.results[0].isFinal) {
        if (transcript === '') {
          transcript = transcript.concat('', processScript);
        } else {
          transcript = transcript.concat('. ', processScript);
        }
        console.log('TRANSCRIPT', transcript);
      }
    };
    recognition.onend = () => {
      const { isListen } = this.state;
      if (isListen) {
        recognition.start();
      }
    };
  };

  handleClose = async () => {
    audioContext.close();
    recognition.stop();
    const { decibels, startTime, transcripts } = this.state;

    const sum = decibels.reduce((total, val) => total + val, 0);
    let avgDecibel = sum / decibels.length;
    avgDecibel = Math.floor(avgDecibel * 100) / 100;

    // Sec
    const endTime = performance.now();
    const duration = Math.floor((endTime - startTime) / 1000);

    const { isAuthenticated } = this.props;
    if (isAuthenticated && decibels.length > 1) {
      try {
        await this.saveToAWS(decibels, avgDecibel, duration, transcripts);
      } catch (e) {
        console.log(e.message);
      }
    }

    this.init(avgDecibel, duration);
  };

  saveToAWS = (decibels, avgDecibel, duration, transcripts) => {
    const { username } = this.state;
    API.post('ject', '/decibel', {
      body: {
        decibel: JSON.stringify(decibels),
        avgDecibel,
        duration,
        transcripts: JSON.stringify(transcripts)
      },
      requestContext: {
        identity: {
          cognitoIdentityId: username
        }
      }
    });
  };

  init = (avgDecibel, duration) => {
    const {
      isListen,
      intervalAudioId,
      intervalSpeechId,
      avgDecibels,
      durations
    } = this.state;
    // const state = this.state;

    this.setState({
      isListen: !isListen,
      volume: { transform: `rotate(0deg)` },
      decibels: [],
      avgDecibels: [...avgDecibels, avgDecibel],
      transcripts: [],
      durations: [...durations, duration],
      isFinish: true
    });
    transcript = '';
    processScript = '';

    clearInterval(intervalAudioId);
    clearInterval(intervalSpeechId);
  };

  render() {
    const { isFinish, isListen, volume, avgDecibels } = this.state;
    return (
      <div className="Projection">
        <Card style={{ textAlign: 'center', margin: 100 }}>
          <CardContent>
            <svg
              className="ThumbCheck"
              width="200"
              height="200"
              viewBox="0 0 24 24"
              style={volume}
            >
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
            </svg>
            <ProjectionToggle
              isListen={isListen}
              isFinish={isFinish}
              avgDecibels={avgDecibels}
              handleClick={this.handleClick}
              handleClose={this.handleClose}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default ProjectionMenu;
