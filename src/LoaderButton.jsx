import React from 'react';
import Button from '@material-ui/core/Button';

class LoaderButton extends React.Component {
  render() {
    const props = this.props;
    return (
      <Button
        className="LoaderButton"
        disabled={props.disabled || props.isLoading}
        type="submit"
        onClick={() => {
          if (props.handleClick) {
            props.handleClick();
          }
        }}
      >
        {!props.isLoading ? props.text : props.loadingText}
      </Button>
    );
  }
}

export default LoaderButton;
