import React from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  facebook: {
    color: '#fff',
    backgroundColor: 'rgba(59, 89, 152)',
    '&:hover': {
      backgroundColor: 'rgba(59, 89, 152, 0.8)'
    }
  }
});

const LoaderButton = ({
  disabled,
  isLoading,
  handleClick,
  loadingText,
  text,
  customColor,
  classes
}) => (
  <Button
    disabled={disabled || isLoading}
    type="submit"
    onClick={handleClick}
    color="primary"
    className={classes[customColor]}
    variant="contained"
  >
    {!isLoading ? text : loadingText}
    {customColor}
  </Button>
);

export default withStyles(styles)(LoaderButton);
