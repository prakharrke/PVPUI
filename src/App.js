import React, { Component } from 'react';
import PVPUI from "./Scenes/PVPUI"
import CreateBaseline from "./Scenes/CreateBaseline"
import '@progress/kendo-theme-default/dist/all.css';
import './css/bootstrap.min.css'
import './css/bootstrap.css'
import './css/transition.css'


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
