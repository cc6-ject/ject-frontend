export const APPLAUSE = 'applause';
export const TICK = 'tick';

export const play = soundFile => {
  const source = new Audio(`/static/media/${soundFile}.mp3`);
  source.play();
  return source;
};

export const stop = source => {
  source.pause();
  source.currentTime = 0;
};
