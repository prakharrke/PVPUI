import React, { Component } from 'react';
import PVPUI from "./Scenes/PVPUI"
import LoginForm from './Scenes/loginForm'
import Routes from './Routes'
import BaselineGrid from "./Scenes/BaselineGrid"
import CreateBaseline from "./Scenes/CreateBaseline"
import './css/bootstrap.min.css'
import './css/bootstrap.css'
import './css/all.css';

import './css/transition.css'


class App extends Component {
  render() {
    return (
      <div className="App stylesContainer">

        <Routes />

      </div>
    );
  }
}

export default App;
