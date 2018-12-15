import React from 'react';
import { API } from 'aws-amplify';
import Chart from 'chart.js';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './Activity.css';

const numOfDays = {
  1: 31,
  2: 28,
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

const NOW = new Date();
const DATE = NOW.getDate();
const MONTH = NOW.getMonth() + 1;
const YEAR = NOW.getFullYear();
const PRE_MONTH = MONTH - 1 > 0 ? MONTH - 1 : MONTH + 11;
const PRE_PRE_MONTH = MONTH - 2 > 0 ? MONTH - 2 : MONTH + 10;
const PRE_PRE_PRE_MONTH = MONTH - 3 > 0 ? MONTH - 3 : MONTH + 9;
console.log(YEAR, MONTH, DATE);

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectionData: null,
      karaokeData: null,
      TTData: null,
      view: 'Days',
      activity: 'Projection',
      timeAnchorEl: null,
      activityAnchorEl: null
    };
  }

  async componentDidMount() {
    try {
      const data = await this.getDecibel();
      const proData = this.arrangeData(data, 'projection');
      this.setState({ projectionData: proData });
      const { projectionData, activity } = this.state;
      this.renderDays(projectionData, activity);
    } catch (error) {
      console.log(error);
    }
    try {
      const karaokes = await this.getKaraoke();
      const TTs = await this.getTongueTwister();
      const karaokeData = this.arrangeData(karaokes, 'karaoke');
      const TTData = this.arrangeData(TTs, 'tongueTwister');
      this.setState({ karaokeData, TTData });
    } catch (error) {
      console.log(error);
    }
  }

  getDecibel = () => API.get('ject', '/decibel');

  getKaraoke = () => API.get('ject', '/karaoke');

  getTongueTwister = () => API.get('ject', '/tongueTwister');

  arrangeData = (data, type) => {
    if (type === 'projection') {
      return data.map(val => ({
        userId: val.userId,
        createdAt: moment(val.createdAt),
        avgDecibel: val.avgDecibel,
        duration: val.duration,
        decibels: JSON.parse(val.decibels)
      }));
    }
    if (type === 'karaoke') {
      return data.map(val => ({
        userId: val.userId,
        createdAt: moment(val.createdAt),
        finishedAt: moment(val.finishedAt),
        pics: JSON.parse(val.pics),
        decibels: JSON.parse(val.decibels),
        wpm: val.wpm,
        text: val.text,
        avgDecibel: val.avgDecibel,
        countWord: JSON.parse(val.countWord)
      }));
    }
    return data.map(val => ({
      userId: val.userId,
      createdAt: moment(val.createdAt),
      name: val.name,
      coverage: val.coverage,
      failWords: JSON.stringify(val.failWords)
    }));
  };

  renderDays = (data, activityType) => {
    const result = [];
    const scale = [];
    const days = numOfDays[`${MONTH}`];

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= days; i++) {
      scale.push(i);
      result.push({ x: `${i}`, y: 0 });
    }

    const monthlyData = data.filter(activity => {
      const { createdAt } = activity;
      return createdAt.year() === YEAR && createdAt.month() + 1 === MONTH;
    });

    result.forEach(day => {
      let count = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const activity of monthlyData) {
        if (Number(day.x) === activity.createdAt.date()) {
          if (activityType === 'Projection' || activityType === 'Karaoke') {
            day.y += activity.avgDecibel;
          } else {
            // For Tongue Twister
            // day.y += activity.avgDecibel;
          }
          count += 1;
        }
      }
      if (count !== 0) {
        day.y /= count;
      }
    });
    console.log(scale, result);

    this.drawBarChart(scale, result);
  };

  renderWeeks = (data, activityType) => {
    const chartItem = this.makeWeekScale();
    const { result, scale } = chartItem;

    const threeMonthsData = data.filter(activity => {
      const { createdAt } = activity;
      return (
        (createdAt.year() === YEAR || createdAt.year() === YEAR - 1) &&
        (createdAt.month() + 1 === MONTH ||
          createdAt.month() + 1 === PRE_MONTH ||
          createdAt.month() + 1 === PRE_PRE_MONTH)
      );
    });

    result.forEach(week => {
      let count = 0;
      const { date } = week;
      // eslint-disable-next-line no-restricted-syntax
      for (const activity of threeMonthsData) {
        const { createdAt } = activity;
        if (week.month === createdAt.month() + 1) {
          const inWeek =
            createdAt.date() <= date && createdAt.date() >= date - 6;
          if (inWeek) {
            if (activityType === 'Projection' || activityType === 'Karaoke') {
              week.y += activity.avgDecibel;
            } else {
              // For Tongue Twister
              // day.y += activity.avgDecibel;
            }
            count += 1;
          }
        }
      }
      if (count !== 0) {
        week.y /= count;
      }
    });
    this.drawBarChart(scale, result);
  };

  makeWeekScale = () => {
    const result = [];
    const scale = [];
    const day = 6 - NOW.getDay();
    const baseDate = DATE + day;
    let days;

    for (let i = 0; i <= 11; i += 1) {
      const targetDay = baseDate - 7 * i;
      if (targetDay > 0) {
        scale.unshift(`${MONTH} / ${targetDay}`);
        result.unshift({ month: MONTH, date: targetDay, y: 0 });
      } else if (targetDay > -30) {
        days = numOfDays[`${PRE_MONTH}`];
        scale.unshift(`${PRE_MONTH}/${targetDay + days}`);
        result.unshift({
          month: PRE_MONTH,
          date: targetDay + days,
          y: 0
        });
      } else if (targetDay > -60) {
        days = numOfDays[`${PRE_MONTH}`] + numOfDays[`${PRE_PRE_MONTH}`];
        scale.unshift(`${PRE_PRE_MONTH}/${targetDay + days}`);
        result.unshift({
          month: PRE_PRE_MONTH,
          date: targetDay + days,
          y: 0
        });
      } else {
        days =
          numOfDays[`${PRE_MONTH}`] +
          numOfDays[`${PRE_PRE_MONTH}`] +
          numOfDays[`${PRE_PRE_PRE_MONTH}`];
        scale.unshift(`${PRE_PRE_PRE_MONTH}/${targetDay + days}`);
        result.unshift({
          month: PRE_PRE_PRE_MONTH,
          date: targetDay + days,
          y: 0
        });
      }
    }
    return { result, scale };
  };

  renderMonths = (data, activityType) => {
    const result = [];
    const scale = [];
    for (let i = 1; i <= 12; i += 1) {
      scale.push(i);
      result.push({ x: `${i}`, y: 0 });
    }

    const annualData = data.filter(
      activity => activity.createdAt.year() === YEAR
    );

    result.forEach(day => {
      let count = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const activity of annualData) {
        if (Number(day.x) === activity.createdAt.month() + 1) {
          if (activityType === 'Projection' || activityType === 'Karaoke') {
            day.y += activity.avgDecibel;
          } else {
            // For Tongue Twister
            // day.y += activity.avgDecibel;
          }
          count += 1;
        }
      }
      if (count !== 0) {
        day.y /= count;
      }
    });
    this.drawBarChart(scale, result);
  };

  drawBarChart = (scale, data) => {
    this.initBarChart();

    const ctx = document.getElementById('primaryChart').getContext('2d');
    // eslint-disable-next-line no-new
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: scale,
        datasets: [{ data, backgroundColor: 'rgba(249, 170, 51, 0.6)' }]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: { beginAtZero: true },
              scaleLabel: { display: true, labelString: 'dB', fontSize: 18 }
            }
          ],
          xAxes: [
            {
              barPercentage: 0.4,
              ticks: { fontSize: 18 }
            }
          ]
        },
        legend: {
          display: false
        }
      }
    });
  };

  initBarChart = () => {
    const wrapper = document.getElementById('primaryChartAreaWrapper');
    const canvas = document.getElementById('primaryChart');
    canvas.remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'primaryChart');
    newCanvas.setAttribute('height', '300');
    newCanvas.setAttribute('width', '1200');
    wrapper.append(newCanvas);
  };

  handleTimeClick = event => {
    const target = event.currentTarget;
    this.setState({ timeAnchorEl: target });
  };

  handleActivityClick = event => {
    const target = event.currentTarget;
    this.setState({ activityAnchorEl: target });
  };

  handleTimeClose = e => {
    const menuItem = e.currentTarget.textContent;
    const { activity, projectionData, karaokeData, TTData } = this.state;

    let data;
    if (activity === 'Projection') {
      data = projectionData;
    } else if (activity === 'Karaoke') {
      data = karaokeData;
    } else if (activity === 'Tongue Twister') {
      data = TTData;
    }

    if (menuItem === 'Days') {
      this.renderDays(data, activity);
    } else if (menuItem === 'Weeks') {
      this.renderWeeks(data, activity);
    } else {
      this.renderMonths(data, activity);
    }

    this.setState({ timeAnchorEl: null, view: menuItem });
  };

  handleActivityClose = e => {
    const menuItem = e.currentTarget.textContent;
    const { activity, view, projectionData, karaokeData, TTData } = this.state;

    let data;
    if (menuItem === 'Projection') {
      data = projectionData;
    } else if (menuItem === 'Karaoke') {
      data = karaokeData;
    } else {
      data = TTData;
    }

    if (view === 'Days') {
      this.renderDays(data, activity);
    } else if (view === 'Weeks') {
      this.renderWeeks(data, activity);
    } else {
      this.renderMonths(data, activity);
    }

    this.setState({ activityAnchorEl: null, activity: menuItem });
  };

  render() {
    const { view, timeAnchorEl, activityAnchorEl, activity } = this.state;
    return (
      <div className="activity">
        <Button
          aria-owns={timeAnchorEl ? 'time-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleTimeClick}
        >
          {view}
        </Button>
        <Menu
          id="time-menu"
          anchorEl={timeAnchorEl}
          open={Boolean(timeAnchorEl)}
          onClose={this.handleTimeClose}
        >
          <MenuItem onClick={this.handleTimeClose}>Days</MenuItem>
          <MenuItem onClick={this.handleTimeClose}>Weeks</MenuItem>
          <MenuItem onClick={this.handleTimeClose}>Months</MenuItem>
        </Menu>
        <Button
          aria-owns={activityAnchorEl ? 'activity-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleActivityClick}
        >
          {activity}
        </Button>
        <Menu
          id="activity-menu"
          anchorEl={activityAnchorEl}
          open={Boolean(activityAnchorEl)}
          onClose={this.handleActivityClose}
        >
          <MenuItem onClick={this.handleActivityClose}>Projection</MenuItem>
          <MenuItem onClick={this.handleActivityClose}>Tongue Twister</MenuItem>
          <MenuItem onClick={this.handleActivityClose}>Karaoke</MenuItem>
        </Menu>
        <div className="primaryChartWrapper">
          <div id="primaryChartAreaWrapper">
            <canvas id="primaryChart" height="300" width="1200" />
          </div>

          <canvas id="primaryChartAxis" height="300" width="0" />
        </div>
      </div>
    );
  }
}

export default Activity;
