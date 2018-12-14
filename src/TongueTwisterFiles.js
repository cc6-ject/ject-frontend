const shells = 'she sells seashells by the seashore';
const lorry = 'red lorry yellow lorry';
const newYork = 'unique New York';
const buscuits = 'mixed biscuits';
const coffee = 'a proper copper coffee pot';

const twistersArray = [shells, lorry, newYork, buscuits, coffee];

const randomArrayIndex = function(last) {
  const newTwister = Math.floor(Math.random() * (twistersArray.length - 1) + 1);
  return newTwister === last ? randomArrayIndex : newTwister;
};

const randomTongueTwister = function(last) {
  return twistersArray[randomArrayIndex(last)];
};

const updateLastTongueTwister = function(newTwister) {
  return twistersArray.indexOf(newTwister);
};

const targetStringToArray = function(str) {
  return str.split(' ');
};

const splitResults = function(transcript, phrase) {
  const count = phrase.split(' ').length;
  const words = transcript.split(' ');
  const result = [];
  while (words.length) {
    result.push(words.splice(0, count).join(' '));
  }
  return result;
};

module.exports = {
  randomTongueTwister,
  updateLastTongueTwister,
  splitResults,
  targetStringToArray
};
