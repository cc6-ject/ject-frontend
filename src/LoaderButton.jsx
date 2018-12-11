import React from 'react';
import { Button } from '@material-ui/core';

const LoaderButton = ({
  disabled,
  isLoading,
  handleClick,
  loadingText,
  text
}) => (
  <Button
    className="LoaderButton"
    disabled={disabled || isLoading}
    type="submit"
    onClick={handleClick}
    color="primary"
    variant="contained"
  >
    {!isLoading ? text : loadingText}
  </Button>
);

export default LoaderButton;
