import React from 'react';
import Chart from 'chart.js';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

class ProjectionChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xMax: 0,
      yMax: 0,
      xStepSize: 5,
      yStepSize: 5,
      isDetail: false
    };
  }

  componentDidMount() {
    const props = this.props;
    const base = 30;
    const maxdB = props.trainingDecibel.reduce((total, val) => {
      if (val > total) return val;
      return total;
    }, 0);

    if (props.durations < base) {
      this.setState({ xMax: base, xStepSize: base / 6 });
    } else if (props.durations < 2 * base) {
      this.setState({ xMax: 2 * base, xStepSize: base / 3 });
    } else if (props.durations < 10 * base) {
      this.setState({ xMax: 10 * base, xStepSize: (10 * base) / 6 });
    } else if (props.durations < 20 * base) {
      this.setState({ xMax: 20 * base, xStepSize: (10 * base) / 6 });
    }

    const yBase = 50;
    if (maxdB < yBase) {
      this.setState({ yMax: yBase, yStepSize: yBase / 10 });
    } else if (maxdB < 2 * base) {
      this.setState({ yMax: 2 * yBase, yStepSize: (2 * yBase) / 10 });
    } else if (maxdB < 100) {
      this.setState({ yMax: 3 * yBase, yStepSize: (3 * yBase) / 10 });
    }
  }

  handleClick = () => {
    this.setState({ isDetail: true });
    const ctx = document.getElementById('line-chart');
    console.log('CLICK', this.state, ctx);
    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            data: [
              { x: 0, y: 10 },
              { x: 0.5, y: 7 },
              { x: 7, y: 10 },
              { x: 29, y: 15 }
            ],
            label: 'Recent',
            borderColor: '#3e95cd',
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
                max: this.state.xMax,
                stepSize: this.state.xStepSize
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: this.state.yMax,
                stepSize: this.state.yStepSize
              }
            }
          ]
        }
      }
    });
  };

  renderResult = () => {
    const props = this.props;
    console.log(this.props);
    return (
      <Card className="ProjectionChart">
        <ButtonBase onClick={this.handleClick}>
          <CardContent>
            <Typography variant="h5">AVG dB {props.avgDecibels}</Typography>
          </CardContent>
        </ButtonBase>
      </Card>
    );
  };

  render() {
    console.log(this.state);
    return (
      <div>
        {!this.state.isDetail ? this.renderResult() : null}
        <canvas id="line-chart" />
      </div>
    );
  }
}

export default ProjectionChart;
