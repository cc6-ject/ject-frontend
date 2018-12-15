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

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectionData: null,
      karaokeData: null,
      tongueTwisterData: null,
      view: 'Days',
      activity: 'Projection',
      timeAnchorEl: null,
      activityAnchorEl: null
    };
  }

  async componentDidMount() {
    try {
      const decibels = await this.getDecibel();
      const proData = decibels.map(val => ({
        userId: val.userId,
        createdAt: moment(val.createdAt),
        avgDecibel: val.avgDecibel,
        duration: val.duration,
        decibels: JSON.parse(val.decibels)
      }));
      this.setState({ projectionData: proData });
      const { projectionData, activity } = this.state;
      this.renderDays(projectionData, activity);
    } catch (error) {
      console.log(error);
    }
    try {
      const karaokes = await this.getKaraoke();
      const karaokeData = karaokes.map(val => ({
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
      const tongueTwisters = await this.getTongueTwister();
      const tongueTwisterData = tongueTwisters.map(val => ({
        userId: val.userId,
        createdAt: moment(val.createdAt),
        name: val.name,
        coverage: val.coverage,
        failWords: JSON.stringify(val.failWords)
      }));
      this.setState({ karaokeData, tongueTwisterData });
    } catch (error) {
      console.log(error);
    }
  }

  getDecibel = () => API.get('ject', '/decibel');

  getKaraoke = () => API.get('ject', '/karaoke');

  getTongueTwister = () => API.get('ject', '/tongueTwister');

  renderDays = (data, activityType) => {
    const result = [];
    const scale = [];
    for (let i = 1; i <= 31; i++) {
      scale.push(i);
      result.push({ x: `${i}`, y: 0 });
    }
    const now = new Date();
    const monthlyData = data.filter(
      val =>
        val.createdAt.year() === now.getFullYear() &&
        val.createdAt.month() === now.getMonth()
    );
    result.forEach(day => {
      let count = 0;
      for (const activity of monthlyData) {
        if (Number(day.x) === activity.createdAt.date()) {
          if (activityType === 'Projection' || activityType === 'Karaoke') {
            day.y += activity.avgDecibel;
          } else {
            // For Tongue Twister
            // day.y += activity.avgDecibel;
          }

          count++;
        }
      }
      if (count !== 0) {
        day.y /= count;
      }
    });
    this.drawBarChart(scale, result);
  };

  renderWeeks = (data, activityType) => {
    const result = [];
    const scale = [];
    const now = new Date();
    const day = 6 - now.getDay();
    const baseDate = now.getDate() + day;
    let month = now.getMonth() + 1;
    let days = 0;
    for (let i = 0; i <= 11; i++) {
      if (baseDate - 7 * i > 0) {
        scale.unshift(`${month}/${baseDate - 7 * i}`);
        result.unshift({ month, date: baseDate - 7 * i, y: 0 });
      } else if (baseDate - 7 * i > -30) {
        if (month - 1 <= 0) month += 12;
        days = numOfDays[month - 1];
        scale.unshift(`${month - 1}/${baseDate - 7 * i + days}`);
        result.unshift({
          month: month - 1,
          date: baseDate - 7 * i + days,
          y: 0
        });
      } else if (baseDate - 7 * i > -60) {
        if (month - 2 <= 0) month += 12;
        days = numOfDays[month - 1] + numOfDays[month - 2];
        scale.unshift(`${month - 2}/${baseDate - 7 * i + days}`);
        result.unshift({
          month: month - 2,
          date: baseDate - 7 * i + days,
          y: 0
        });
      } else {
        if (month - 3 <= 0) month += 12;
        days =
          numOfDays[month - 1] + numOfDays[month - 2] + numOfDays[month - 3];
        scale.unshift(`${month - 3}/${baseDate - 7 * i + days}`);
        result.unshift({
          month: month - 3,
          date: baseDate - 7 * i + days,
          y: 0
        });
      }
    }
    const threeMonthsData = data.filter(
      val =>
        (val.createdAt.year() === now.getFullYear() ||
          val.createdAt.year() === now.getFullYear() - 1) &&
        (val.createdAt.month() === now.getMonth() ||
          val.createdAt.month() === now.getMonth() - 1 ||
          val.createdAt.month() === now.getMonth() - 2)
    );

    result.forEach(week => {
      let count = 0;
      for (const activity of threeMonthsData) {
        const actDate = activity.createdAt;
        if (week.month === actDate.month() + 1) {
          if (actDate.date() <= week.date && actDate.date() >= week.date - 6) {
            week.y += activity.avgDecibel;
            count++;
          }
        }
      }
      if (count !== 0) {
        week.y /= count;
      }
    });
    this.drawBarChart(scale, result);
  };

  renderMonths = (data, activityType) => {
    console.log('HI MONTHS');

    const result = [];
    const scale = [];
    for (let i = 1; i <= 12; i++) {
      scale.push(i);
      result.push({ x: `${i}`, y: 0 });
    }
    const now = new Date();
    const annualData = data.filter(
      val => val.createdAt.year() === now.getFullYear()
    );
    result.forEach(day => {
      let count = 0;
      for (const activity of annualData) {
        if (Number(day.x) === activity.createdAt.month() + 1) {
          day.y += activity.avgDecibel;
          count++;
        }
      }
      if (count !== 0) {
        day.y /= count;
      }
    });
    this.drawBarChart(scale, result);
  };

  drawBarChart = (scale, data) => {
    const wrapper = document.getElementById('primaryChartAreaWrapper');
    const canvas = document.getElementById('primaryChart');
    canvas.remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'primaryChart');
    newCanvas.setAttribute('height', '300');
    newCanvas.setAttribute('width', '1200');
    wrapper.append(newCanvas);

    const ctx = document.getElementById('primaryChart').getContext('2d');
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
        }
      }
    });
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
    const {
      activity,
      projectionData,
      karaokeData,
      tongueTwisterData
    } = this.state;

    let data;
    if (activity === 'Projection') data = projectionData;
    else if (activity === 'Karaoke') data = karaokeData;
    else if (activity === 'Tongue Twister') data = tongueTwisterData;

    if (menuItem === 'Days') this.renderDays(data, activity);
    else if (menuItem === 'Weeks') this.renderWeeks(data, activity);
    if (menuItem === 'Months') this.renderMonths(data, activity);

    this.setState({ timeAnchorEl: null, view: menuItem });
  };

  handleActivityClose = e => {
    const menuItem = e.currentTarget.textContent;
    const {
      activity,
      view,
      projectionData,
      karaokeData,
      tongueTwisterData
    } = this.state;

    let data;
    if (menuItem === 'Projection') data = projectionData;
    else if (menuItem === 'Karaoke') data = karaokeData;
    else if (menuItem === 'Tongue Twister') data = tongueTwisterData;

    if (view === 'Days') this.renderDays(data, activity);
    else if (view === 'Weeks') this.renderWeeks(data, activity);
    if (view === 'Months') this.renderMonths(data, activity);

    this.setState({ activityAnchorEl: null, activity: menuItem });
  };

  render() {
    const { view, timeAnchorEl, activityAnchorEl, activity } = this.state;
    console.log(this.state);
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
