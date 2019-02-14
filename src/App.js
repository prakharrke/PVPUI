import React, { Component } from 'react';
import PVPUI from "./Scenes/PVPUI"
import LoginForm from './Scenes/loginForm'
import Routes from './Routes'
import BaselineGrid from "./Scenes/BaselineGrid"
import CreateBaseline from "./Scenes/CreateBaseline"
import './css/bootstrap.min.css'
import './css/bootstrap.css'
import './css/matall.css';
import './css/transition.css'
import * as Constants from './Constants'

class App extends Component {
	componentWillMount(){

		//Constants.url = 'http://localhost:' + '9090' + '/PVPUI/'
		Constants.url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + '/PVPUI/'
    console.log("LOCATION PORT " + Constants.url)
    console.log("LOCATION PORT " + window.location.hostname)
	}
  render() {
    return (
      <div className="App stylesContainer">
      	
        <Routes />

      </div>
    );
  }
}

export default App;
