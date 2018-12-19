import menuProjection from './images/menu-projection.png';
import menuTongueTwister from './images/menu-tongue-twister.gif';
import menuChallenge from './images/menu-challenge.gif';
import menuKaraoke from './images/menu-karaoke.png';
import menuActivity from './images/menu-activity.gif';
import logo from './images/logo.png';

export const views = {
  home: {
    TITLE: 'Home'
  },
  projection: {
    TITLE: 'Projection',
    IMAGE: menuProjection
  },
  tongueTwister: {
    TITLE: 'Tongue Twister',
    IMAGE: menuTongueTwister
  },
  challenge: {
    TITLE: 'Challenge',
    IMAGE: menuChallenge
  },
  karaoke: {
    TITLE: 'Karaoke',
    IMAGE: menuKaraoke
  },
  login: {
    TITLE: 'Login'
  },
  signUp: {
    TITLE: 'Sign Up'
  },
  activity: {
    TITLE: 'Activity',
    IMAGE: menuActivity
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
