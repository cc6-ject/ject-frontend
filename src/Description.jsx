import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Slide
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { descriptions } from './Constants';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = {
  br10: {
    borderRadius: 10
  },
  w100: {
    width: '100%'
  }
};

class Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPhone: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  }

  handleWindowResize = () => {
    // for md
    this.setState({
      isPhone: window.innerWidth < 768
    });
  };

  render() {
    const { open, onClose, viewTitle, classes } = this.props;
    const { isPhone } = this.state;

    return (
      <div>
        <Dialog
          TransitionComponent={Transition}
          fullScreen={isPhone}
          open={open}
          scroll="paper"
          fullWidth
          onClick={onClose}
        >
          <DialogTitle>{descriptions[viewTitle].TITLE}</DialogTitle>
          <DialogContent>
            {descriptions[viewTitle].CONTENTS.map((item, index) => {
              const variant =
                index === 1
                  ? 'h4'
                  : index === descriptions[viewTitle].CONTENTS.length - 1
                  ? 'overline'
                  : 'subtitle1';
              return (
                <div className={classes.w100} key={index}>
                  {index < 1 ? (
                    <img
                      src={item}
                      alt={viewTitle}
                      className={classNames(classes.br10, classes.w100)}
                    />
                  ) : (
                    <Typography variant={variant} gutterBottom>
                      {item}
                    </Typography>
                  )}
                </div>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Description);
