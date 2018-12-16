import React from 'react';
import { API } from 'aws-amplify';
import Chart from 'chart.js';
import 'chartjs-plugin-annotation';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NAME_OF_MONTH, NUM_OF_DAYS } from './Constants';
import './Activity.css';

const NOW = new Date();
const DATE = NOW.getDate();
const MONTH = NOW.getMonth() + 1;
const YEAR = NOW.getFullYear();
const PRE_MONTH = MONTH - 1 > 0 ? MONTH - 1 : MONTH + 11;
const PRE_PRE_MONTH = MONTH - 2 > 0 ? MONTH - 2 : MONTH + 10;
const PRE_PRE_PRE_MONTH = MONTH - 3 > 0 ? MONTH - 3 : MONTH + 9;

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectionData: null,
      karaokeData: null,
      TTData: null,
      view: 'Day',
      activity: 'Projection',
      timeAnchorEl: null,
      activityAnchorEl: null
    };
  }

  async componentDidMount() {
    try {
      const data = await this.getDecibel();
      const proData = this.arrangeData(data, 'projection');
      await this.setState({ projectionData: proData });
      const { projectionData } = this.state;
      this.renderDay(projectionData);
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
        decibels: JSON.parse(val.decibels),
        transcripts: val.transcripts ? JSON.parse(val.transcripts) : undefined
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

  renderActivity = data => {
    const result = [];
    const scale = [];
    for (let i = 0; i <= data.duration; i += 0.5) {
      scale.push(i);
      result.push({
        transcripts: data.transcripts,
        x: i,
        y: data.decibels[i * 2]
      });
    }

    this.drawBarChart(scale, result, 'line');
  };

  renderDay = (data, date = DATE) => {
    const result = [];
    const scale = [];
    const { activity } = this.state;

    const dailyData = data.filter(training => {
      const { createdAt } = training;
      return (
        createdAt.year() === YEAR &&
        createdAt.month() + 1 === MONTH &&
        createdAt.date() === date
      );
    });

    dailyData.forEach((training, i) => {
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
        result.push({ x: i, y: training.avgDecibel });
      }
    });
    this.drawBarChart(scale, result, 'bar');
  };

  renderDays = data => {
    const result = [];
    const scale = [];
    const days = NUM_OF_DAYS[`${MONTH}`];
    const { activity } = this.state;

    const monthlyData = data.filter(training => {
      const { createdAt } = training;
      return createdAt.year() === YEAR && createdAt.month() + 1 === MONTH;
    });

    for (let i = 1; i <= days; i += 1) {
      scale.push(i);
      result.push({ x: `${i}`, y: 0 });
    }

    result.forEach(day => {
      let count = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const training of monthlyData) {
        if (Number(day.x) === training.createdAt.date()) {
          if (activity === 'Projection' || activity === 'Karaoke') {
            day.y += training.avgDecibel;
          } else {
            day.y += training.coverage;
          }
          count += 1;
        }
      }
      if (count !== 0) {
        day.y /= count;
      }
    });

    this.drawBarChart(scale, result, 'bar');
  };

  renderWeeks = data => {
    const chartItem = this.makeWeekScale();
    const { result, scale } = chartItem;
    const { activity } = this.state;

    const threeMonthsData = data.filter(training => {
      const { createdAt } = training;
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
      for (const training of threeMonthsData) {
        const { createdAt } = training;
        if (week.month === createdAt.month() + 1) {
          const inWeek =
            createdAt.date() <= date && createdAt.date() >= date - 6;
          if (inWeek) {
            if (activity === 'Projection' || activity === 'Karaoke') {
              week.y += training.avgDecibel;
            } else {
              week.y += training.coverage;
            }
            count += 1;
          }
        }
      }
      if (count !== 0) {
        week.y /= count;
      }
    });
    this.drawBarChart(scale, result, 'bar');
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
        scale.unshift(`${MONTH}/${targetDay}`);
        result.unshift({ month: MONTH, date: targetDay, y: 0 });
      } else if (targetDay > -30) {
        days = NUM_OF_DAYS[`${PRE_MONTH}`];
        scale.unshift(`${PRE_MONTH}/${targetDay + days}`);
        result.unshift({
          month: PRE_MONTH,
          date: targetDay + days,
          y: 0
        });
      } else if (targetDay > -60) {
        days = NUM_OF_DAYS[`${PRE_MONTH}`] + NUM_OF_DAYS[`${PRE_PRE_MONTH}`];
        scale.unshift(`${PRE_PRE_MONTH}/${targetDay + days}`);
        result.unshift({
          month: PRE_PRE_MONTH,
          date: targetDay + days,
          y: 0
        });
      } else {
        days =
          NUM_OF_DAYS[`${PRE_MONTH}`] +
          NUM_OF_DAYS[`${PRE_PRE_MONTH}`] +
          NUM_OF_DAYS[`${PRE_PRE_PRE_MONTH}`];
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

  renderMonths = data => {
    const result = [];
    const scale = [];
    for (let i = 1; i <= 12; i += 1) {
      scale.push(NAME_OF_MONTH[i]);
      result.push({ x: `${i}`, y: 0 });
    }

    const annualData = data.filter(
      training => training.createdAt.year() === YEAR
    );
    const { activity } = this.state;
    result.forEach(month => {
      let count = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const training of annualData) {
        if (Number(month.x) === training.createdAt.month() + 1) {
          if (activity === 'Projection' || activity === 'Karaoke') {
            month.y += training.avgDecibel;
          } else {
            month.y += training.coverage;
          }
          count += 1;
        }
      }
      if (count !== 0) {
        month.y /= count;
      }
    });
    this.drawBarChart(scale, result, 'bar');
  };

  drawBarChart = (scale, data, chartType) => {
    this.initBarChart();
    const { activity, view } = this.state;
    const yLabel = activity === 'Tongue Twister' ? '%' : 'dB';
    const transparent = activity === 'Tongue Twister' ? 0 : 0.5;
    const isLabel = activity !== 'Tongue Twister';

    const ctx = document.getElementById('primaryChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: scale,
        datasets: [
          {
            data,
            backgroundColor: 'rgba(249, 170, 51, 0.6)',
            hoverBackgroundColor: 'rgba(249, 170, 51, 0.9)'
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: { beginAtZero: true },
              scaleLabel: { display: true, labelString: yLabel, fontSize: 18 }
            }
          ],
          xAxes: [
            {
              barPercentage: 0.4,
              barThickness: 10,
              ticks: { fontSize: 18 }
            }
          ]
        },
        legend: {
          display: false
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'hLine',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: 40,
              borderWidth: 1,
              borderColor: `rgba(20, 29, 33, ${transparent})`,
              label: {
                enabled: isLabel,
                content: 'Proper Level'
              }
            }
          ]
        },
        showAllTooltips: true,
        tooltips: {
          enabled: true,
          mode: 'label',
          backgroundColor: '#344955',
          caretSize: 5,
          callbacks: {
            title(tooltipItem, data) {
              return `${data.labels[tooltipItem[0].index]}Sec`;
            },
            label(tooltipItem, data) {
              return `${data.datasets[0].data[tooltipItem.index].y}dB`;
            },
            afterBody(tooltipItem, data) {
              if (activity === 'Projection' && view === 'Activity') {
                const { index } = tooltipItem[0];
                const { transcripts } = data.datasets[0].data[index];
                const range = Math.floor(index / 20);
                return transcripts ? transcripts[range] : '';
              }
              return '';
            } // afterBody;
          } // callbacks;
        } // tooltips;
      }
    });
    const canvas = document.getElementById('primaryChart');
    canvas.addEventListener('click', e => {
      this.handleChartClick(e, chart);
    });
  };

  initBarChart = () => {
    const wrapper = document.getElementById('primaryChartAreaWrapper');
    const canvas = document.getElementById('primaryChart');
    canvas.remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'primaryChart');
    newCanvas.setAttribute('height', '300');
    newCanvas.setAttribute('width', '1500');
    wrapper.append(newCanvas);
  };

  handleChartClick = async (e, chart) => {
    const { view, activity, projectionData, karaokeData, TTData } = this.state;
    if (view === 'Day') {
      // Extract Time and Y data from clicked data
      const { data } = chart.getElementsAtEvent(e)[0]._chart;
      const { _index } = chart.getElementsAtEvent(e)[0];
      const label = data.labels[_index].split(':');
      const hour = Number(label[0]);
      const minutes = Number(label[1]);
      const YData = data.datasets[0].data[_index].y;

      const allData =
        activity === 'Projection'
          ? projectionData
          : activity === 'Karaoke'
          ? karaokeData
          : TTData;

      const targetAct = allData.find(training => {
        const { createdAt } = training;
        return (
          training.avgDecibel === YData &&
          createdAt.year() === YEAR &&
          createdAt.month() + 1 === MONTH &&
          createdAt.date() === DATE &&
          createdAt.hours() === hour &&
          createdAt.minutes() === minutes
        );
      });
      try {
        await this.setState({ view: 'Activity' });
        this.renderActivity(targetAct);
      } catch (e) {
        console.log(e);
      }
    }
  };

  handleTimeClick = event => {
    const target = event.currentTarget;
    this.setState({ timeAnchorEl: target });
  };

  handleActivityClick = event => {
    const target = event.currentTarget;
    this.setState({ activityAnchorEl: target });
  };

  handleTimeClose = async e => {
    const menuItem = e.currentTarget.textContent;
    const { activity, projectionData, karaokeData, TTData } = this.state;
    const data =
      activity === 'Projection'
        ? projectionData
        : activity === 'Karaoke'
        ? karaokeData
        : TTData;

    try {
      await this.setState({ view: menuItem });
      const { view } = this.state;
      if (view === 'Day') {
        this.renderDay(data);
      } else if (view === 'Days') {
        this.renderDays(data);
      } else if (view === 'Weeks') {
        this.renderWeeks(data);
      } else {
        this.renderMonths(data);
      }
    } catch (e) {
      console.log(e);
    }
    this.setState({ timeAnchorEl: null });
  };

  handleActivityClose = async e => {
    const menuItem = e.currentTarget.textContent;
    const { view, projectionData, karaokeData, TTData } = this.state;

    try {
      await this.setState({ activity: menuItem });
      const { activity } = this.state;
      const data =
        activity === 'Projection'
          ? projectionData
          : activity === 'Karaoke'
          ? karaokeData
          : TTData;
      if (view === 'Day' || view === 'Activity') {
        await this.setState({ view: 'Day' });
        this.renderDay(data);
      } else if (view === 'Days') {
        this.renderDays(data);
      } else if (view === 'Weeks') {
        this.renderWeeks(data);
      } else {
        this.renderMonths(data);
      }
    } catch (e) {
      console.log(e);
    }

    this.setState({ activityAnchorEl: null });
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
          <MenuItem onClick={this.handleTimeClose}>Day</MenuItem>
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
            <canvas id="primaryChart" onClick={() => this.handleChartClick()} />
          </div>
        </div>
      </div>
    );
  }
}

export default Activity;
