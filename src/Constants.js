import projectionGif from './images/menu-projection.gif';
import projectionStill from './images/menu-projection.png';
import tongueTwisterGif from './images/menu-tongue-twister.gif';
import tongueTwisterStill from './images/menu-tongue-twister.png';
import challengeGif from './images/menu-challenge.gif';
import challengeStill from './images/menu-challenge.png';
import karaokeGif from './images/menu-karaoke.gif';
import karaokeStill from './images/menu-karaoke.png';
import activityGif from './images/menu-activity.gif';
import activityStill from './images/menu-activity.png';
import logo from './images/logo.png';

export const views = {
  home: {
    TITLE: 'Home',
    GIF: '',
    STILL: ''
  },
  projection: {
    TITLE: 'Projection',
    GIF: projectionGif,
    STILL: projectionStill
  },
  tongueTwister: {
    TITLE: 'Tongue Twister',
    GIF: tongueTwisterGif,
    STILL: tongueTwisterStill
  },
  challenge: {
    TITLE: 'Challenge',
    GIF: challengeGif,
    STILL: challengeStill
  },
  karaoke: {
    TITLE: 'Karaoke',
    GIF: karaokeGif,
    STILL: karaokeStill
  },
  login: {
    TITLE: 'Login',
    GIF: '',
    STILL: ''
  },
  signUp: {
    TITLE: 'Sign Up',
    GIF: '',
    STILL: ''
  },
  activity: {
    TITLE: 'Activity',
    GIF: activityGif,
    STILL: activityStill
  }
};

export const descriptions = {
  Projection: {
    TITLE: 'Projection',
    CONTENTS: [
      projectionStill,
      'Improve your projection skill!',
      '1. Click MIC button',
      "2. Say something while looking dB level. Once you projection's dB is over Proper Level, try to keep it up.",
      "* Ject doesn't record any of your saying."
    ]
  },
  'Tongue Twister': {
    TITLE: 'Tongue Twister',
    CONTENTS: [
      tongueTwisterStill,
      'Your tongue will work better ever!',
      '1. Select an item you want to practice from the list',
      '2. Click MIC button then status will be changed to Listening!',
      '3. Say it CLEARLY as much as you can.',
      '4. You can see your coverage like 0 out of 10',
      "* Ject doesn't record any of your saying."
    ]
  },
  Karaoke: {
    TITLE: 'Karaoke',
    CONTENTS: [
      karaokeStill,
      'Beyond the normal public speaker!',
      'With a random topic and 5 images, you should keep talking whatever you think because you just have a few minute only.',
      '1. Click START',
      '2. Wait for a few seconds',
      '3. See a random topic and remember that',
      '4. Start to say something until time is up',
      "* Ject doesn't record any of your saying."
    ]
  }
};

const randomCompliments = [
  'Yay! You did a good job!',
  'You are awesome!',
  'I knew you made it!',
  'You already became a professional!'
];

// TODO: save dynamodb and make an API to add more
// https://scamfighter.net/essay-topic-generator
// https://essaytopicgenerator.com/
const randomKaraokeTitles = [
  'How to spend 16 hours on your smartphone a day without melting your brain',
  '8 Steps to Armageddon?',
  'Always knowing where your towel is as the ultimate survivalist skill',
  'How to earn money during summer holidays',
  'Where will the gym bunnies buy clothes when everyone else becomes obese?',
  'Teenage pregnancy as the best way to dodge college and success',
  'The causes of Stockholm syndrome among catnapping victims',
  'The common reasons for pro-cat-stination among college students',
  'How to meet a serial killer through social media?',
  'How Can We Be Grateful All The Time?'
];

export const getRandomCompliment = () =>
  randomCompliments[Math.floor(randomCompliments.length * Math.random())];

export const randomKaraokeTitle = () =>
  randomKaraokeTitles[Math.floor(randomKaraokeTitles.length * Math.random())];

export const LOGO = logo;

const now = new Date();
const year = now.getFullYear();
function isLeapYear(year) {
  if (year == null) return false;
  return !!((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}

export const NUM_OF_DAYS = {
  1: 31,
  2: isLeapYear(year) ? 29 : 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
};

export const NAME_OF_DAYS = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
  6: '6th',
  7: '7th',
  8: '8th',
  9: '9th',
  10: '10th',
  11: '11st',
  12: '12nd',
  13: '13rd',
  14: '14th',
  15: '15th',
  16: '16th',
  17: '17th',
  18: '18th',
  19: '19th',
  20: '20th',
  21: '21st',
  22: '22nd',
  23: '23rd',
  24: '24th',
  25: '25th',
  26: '26th',
  27: '27th',
  28: '28th',
  29: '29th',
  30: '30th',
  31: '31st'
};
export const DAYS_TO_NUM = {
  '1st': 1,
  '2nd': 2,
  '3rd': 3,
  '4th': 4,
  '5th': 5,
  '6th': 6,
  '7th': 7,
  '8th': 8,
  '9th': 9,
  '10th': 10,
  '11st': 11,
  '12nd': 12,
  '13rd': 13,
  '14th': 14,
  '15th': 15,
  '16th': 16,
  '17th': 17,
  '18th': 18,
  '19th': 19,
  '20th': 20,
  '21st': 21,
  '22nd': 22,
  '23rd': 23,
  '24th': 24,
  '25th': 25,
  '26th': 26,
  '27th': 27,
  '28th': 28,
  '29th': 29,
  '30th': 30,
  '31st': 31
};

export const NAME_OF_MONTH = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
};

export const LONG_NAME_OF_MONTH = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
};
