import moment from 'moment';

// This function converts row AWS data to readable data

export default function arrangeData(data, type) {
  if (type === 'projection') {
    return data.map(val => ({
      userId: val.userId,
      createdAt: moment(val.createdAt),
      avgDecibel: val.avgDecibel,
      duration: val.duration,
      decibels: JSON.parse(val.decibels),
      transcripts: val.transcripts ? JSON.parse(val.transcripts) : undefined
    }));
  }
  if (type === 'karaoke') {
    return data.map(val => ({
      userId: val.userId,
      createdAt: moment(val.startedAt),
      finishedAt: moment(val.finishedAt),
      pics: val.pics,
      decibels: val.decibels,
      avgDecibel: val.avgDecibel,
      duration: val.duration,
      wordsPerEachMinute: val.wordsPerEachMinute,
      transcripts: val.transcripts,
      wordCounts: val.wordCounts
    }));
  }
  return data.map(val => ({
    userId: val.userId,
    createdAt: moment(val.createdAt),
    name: val.name,
    coverage: val.coverage,
    failWords: JSON.stringify(val.failWords)
  }));
}
