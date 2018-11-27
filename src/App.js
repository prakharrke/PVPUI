import React, { Component } from 'react';
import MLVGenerator from './Scenes/MLVGenerator'
import '@progress/kendo-theme-default/dist/all.css';

class App extends Component {
  render() {
    return (
      <div className="App">

        <MLVGenerator />

      </div>
    );
  }
}

export default App;
