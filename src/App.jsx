import React, { Component } from "react";
import "./App.css";

import Button from "@material-ui/core/Button";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="Wrapper">
            <div className="Title">*Mock Up*</div>
            <div>
              <Button variant="contained" color="primary">
                test
              </Button>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
