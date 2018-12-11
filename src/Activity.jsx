import React from 'react';
import { API } from 'aws-amplify';
import Chart from 'chart.js';

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: null
    };
  }

  async componentDidMount() {
    try {
      const data = await this.getDecibels();
      this.setState({ rowData: data });
      this.draw();
    } catch (error) {
      console.log(error);
    }
  }

  getDecibels = () => API.get('ject', '/decibel');

  draw = () => {
    const state = this.state;
    const recent = state.rowData[state.rowData.length - 1];
    const decibels = JSON.parse(recent.decibels);
    const maxdB = decibels.reduce((total, val) => {
      if (val > total) return val;
      return total;
    }, 0);

    console.log(recent, decibels, maxdB);

    let xMax;
    let yMax;
    let xStepSize;
    let yStepSize;
    xMax = Math.ceil(recent.duration);
    const xbase = 1;
    if (xMax < 10 * xbase) xStepSize = xbase;
    else if (xMax < 20 * xbase) xStepSize = 2 * xbase;
    else if (xMax < 30 * xbase) xStepSize = 3 * xbase;
    else if (xMax < 50 * xbase) xStepSize = 5 * xbase;
    else if (xMax < 70 * xbase) xStepSize = 7 * xbase;
    else if (xMax < 100 * xbase) xStepSize = 10 * xbase;
    else if (xMax < 200 * xbase) xStepSize = 20 * xbase;

    yMax = Math.ceil(maxdB);
    if (yMax < 50) yStepSize = 5;
    else if (maxdB > 50) yStepSize = 10;

    const points = decibels.map((point, i) => ({ x: i * 0.5, y: point }));

    this.renderChart(
      xMax,
      xStepSize,
      yMax,
      yStepSize,
      points,
      recent.avgDecibel
    );
  };

  renderChart = (xMax, xStepSize, yMax, yStepSize, points, avgdB) => {
    const ctx = document.getElementById('line-chart');
    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            data: points,
            label: 'Recent',
            borderColor: '#F9AA33',
            fill: true,
            backgroundColor: 'rgba(247, 168, 51,0.3)'
          },
          {
            data: [{ x: 0, y: avgdB }, { x: xMax, y: avgdB }],
            label: 'Avrage',
            borderColor: '(83, 103, 114)',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              ticks: {
                min: 0,
                max: xMax,
                stepSize: xStepSize
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: yMax,
                stepSize: yStepSize
              }
            }
          ]
        }
      }
    });
  };

  render() {
    return (
      <div className="App">
        <canvas id="line-chart" />
      </div>
    );
  }
}

export default Activity;
