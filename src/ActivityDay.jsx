import React from 'react';

import { Typography, Card, CardContent, IconButton } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import Chart from 'chart.js';
import 'chartjs-plugin-annotation';

import { LONG_NAME_OF_MONTH } from './Constants';
import { initChart, makeDayScale, makeSessionScale } from './lib/chartTool';
import { getAxisConfig, getAnnotationConfig } from './lib/chartConfig';
import './Activity.css';

const styles = () => ({
  date: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  title: {
    textAlign: 'center'
  },
  card: {
    margin: 20
  }
});

class ActivityDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSession: null
    };
  }

  componentDidMount() {
    const {
      selectedYear,
      selectedMonth,
      selectedDate,
      projectionData
    } = this.props;
    if (projectionData) {
      this.renderDay(selectedYear, selectedMonth, selectedDate);
      this.renderSession();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      selectedYear,
      selectedMonth,
      selectedDate,
      projectionData,
      activity,
      isPhone
    } = this.props;
    if (projectionData !== prevProps.projectionData) {
      this.renderDay(selectedYear, selectedMonth, selectedDate);
      this.renderSession();
    }
    if (projectionData) {
      if (
        selectedDate !== prevProps.selectedDate ||
        activity !== prevProps.activity ||
        isPhone !== prevProps.isPhone
      ) {
        this.renderDay(selectedYear, selectedMonth, selectedDate);
        this.renderSession();
      }
    }
  }

  renderDay = (year, month, date) => {
    if (date.length > 2) return;
    const { activity, projectionData, karaokeData, TTData } = this.props;
    const data =
      activity === 'Projection'
        ? projectionData
        : activity === 'Karaoke'
        ? karaokeData
        : TTData;

    const dailyData = data.filter(training => {
      const { createdAt } = training;
      return (
        createdAt.year() === year &&
        createdAt.month() + 1 === month &&
        createdAt.date() === date
      );
    });

    const { scale, result } = makeDayScale(dailyData, activity);

    this.drawChart(scale, result, 'bar');
  };

  renderSession = (hour, min, targetData) => {
    const {
      activity,
      projectionData,
      karaokeData,
      TTData,
      selectedYear,
      selectedMonth,
      selectedDate
    } = this.props;
    const data =
      activity === 'Projection'
        ? projectionData
        : activity === 'Karaoke'
        ? karaokeData
        : TTData;

    const dailySessions = data.filter(training => {
      const { createdAt } = training;
      return (
        createdAt.year() === selectedYear &&
        createdAt.month() + 1 === selectedMonth &&
        createdAt.date() === selectedDate
      );
    });

    let targetSession;
    if (dailySessions) {
      targetSession = dailySessions.find(training => {
        const { createdAt } = training;
        return (
          training.avgDecibel === targetData &&
          createdAt.hours() === hour &&
          createdAt.minutes() === min
        );
      });
      targetSession = !targetSession
        ? dailySessions[dailySessions.length - 1]
        : targetSession;
    }
    if (targetSession) {
      const { createdAt } = targetSession;
      const h = createdAt.hours();
      const m =
        String(createdAt.minutes()).length === 1
          ? `0${createdAt.minutes()}`
          : createdAt.minutes();
      this.setState({ selectedSession: `${h}:${m}` });

      const { scale, result } = makeSessionScale(targetSession);
      this.drawChart(scale, result, 'line', 'session');
    }
  };

  drawChart = async (scale, data, chartType, priority = 'daily') => {
    const { activity, isPhone } = this.props;
    initChart(priority, isPhone);
    const len = data.length;
    const axisConfig = getAxisConfig(isPhone, len);

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

                return activity === 'Projection' || activity === 'Karaoke'
                  ? `${newData}dB`
                  : `${newData}%`;
              },
              afterBody(tooltipItem, data) {
                if (activity === 'Projection' || activity === 'Karaoke') {
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
      }, 300);
    } catch (e) {
      console.log(e);
    }
    const canvas = document.querySelector(`.${priority}Chart`);
    if (priority === 'daily') {
      canvas.addEventListener('click', event => {
        this.handleChartClick(event, chart);
      });
    }
  };

  handleChartClick = async (event, chart) => {
    if (!chart.getElementsAtEvent(event)[0]) return;

    const { data } = chart.getElementsAtEvent(event)[0]._chart;
    if (!data) return;

    // Extract label and data to filter data
    const { _index } = chart.getElementsAtEvent(event)[0];
    const labels = data.labels[_index].split(':');
    const hour = Number(labels[0]);
    const minutes = Number(labels[1]);
    const YData = data.datasets[0].data[_index].y;

    this.renderSession(hour, minutes, YData);
  };

  render() {
    const {
      classes,
      activity,
      selectedMonth,
      selectedDate,
      onHandleArrow
    } = this.props;
    const { selectedSession } = this.state;
    return (
      <div className="ActivityDay">
        <Card className={classes.card}>
          <CardContent>
            <div className={classes.date}>
              <IconButton onClick={onHandleArrow} id="backDay">
                <KeyboardArrowLeft />
              </IconButton>
              <Typography variant="h6" gutterBottom color="primary">
                {LONG_NAME_OF_MONTH[selectedMonth]} {selectedDate}
              </Typography>
              <IconButton onClick={onHandleArrow} id="nextDay">
                <KeyboardArrowRight />
              </IconButton>
            </div>
            <Typography
              className={classes.title}
              variant="subtitle1"
              gutterBottom
              color="primary"
            >
              {activity === 'Tongue Twister' ? 'Coverage (%)' : 'Avg. dB'}{' '}
            </Typography>
            <div className="dailyChartWrapper">
              <div className="dailyChartAreaWrapper">
                <canvas className="dailyChart" height="300" width="1200" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography
              className={classes.title}
              variant="subtitle1"
              gutterBottom
              color="primary"
            >
              {activity === 'Tongue Twister' ? 'Coverage (%) ' : 'Avg. dB '}{' '}
              {selectedSession ? `of ${selectedSession}` : null}
            </Typography>
            <div className="sessionChartWrapper">
              <div className="sessionChartAreaWrapper">
                <canvas className="sessionChart" height="300" width="1200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ActivityDay);
