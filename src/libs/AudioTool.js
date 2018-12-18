import fillers from 'fillers';

const TIME_DECIBEL_CAPTURE = 500;
const TIME_TRANSCRIPT_CAPTURE = 10000;
// TODO: other languages support.
// https://www.fluentu.com/blog/english/english-filler-words/
// Interestingly speech recognition API will not take filler words like um, umm ...
const FILLER_WORDS = new Set([
  ...fillers,
  'um',
  'umm',
  'er',
  'uh',
  'uhh',
  'hmm'
]);

class AudioTool {
  constructor() {
    this.audioContextAPI = null;
    this.speechRecognitionAPI = null;

    this.transcript = '';
    this.transcripts = [];
    this.decibel = 0;
    this.decibels = [];
    this.avgDecibel = 0;
    this.transcripts = [];
    this.wordsPerEachMinute = [];
    this.fillerWords = {};
    this.wordCounts = {};
    this.stream = null;
    this.isListening = false;
    this.timerTranscript = null;
    this.timerDecibel = null;
    this.startedAt = 0;
    this.finishedAt = 0;
    this.duration = 0;
  }

  openAudio = (successCallback, errorCallback) => {
    this.initialize();
    const constraint = { audio: true };
    navigator.getUserMedia(
      constraint,
      stream => {
        this.stream = stream;
        this.audioContextAPI = new AudioContext();
        // TODO: do something lower version's browser
        const SpeechRecognition = window.webkitSpeechRecognition;
        this.speechRecognitionAPI = new SpeechRecognition();
        // TODO: language setting
        this.speechRecognitionAPI.lang = 'en-US';
        this.speechRecognitionAPI.interimResults = true;
        // speechRecognitionAPI.continuous = true;

        if (successCallback instanceof Function) {
          successCallback(stream);
        }
      },
      error => {
        console.error(`error: ${error}`);
        if (errorCallback instanceof Function) {
          errorCallback(error);
        }
      }
    );
  };

  closeAudio = successCallback => {
    this.audioContextAPI.close();
    this.speechRecognitionAPI.stop();
    this.initialize();

    if (successCallback instanceof Function) {
      successCallback();
    }
  };

  startListening = callback => {
    if (this.isListening) {
      console.log('Audio is already listening.');
    }

    this.initialize();
    this.isListening = true;
    this.runTranscript();
    this.runDecibel(this.stream);

    this.startedAt = new Date().getTime();

    this.timerDecibel = setInterval(() => {
      this.decibels.push(this.decibel);
    }, TIME_DECIBEL_CAPTURE);

    this.timerTranscript = setInterval(() => {
      if (this.transcript.length < 1) {
        return;
      }

      this.transcripts.push(this.transcript);
      this.transcript = '';
    }, TIME_TRANSCRIPT_CAPTURE);

    if (callback instanceof Function) {
      callback();
    }
  };

  stopListening = callback => {
    this.isListening = false;
    clearInterval(this.timerDecibel);
    clearInterval(this.timerTranscript);

    const sum = this.decibels.reduce((total, val) => total + val, 0);
    this.avgDecibel = Math.floor((sum / this.decibels.length) * 100) / 100;
    this.finishedAt = new Date().getTime();
    this.duration = Math.floor((this.finishedAt - this.startedAt) / 1000);

    /* eslint-disable no-restricted-syntax */
    this.transcripts.forEach((script, indexScript) => {
      for (let word of script.split(' ')) {
        word = word.replace('.', '');
        this.wordCounts[word] = this.wordCounts[word]
          ? this.wordCounts[word] + 1
          : 1;

        if (FILLER_WORDS.has(word)) {
          this.fillerWords[word] = this.fillerWords[word]
            ? this.fillerWords[word] + 1
            : 1;
        }

        const i = Math.floor(indexScript / 6);
        if (!this.wordsPerEachMinute[i]) {
          this.wordsPerEachMinute[i] = 1;
        } else {
          this.wordsPerEachMinute[i]++;
        }
      }
    });
    /* eslint-enable no-restricted-syntax */

    if (callback instanceof Function) {
      callback();
    }
  };

  initialize() {
    this.transcript = '';
    this.transcripts = [];
    this.decibel = 0;
    this.decibels = [];
    this.avgDecibel = 0;
    this.transcripts = [];
    this.wordsPerEachMinute = [];
    this.fillerWords = {};
    this.wordCounts = {};
    this.isListening = false;
    this.timerTranscript = null;
    this.timerDecibel = null;
    this.startedAt = 0;
    this.finishedAt = 0;
    this.duration = 0;
  }

  getAvgDecibel() {
    return this.avgDecibel;
  }

  getDecibels() {
    return this.decibels;
  }

  getTranscripts() {
    return this.transcripts;
  }

  getWordsPerEachMinute() {
    return this.wordsPerEachMinute;
  }

  getFillerWords() {
    return this.fillerWords;
  }

  getWordCounts() {
    return this.wordCounts;
  }

  getDuration() {
    return this.duration;
  }

  getStartedAt() {
    return this.startedAt;
  }

  getFinishedAt() {
    return this.finishedAt;
  }

  runDecibel = stream => {
    // Create analyser interface to get frequency and time-domain analysis
    const analyser = this.audioContextAPI.createAnalyser();
    analyser.fftSize = 1024;
    analyser.maxDecibels = 0;

    // Input is microphone
    const microphone = this.audioContextAPI.createMediaStreamSource(stream);
    microphone.connect(analyser);

    // Pass microphone data to processor
    const processor = this.audioContextAPI.createScriptProcessor(256, 1, 1);
    analyser.connect(processor);
    processor.connect(this.audioContextAPI.destination);

    // Do something with streaming PCM data
    processor.onaudioprocess = () => {
      if (!this.isListening) {
        return;
      }

      const array = new Uint8Array(analyser.frequencyBinCount);

      // TODO: after analyser.getByteFrequencyData(array), what will happen?
      analyser.getByteFrequencyData(array);
      this.decibel = this.convertDecibel(array);
    };
  };

  runTranscript = () => {
    try {
      this.speechRecognitionAPI.start();
    } catch (error) {
      console.log(error.message);
    }

    this.speechRecognitionAPI.onresult = event => {
      if (!this.isListening) {
        return;
      }

      const processScript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      if (event.results[0].isFinal) {
        if (this.transcript === '') {
          this.transcript = this.transcript.concat('', processScript);
        } else {
          this.transcript = this.transcript.concat('. ', processScript);
        }
        console.log('TRANSCRIPT', this.transcript);
      }
    };

    this.speechRecognitionAPI.onend = () => {
      this.speechRecognitionAPI.start();
    };
  };

  convertDecibel = array => {
    let values = 0;
    const { length } = array;
    let result;

    for (let i = 0; i < length; i++) {
      if (values < array[i]) {
        values = array[i];
      }
    }
    result = 23 * Math.log10(values);
    result = Math.floor(result * 100) / 100;
    return result === -Infinity ? 0 : result;
  };
}

export default AudioTool;
