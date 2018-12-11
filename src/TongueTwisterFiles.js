// const shells = 'She sells seashells by the seashore.';
// const lorry = 'Red lorry, yellow lorry.';
// const newYork = 'Unique New York.';
// const buscuits = 'Mixed biscuits.';
// const coffee = 'A proper copper coffee pot.';

// const twistersArray = [shells, lorry, newYork, buscuits, coffee];

// const randomArrayIndex = function(last) {
//   const newTwister = Math.floor(Math.random() * twistersArray.length + 1);
//   return newTwister === last ? randomArrayIndex : newTwister;
// };

// const randomTongueTwister = function(last) {
//   console.log('ffs...', twistersArray[randomArrayIndex(last)]);
//   return twistersArray[randomArrayIndex(last)];
// };

// // window.SpeechRecognition =
// //   window.SpeechRecognition || window.webkitSpeechRecognition;

// const recognition = new SpeechRecognition();
// recognition.interimResults = true; //<-only if want to see text filled in as talking

// const p = document.createElement('p');
// const words = document.querySelector('.words');
// words.appendChild(p);

// recognition.addEventListener('result', e => {
//   const transcript = Array.from(e.results)
//     .map(result => result[0])
//     .map(result => result.transcript)
//     .join('');

//   p.textContent = transcript;
//   console.log(transcript);
// });

// recognition.addEventListener('end', recognition.start);

// recognition.start();
