import React from 'react';

import { Typography, Card, CardContent, IconButton } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import Chart from 'chart.js';
import 'chartjs-plugin-annotation';

import { getAnnotationConfig } from '../../lib/chartConfig';
import { makeWeekScale } from '../../lib/chartTool';
import { NUM_OF_DAYS, NAME_OF_MONTH } from '../../Constants';
import '../../assets/Activity.css';

const styles = () => ({
  date: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  card: {
    margin: 20
  },
  title: {
    textAlign: 'center'
  }
});

class ActivityWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedWeek: {
        sun: {
          year: null,
          month: null,
          date: null
        },
        sat: {
          year: null,
          month: null,
          date: null
        }
      }
    };
  }

  async componentDidMount() {
    const { selectedYear, selectedMonth, selectedDate } = this.props;
    await this.getWeek(selectedYear, selectedMonth, selectedDate);
    this.renderWeek();
  }

  async componentDidUpdate(prevProps) {
    const {
      selectedYear,
      selectedMonth,
      selectedDate,
      projectionData,
      activity,
      isPhone
    } = this.props;
    if (projectionData) {
      if (
        selectedDate !== prevProps.selectedDate ||
        activity !== prevProps.activity ||
        isPhone !== prevProps.isPhone
      ) {
        await this.getWeek(selectedYear, selectedMonth, selectedDate);
        this.renderWeek();
      }
    }
  }

  getWeek = (year, month, date) => {
    const selected = new Date(`${year}/${month}/${date}`);
    const tempSun = date - selected.getDay();
    const tempSat = date + (6 - selected.getDay());
    let newSatYear = year;
    let newSatMonth = month;
    let newSatDate = tempSat;
    if (tempSat > NUM_OF_DAYS[month]) {
      if (month + 1 > 12) {
        newSatYear = year + 1;
        newSatMonth = 1;
        newSatDate = tempSat - NUM_OF_DAYS[month];
      } else {
        newSatMonth = month + 1;
        newSatDate = tempSat - NUM_OF_DAYS[month];
      }
    }

    let newSunYear = year;
    let newSunMonth = month;
    let newSunDate = tempSun;
    if (tempSun < 1) {
      if (month - 1 < 1) {
        newSunYear = year - 1;
        newSunMonth = 12;
        newSunDate = NUM_OF_DAYS[12] + tempSun;
      } else {
        newSunMonth = month - 1;
        newSunDate = NUM_OF_DAYS[newSunMonth] + tempSun;
      }
    }

    this.setState({
      selectedWeek: {
        sun: {
          year: newSunYear,
          month: newSunMonth,
          date: newSunDate
        },
        sat: {
          year: newSatYear,
          month: newSatMonth,
          date: newSatDate
        }
      }
    });
  };

  renderWeek = () => {
    const { activity, projectionData, karaokeData, TTData } = this.props;
    const { selectedWeek } = this.state;
    const { sat, sun } = selectedWeek;
    const data =
      activity === 'Projection'
        ? projectionData
        : activity === 'Karaoke'
        ? karaokeData
        : TTData;

    const { result, scale } = makeWeekScale(data, sat, sun, activity);

    this.drawChart(scale, result, 'bar', 'weekly');
  };

  drawChart = async (scale, data, chartType, priority = 'daily') => {
    const { activity, isPhone } = this.props;
    this.initChart(priority, isPhone);
    const fontSize = isPhone ? 10 : 18;
    const barThickness = isPhone ? 10 : 15;

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
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: { beginAtZero: true, fontSize },
                scaleLabel: { display: false }
              }
            ],
            xAxes: [
              {
                barPercentage: 0.7,
                barThickness,
                stacked: false,
                gridLines: {
                  display: false
                },
                ticks: {
                  fontSize,
                  maxRotation: 0,
                  minRotation: 0
                }
              }
            ]
          },
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
              }
            }
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
    const canvas = document.querySelector(`.${priority}Chart`);
    canvas.addEventListener('click', event => {
      this.handleChartClick(event, chart);
    });
  };

  initChart = (priority = 'daily', isPhone) => {
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
      newCanvas.width = window.innerWidth;

      newAreaWrapper.append(newCanvas);
      wrapper.append(newAreaWrapper);
    }
  };

  handleChartClick = async (event, chart) => {
    if (!chart.getElementsAtEvent(event)[0]) return;

    const { data } = chart.getElementsAtEvent(event)[0]._chart;
    if (!data) return;

    const { onHandleDate } = this.props;
    const { selectedWeek } = this.state;
    const { sun } = selectedWeek;

    const { _index } = chart.getElementsAtEvent(event)[0];
    let { year, month, date } = sun;
    if (sun.date + _index > NUM_OF_DAYS[sun.month]) {
      if (sun.month + 1 > 12) {
        year = sun.year + 1;
        month = 1;
        date = sun.date + _index - NUM_OF_DAYS[sun.month];
      } else {
        month = sun.month + 1;
        date = sun.date + _index - NUM_OF_DAYS[sun.month];
      }
    } else {
      date = sun.date + _index;
    }

    onHandleDate(year, month, date);
  };

  render() {
    const { classes, onHandleWeekArrow, activity } = this.props;
    const { selectedWeek } = this.state;
    return (
      <div className="ActivityWeek">
        <Card className={classes.card}>
          <CardContent>
            <div className={classes.date}>
              <IconButton onClick={onHandleWeekArrow} id="backWeek">
                <KeyboardArrowLeft />
              </IconButton>
              <Typography variant="h6" gutterBottom color="primary">
                {NAME_OF_MONTH[selectedWeek.sun.month]} {selectedWeek.sun.date}{' '}
                {' - '}
                {NAME_OF_MONTH[selectedWeek.sat.month]} {selectedWeek.sat.date}
              </Typography>
              <IconButton onClick={onHandleWeekArrow} id="nextWeek">
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
            <div className="weeklyChartWrapper">
              <div className="weeklyChartAreaWrapper">
                <canvas className="weeklyChart" height="300" width="1200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ActivityWeek);
