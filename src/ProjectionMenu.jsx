import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import { API, Auth } from 'aws-amplify';
import { Line } from 'react-chartjs-2';
import classNames from 'classnames';

import getAverageVolume from './lib/getAverageVolume';
import ProjectionToggle from './ProjectionToggle';
import { getAnnotationConfig } from './lib/chartConfig';

let audioContext;
let analyser;
let average = 0;

const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
// recognition.continuous = true;
recognition.interimResults = true;
let [transcript, processScript] = ['', ''];

const INIT_CHART_DATA = [];
const INIT_CHART_LABEL = [];
for (let i = 0; i < 50; i += 1) {
  INIT_CHART_DATA.push(45);
  INIT_CHART_LABEL.push('');
}

const annotationConfig = getAnnotationConfig(0.5, true);

const styles = {
  root: {
    padding: '100px 5% 5px 5%'
  },
  card: {
    textAlign: 'center',
    margin: 5,
    height: window.innerHeight * 0.8
  },
  cardPhone: {
    height: window.innerHeight * 0.6
  },
  cardContent: {
    height: '100%'
  },
  wrapper: {
    width: '100%',
    height: '70%'
  },
  wrapperPhone: {
    height: '60%'
  },
  title: {
    padding: 10
  }
};

class ProjectionMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isListen: false,
      isFinish: false,
      intervalAudioId: null,
      intervalSpeechId: null,
      intervalChartId: null,
      decibels: [],
      transcripts: [],
      durations: [],
      avgDecibels: [],
      username: '',
      startTime: 0,
      isPhone: false,
      shouldRedraw: false,
      lineChartData: {
        labels: [...INIT_CHART_LABEL],
        datasets: [
          {
            backgroundColor: 'rgba(249, 170, 51, 0)',
            borderColor: 'rgba(249, 170, 51, 0.8)',
            data: [...INIT_CHART_DATA]
          }
        ]
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true
        },
        scales: {
          yAxes: [
            {
              stacked: false,
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true,
                fontSize: 18
              }
            }
          ],
          xAxes: [
            {
              stacked: false,
              gridLines: {
                display: false
              },
              ticks: {
                callback(value) {
                  return Number.isInteger(value) ? value : '';
                },
                fontSize: 18,
                stepSize: 1
              },
              delay: 3000
            }
          ]
        },
        legend: { display: false },
        annotation: annotationConfig
      }
    };
  }

  async componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    try {
      const data = await Auth.currentAuthenticatedUser();
      if (data.id) {
        await this.setState({ username: data.id });
      } else if (data.username) {
        await this.setState({ username: data.username });
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isPhone } = this.state;
    if (isPhone !== prevState.isPhone) {
      this.handleChartSize();
    }
  }

  componentWillUnmount() {
    if (!audioContext) return;
    if (audioContext.state !== 'closed') {
      this.handleClose();
    }
  }

  handleWindowResize = () => {
    const isPhone = window.innerWidth < 768;
    this.setState({ isPhone });
  };

  handleChartSize = async () => {
    const { isPhone } = this.state;
    const fontSize = isPhone ? 10 : 30;
    const maxTicksLimit = isPhone ? 10 : 30;

    const lineChartData = {
      labels: [...INIT_CHART_LABEL],
      datasets: [
        {
          backgroundColor: 'rgba(249, 170, 51, 0)',
          borderColor: 'rgba(249, 170, 51, 0.8)',
          data: [...INIT_CHART_DATA]
        }
      ]
    };

    const option = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        yAxes: [
          {
            stacked: false,
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              fontSize
            }
          }
        ],
        xAxes: [
          {
            stacked: false,
            gridLines: {
              display: false
            },
            ticks: {
              callback(value) {
                return Number.isInteger(value) ? value : '';
              },
              fontSize,
              autoSkip: true,
              maxTicksLimit,
              maxRotation: 0,
              minRotation: 0
            },
            delay: 3000
          }
        ]
      },
      legend: { display: false },
      annotation: annotationConfig
    };
    this.setState({ shouldRedraw: true });
    await this.setState({
      lineChartOptions: option,
      lineChartData
    });
    await this.setState({ shouldRedraw: false });
  };

  handleClick = () => {
    const startTime = performance.now();
    this.setState({ isFinish: false, startTime });

    const constraint = { audio: true };
    navigator.getUserMedia(constraint, this.handleSuccess, this.handleError);
  };

  handleSuccess = stream => {
    const { isListen } = this.state;
    let time = 0;

    const intervalSpeechId = setInterval(() => {
      const { transcripts } = this.state;
      this.setState({
        transcripts: [...transcripts, transcript]
      });
      transcript = '';
    }, 10000);
    const intervalChartId = setInterval(() => {
      const { lineChartData } = this.state;
      const { data } = lineChartData.datasets[0];
      const { labels } = lineChartData;
      if (time > 0) {
        labels.pop();
      }
      time = time * 10 + 2;
      time /= 10;
      if (data.length > 49) {
        data.shift();
        labels.shift();
      }
      data.push(average);
      labels.push(time);
      this.setState({
        lineChartData: {
          labels: [...labels, ''],
          datasets: [
            {
              data: [...data]
            }
          ]
        }
      });
    }, 200);

    const intervalAudioId = setInterval(() => {
      const { decibels } = this.state;
      this.setState({
        decibels: [...decibels, average]
      });
    }, 500);

    this.setState({
      isListen: !isListen,
      intervalAudioId,
      intervalSpeechId,
      intervalChartId
    });

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
      if (isListen && audioContext.state !== 'closed') {
        recognition.start();
      }
    };
  };

  handleClose = () => {
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
        this.saveToAWS(decibels, avgDecibel, duration, transcripts);
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
      intervalChartId,
      avgDecibels,
      durations
    } = this.state;

    this.setState({
      isListen: !isListen,
      decibels: [],
      avgDecibels: [...avgDecibels, avgDecibel],
      transcripts: [],
      durations: [...durations, duration],
      isFinish: true,
      lineChartData: {
        labels: [...INIT_CHART_LABEL],
        datasets: [
          {
            data: [...INIT_CHART_DATA]
          }
        ]
      }
    });
    transcript = '';
    processScript = '';

    clearInterval(intervalChartId);
    clearInterval(intervalAudioId);
    clearInterval(intervalSpeechId);
  };

  render() {
    const {
      isFinish,
      isListen,
      avgDecibels,
      lineChartData,
      lineChartOptions,
      isPhone,
      shouldRedraw
    } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Card
          className={classNames(
            classes.card,
            isPhone ? classes.cardPhone : null
          )}
        >
          <CardContent className={classes.cardContent}>
            <Typography
              className={classes.title}
              variant={isPhone ? 'subtitle1' : 'h5'}
              gutterBottom
              color="primary"
            >
              {'Real-Time dB Chart'}
            </Typography>
            <div
              className={classNames(
                classes.wrapper,
                isPhone ? classes.wrapperPhone : null
              )}
            >
              <Line
                data={lineChartData}
                options={lineChartOptions}
                className={classes.line}
                redraw={shouldRedraw}
              />
            </div>
            <ProjectionToggle
              isListen={isListen}
              isFinish={isFinish}
              avgDecibels={avgDecibels}
              handleClick={this.handleClick}
              handleClose={this.handleClose}
              isPhone={isPhone}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ProjectionMenu);
