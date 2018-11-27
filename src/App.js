import React, { Component } from 'react';
import PVPUI from "./Scenes/PVPUI"
import '@progress/kendo-theme-default/dist/all.css';

class App extends Component {
  render() {
    return (
      <div className="App">

        <PVPUI />

      </div>
    );
  }
}

export default App;
