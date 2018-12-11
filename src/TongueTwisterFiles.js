const shells = 'She sells seashells by the seashore.';
const lorry = 'Red lorry, yellow lorry.';
const newYork = 'Unique New York.';
const buscuits = 'Mixed biscuits.';
const coffee = 'A proper copper coffee pot.';

const twistersArray = [shells, lorry, newYork, buscuits, coffee];

const randomArrayIndex = function(last) {
  let newTwister = Math.floor(Math.random() * (twistersArray.length - 1) + 1);
  return newTwister === last ? randomArrayIndex : newTwister;
};

const randomTongueTwister = function(last) {
  return twistersArray[randomArrayIndex(last)];
};

const updateLastTongueTwister = function(newTwister) {
  return twistersArray.indexOf(newTwister);
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

module.exports = { randomTongueTwister, updateLastTongueTwister, splitResults };
