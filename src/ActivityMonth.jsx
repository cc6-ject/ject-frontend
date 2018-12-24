import React from 'react';
import 'react-dates/initialize';
import { DayPickerSingleDateController } from 'react-dates';
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

const styles = () => ({
  calender: {
    display: 'flex',
    justifyContent: 'center',
    margin: 30
  }
});

class ActivityMonth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      focused: null
    };
  }

  onDateChange = selectedDay => {
    this.setState({ date: selectedDay });

    const { onHandleDate } = this.props;
    const mom = selectedDay._d;
    const year = mom.getFullYear();
    const month = mom.getMonth() + 1;
    const date = mom.getDate();

    onHandleDate(year, month, date);
  };

  onFocusChange = focused => {
    this.setState({ focused });
  };

  render() {
    const { date, focused } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.calender}>
        <DayPickerSingleDateController
          date={date}
          onDateChange={date => this.onDateChange(date)}
          focused={focused}
          onFocusChange={focused => this.onFocusChange(focused)}
          numberOfMonths={1}
          transitionDuration={150}
          isOutsideRange={day => moment().diff(day) < 0}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ActivityMonth);
