export function initChart(priority = 'daily', isPhone) {
  const wrapper = document.querySelector(`.${priority}ChartWrapper`);
  if (wrapper !== null) {
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }
    const newAreaWrapper = document.createElement('div');
    newAreaWrapper.setAttribute('class', `${priority}ChartAreaWrapper`);
    if (isPhone) {
      newAreaWrapper.style.height = '250px';
    } else {
      newAreaWrapper.style.height = '300px';
    }

    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('class', `${priority}Chart`);

    newCanvas.height = '300';
    newCanvas.width = window.innerWidth * 2;

    newAreaWrapper.append(newCanvas);
    wrapper.append(newAreaWrapper);
  }
}

export function makeWeekScale(data, sat, sun, activity) {
  const result = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: 0 }
  ];
  const scale = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weeklyData = data.filter(training => {
    const { createdAt } = training;
    return (
      createdAt.year() <= sat.year &&
      createdAt.year() >= sun.year &&
      (createdAt.month() + 1 <= sat.month &&
        createdAt.month() + 1 >= sun.month) &&
      (createdAt.date() <= sat.date && createdAt.date() >= sun.date)
    );
  });

  scale.forEach((day, i) => {
    let count = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const training of weeklyData) {
      const { createdAt } = training;
      if (createdAt.day() === i) {
        if (activity === 'Projection' || activity === 'Karaoke') {
          result[i].y += training.avgDecibel;
        } else {
          result[i].y += training.coverage;
        }
        count += 1;
      }
    }
    if (count !== 0) {
      result[i].y /= count;
      result[i].y = Math.floor(result[i].y * 100) / 100;
    }
  });

  return { result, scale };
}

export function makeDayScale(data, activity) {
  const result = [];
  const scale = [];

  data.forEach((training, i) => {
    const { createdAt } = training;
    const hour = createdAt.hours();
    const numMin = createdAt.minutes();
    const min =
      numMin.toString().length === 1
        ? `0${createdAt.minutes()}`
        : createdAt.minutes();
    scale.push(`${hour}:${min}`);
    if (activity === 'Projection' || activity === 'Karaoke') {
      result.push({ x: i, y: training.avgDecibel });
    } else {
      result.push({ x: i, y: training.coverage });
    }
  });

  return {
    result,
    scale
  };
}

export function makeSessionScale(data) {
  const scale = [];
  const result = [];
  for (let i = 0; i <= data.duration; i += 0.5) {
    scale.push(`${i}s`);
    result.push({
      transcripts: data.transcripts,
      x: i,
      y: data.decibels[i * 2]
    });
  }
  return {
    scale,
    result
  };
}
