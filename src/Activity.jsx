import React from 'react';
import { Typography, Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { API } from 'aws-amplify';
import ActivityMonth from './ActivityMonth';
import ActivityWeek from './ActivityWeek';
import ActivityDay from './ActivityDay';
import ActivitySelection from './ActivitySelection';

import { NUM_OF_DAYS } from './Constants';
import arrangeData from './lib/arrangeData';
import './Activity.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 50
  }
});

const NOW = new Date();
const YEAR = NOW.getFullYear();
const MONTH = NOW.getMonth() + 1;
const DATE = NOW.getDate();

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectionData: null,
      karaokeData: null,
      TTData: null,
      view: 'Day',
      activity: 'Projection',
      activityAnchorEl: null,
      selectedYear: YEAR,
      selectedMonth: MONTH,
      selectedDate: DATE,
      isPhone: false,
      tabMargin: 66
    };
  }

  async componentDidMount() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      this.getData();
    }
  }

  handleWindowResize = () => {
    const isPhone = window.innerWidth < 768;
    const tabMargin = isPhone ? 66 : 74;
    this.setState({ isPhone, tabMargin });
  };

  getData = async () => {
    try {
      const data = await this.getDecibel();
      const proData = arrangeData(data, 'projection');
      await this.setState({ projectionData: proData });

      const karaokes = await this.getKaraoke();
      const TTs = await this.getTongueTwister();
      const karaokeData = arrangeData(karaokes, 'karaoke');
      const TTData = arrangeData(TTs, 'tongueTwister');
      this.setState({ karaokeData, TTData });
    } catch (error) {
      console.log(error);
    }
  };

  getDecibel = () => API.get('ject', '/decibel');

  getKaraoke = () => API.get('ject', '/karaoke');

  getTongueTwister = () => API.get('ject', '/tongueTwister');

  handleTabChange = (evnet, value) => {
    this.setState({ view: value });
  };

  handleActivityClick = event => {
    const target = event.currentTarget;
    this.setState({ activityAnchorEl: target });
  };

  handleActivityClose = async event => {
    const menuItem = event.currentTarget.textContent;
    if (!menuItem) return;
    await this.setState({ activity: menuItem, activityAnchorEl: null });
  };

  onHandleDate = (selectedYear, selectedMonth, selectedDate) => {
    this.setState({ view: 'Day' });
    this.setState({ selectedYear, selectedMonth, selectedDate });
  };

  onHandleArrow = event => {
    const { selectedDate, selectedMonth, selectedYear } = this.state;
    const { id } = event.currentTarget;

    const move = id === 'backDay' ? -1 : 1;
    if (selectedDate + move > NUM_OF_DAYS[selectedMonth]) {
      if (selectedMonth + 1 > 12) {
        this.setState({
          selectedDate: 1,
          selectedMonth: 1,
          selectedYear: selectedYear + 1
        });
      } else {
        this.setState({ selectedDate: 1, selectedMonth: selectedMonth + 1 });
      }
    } else if (selectedDate + move < 1) {
      if (selectedMonth - 1 < 1) {
        this.setState({
          selectedDate: NUM_OF_DAYS[12],
          selectedMonth: 12,
          selectedYear: selectedYear - 1
        });
      } else {
        this.setState({
          selectedDate: NUM_OF_DAYS[selectedMonth - 1],
          selectedMonth: selectedMonth - 1
        });
      }
    } else {
      this.setState({ selectedDate: selectedDate + move });
    }
  };

  onHandleWeekArrow = event => {
    const { selectedDate, selectedMonth, selectedYear } = this.state;
    const { id } = event.currentTarget;

    const move = id === 'backWeek' ? -7 : 7;
    if (selectedDate + move > NUM_OF_DAYS[selectedMonth]) {
      if (selectedMonth + 1 > 12) {
        this.setState({
          selectedDate: selectedDate + move - NUM_OF_DAYS[selectedMonth],
          selectedMonth: 1,
          selectedYear: selectedYear + 1
        });
      } else {
        this.setState({
          selectedDate: selectedDate + move - NUM_OF_DAYS[selectedMonth],
          selectedMonth: selectedMonth + 1
        });
      }
    } else if (selectedDate + move < 1) {
      if (selectedMonth - 1 < 1) {
        this.setState({
          selectedDate: NUM_OF_DAYS[12] - selectedDate + move,
          selectedMonth: 12,
          selectedYear: selectedYear - 1
        });
      } else {
        this.setState({
          selectedDate: NUM_OF_DAYS[12] - selectedDate + move,
          selectedMonth: selectedMonth - 1
        });
      }
    } else {
      this.setState({ selectedDate: selectedDate + move });
    }
  };

  render() {
    const {
      view,
      projectionData,
      karaokeData,
      TTData,
      activityAnchorEl,
      activity,
      selectedYear,
      selectedMonth,
      selectedDate,
      tabMargin,
      isPhone
    } = this.state;
    const { isAuthenticated, classes } = this.props;
    return (
      <div className="activity">
        <div className={classes.root}>
          <Tabs
            value={view}
            onChange={this.handleTabChange}
            style={{ marginTop: tabMargin }}
            fullWidth
          >
            <Tab value="Day" label="Day" />
            <Tab value="Week" label="Week" />
            <Tab value="Month" label="Month" />
          </Tabs>
        </div>
        {isAuthenticated ? null : (
          <Typography variant="h6" gutterBottom color="primary">
            Sorry, please login or sign-up first.
          </Typography>
        )}
        {view !== 'Month' && isAuthenticated ? (
          <ActivitySelection
            activityAnchorEl={activityAnchorEl}
            handleActivityClick={this.handleActivityClick}
            handleActivityClose={this.handleActivityClose}
            activity={activity}
          />
        ) : null}
        {view === 'Day' && isAuthenticated && (
          <ActivityDay
            activity={activity}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDate={selectedDate}
            projectionData={projectionData}
            karaokeData={karaokeData}
            TTData={TTData}
            isPhone={isPhone}
            onHandleArrow={this.onHandleArrow}
            isAuthenticated={isAuthenticated}
          />
        )}
        {view === 'Week' && isAuthenticated && (
          <ActivityWeek
            activity={activity}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDate={selectedDate}
            projectionData={projectionData}
            karaokeData={karaokeData}
            TTData={TTData}
            isPhone={isPhone}
            onHandleWeekArrow={this.onHandleWeekArrow}
            isAuthenticated={isAuthenticated}
            onHandleDate={this.onHandleDate}
          />
        )}
        {view === 'Month' && isAuthenticated && (
          <ActivityMonth onHandleDate={this.onHandleDate} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Activity);
