import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography } from '@material-ui/core';

import { API } from 'aws-amplify';
import Chart from 'chart.js';
import 'chartjs-plugin-annotation';

import { NAME_OF_MONTH, NUM_OF_DAYS } from './Constants';
import arrangeData from './lib/arrangeData';
import makeWeekScale from './lib/makeWeekScale';
import { getAxisConfig, getAnnotationConfig } from './lib/chartConfig';
import './Activity.css';

const NOW = new Date();
const DATE = NOW.getDate();
const MONTH = NOW.getMonth() + 1;
const YEAR = NOW.getFullYear();
const PRE_MONTH = MONTH - 1 > 0 ? MONTH - 1 : MONTH + 11;
const PRE_PRE_MONTH = MONTH - 2 > 0 ? MONTH - 2 : MONTH + 10;

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
      activityAnchorEl: null,
      selectedDay: null,
      selectedTime: null
    };
  }

  async componentDidMount() {
    try {
      const data = await this.getDecibel();
      const proData = arrangeData(data, 'projection');
      await this.setState({ projectionData: proData });
      const { projectionData } = this.state;
      this.renderDays(projectionData);
      this.renderDay();
      this.renderActivity();

      const karaokes = await this.getKaraoke();
      const TTs = await this.getTongueTwister();
      const karaokeData = arrangeData(karaokes, 'karaoke');
      const TTData = arrangeData(TTs, 'tongueTwister');
      this.setState({ karaokeData, TTData });
    } catch (error) {
      console.log(error);
    }
  }

  getDecibel = () => API.get('ject', '/decibel');

  getKaraoke = () => API.get('ject', '/karaoke');

  getTongueTwister = () => API.get('ject', '/tongueTwister');

  renderActivity = (hour, min, targetData) => {
    const result = [];
    const scale = [];
    const {
      activity,
      projectionData,
      karaokeData,
      TTData,
      selectedDay
    } = this.state;
    const data =
      activity === 'Projection'
        ? projectionData
        : activity === 'Karaoke'
        ? karaokeData
        : TTData;

    let targetAct = data.find(training => {
      const { createdAt } = training;
      return (
        training.avgDecibel === targetData &&
        createdAt.year() === YEAR &&
        createdAt.month() + 1 === MONTH &&
        createdAt.date() === selectedDay &&
        createdAt.hours() === hour &&
        createdAt.minutes() === min
      );
    });

    targetAct = !targetAct ? data[data.length - 1] : targetAct;

    for (let i = 0; i <= targetAct.duration; i += 0.5) {
      scale.push(i);
      result.push({
        transcripts: targetAct.transcripts,
        x: i,
        y: targetAct.decibels[i * 2]
      });
    }
    this.drawChart(scale, result, 'line', 'thirdly');
  };

  renderDay = (date = DATE) => {
    if (date.length > 2) return;
    const result = [];
    const scale = [];
    const { activity, projectionData, karaokeData, TTData } = this.state;
    const data =
      activity === 'Projection'
        ? projectionData
        : activity === 'Karaoke'
        ? karaokeData
        : TTData;

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
        result.push({ x: i, y: training.coverage });
      }
    });

    this.drawChart(scale, result, 'bar', 'secondary');
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

    this.drawChart(scale, result, 'bar');
  };

  renderWeeks = data => {
    const chartItem = makeWeekScale();
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
    this.drawChart(scale, result, 'bar');
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
    this.drawChart(scale, result, 'bar');
  };

  drawChart = async (scale, data, chartType, priority = 'primary') => {
    this.initChart(priority);

    const { activity, view } = this.state;

    const yLabel = activity === 'Tongue Twister' ? 'Coverage (%)' : 'dB';
    const axisConfig = getAxisConfig(yLabel);

    const transparent = activity === 'Tongue Twister' ? 0 : 0.5;
    const isLabel = activity !== 'Tongue Twister';
    const annotationConfig = getAnnotationConfig(transparent, isLabel);

    const wrapper = document.querySelector(`.${priority}ChartAreaWrapper`);
    const ctx = wrapper.querySelector('canvas').getContext('2d');
    let chart;
    try {
      chart = await new Chart(ctx, {
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
          scales: axisConfig,
          legend: {
            display: false
          },
          annotation: annotationConfig,
          showAllTooltips: true,
          tooltips: {
            enabled: true,
            mode: 'label',
            backgroundColor: '#344955',
            caretSize: 5,
            titleFontSize: 18,
            bodyFontSize: 18,
            callbacks: {
              title(tooltipItem, data) {
                return `${data.labels[tooltipItem[0].index]}`;
              },
              label(tooltipItem, data) {
                let newData = data.datasets[0].data[tooltipItem.index].y;
                newData = Math.floor(newData * 100) / 100;

                return activity === 'Projection' && view === 'Days'
                  ? `${newData}dB`
                  : `${newData}%`;
              },
              afterBody(tooltipItem, data) {
                if (
                  (activity === 'Projection' || activity === 'Karaoke') &&
                  view === 'Days'
                ) {
                  const { index } = tooltipItem[0];
                  const { transcripts } = data.datasets[0].data[index];
                  const range = Math.floor(index / 20);
                  return transcripts ? transcripts[range] : '';
                }
                return '';
              }
            }
          }
        }
      });
      setTimeout(() => {
        wrapper.style.width = '100%';
        console.log('INSIDE');
      }, 1000);
    } catch (e) {
      console.log(e);
    }
    const canvas = document.querySelector(`.${priority}Chart`);
    if (priority !== 'thirdly') {
      canvas.addEventListener('click', event => {
        this.handleChartClick(event, chart);
      });
    }
  };

  initChart = (priority = 'primary') => {
    const wrapper = document.querySelector(`.${priority}ChartWrapper`);
    // const areaWrapper = document.querySelector(`.${priority}ChartAreaWrapper`);
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }
    const newAreaWrapper = document.createElement('div');
    newAreaWrapper.setAttribute('class', `${priority}ChartAreaWrapper`);

    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('class', `${priority}Chart`);
    newCanvas.height = '300';
    newCanvas.width = window.innerWidth * 2;

    newAreaWrapper.append(newCanvas);
    wrapper.append(newAreaWrapper);
    console.log(wrapper);
    if (priority === 'primary') {
      this.setState({ selectedDay: null, selectedTime: null });
    } else if (priority === 'secondary') {
      this.setState({ selectedTime: null });
    }
  };

  handleChartClick = async (event, chart) => {
    const { view } = this.state;
    if (view === 'Days') {
      if (!chart.getElementsAtEvent(event)[0]) return;

      // Extract Time and Y data from clicked data
      const { data } = chart.getElementsAtEvent(event)[0]._chart;
      if (!data) return;
      const { _index } = chart.getElementsAtEvent(event)[0];
      let label = data.labels[_index];

      if (label.length > 2) {
        this.setState({ selectedTime: label });
        label = label.split(':');
        const hour = Number(label[0]);
        const minutes = Number(label[1]);
        const YData = data.datasets[0].data[_index].y;
        this.renderActivity(hour, minutes, YData);
      } else {
        this.renderDay(label);
        this.initChart('thirdly');
        this.setState({ selectedDay: label });
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

  handleTimeClose = async event => {
    const menuItem = event.currentTarget.textContent;
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
      if (view === 'Days') {
        this.renderDays(data);
      } else if (view === 'Weeks') {
        this.renderWeeks(data);
        this.initChart('secondary');
        this.initChart('thirdly');
      } else {
        this.renderMonths(data);
        this.initChart('secondary');
        this.initChart('thirdly');
      }
    } catch (error) {
      console.log(error);
    }

    this.setState({ timeAnchorEl: null });
  };

  handleActivityClose = async event => {
    const menuItem = event.currentTarget.textContent;
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
      this.initChart('secondary');
      this.initChart('thirdly');
      if (view === 'Days') {
        this.renderDays(data);
      } else if (view === 'Weeks') {
        this.renderWeeks(data);
      } else {
        this.renderMonths(data);
      }
    } catch (error) {
      console.log(error);
    }

    this.setState({ activityAnchorEl: null });
  };

  render() {
    const {
      view,
      timeAnchorEl,
      activityAnchorEl,
      activity,
      selectedDay,
      selectedTime
    } = this.state;
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
          <div className="primaryChartAreaWrapper">
            <canvas className="primaryChart" height="300" width="1200" />
          </div>
        </div>
        {selectedDay !== null ? (
          <Typography
            className="title"
            variant="h6"
            gutterBottom
            color="primary"
          >
            Graph of {selectedDay}/{MONTH}
          </Typography>
        ) : null}
        <div className="secondaryChartWrapper">
          <div className="secondaryChartAreaWrapper">
            <canvas className="secondaryChart" />
          </div>
        </div>
        {selectedTime !== null ? (
          <Typography
            className="title"
            variant="h6"
            gutterBottom
            color="primary"
          >
            Graph of {selectedTime}
          </Typography>
        ) : null}
        <div className="thirdlyChartWrapper">
          <div className="thirdlyChartAreaWrapper">
            <canvas className="thirdlyChart" />
          </div>
        </div>
        <div className="chartWrapper">
          <div className="chartAreaWrapper">
            <canvas id="myChart" height="300" width="1200" />
          </div>
        </div>
      </div>
    );
  }
}

export default Activity;
