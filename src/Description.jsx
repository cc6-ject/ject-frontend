import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Slide
} from '@material-ui/core';
import { descriptions } from './Constants';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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
    const { open, onClose, viewTitle } = this.props;
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

              if (index < 1) {
                return (
                  <div style={{ width: '100%' }}>
                    <img
                      src={item}
                      alt={viewTitle}
                      style={{
                        width: '100%',
                        borderRadius: 10,
                        textAling: 'center'
                      }}
                    />
                  </div>
                );
              }
              return (
                <Typography variant={variant} gutterBottom>
                  {item}
                </Typography>
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

export default Description;
