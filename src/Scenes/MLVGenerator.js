import React, { Component } from 'react';
import ConnectionCreation from './Components/ConnectionCreation'

export default class MLVGenerator extends Component{

	constructor(props){

		super(props);

	}

	render(){

		return(
			<div className = "container-fluid">
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
			
				
					<ConnectionCreation />

				
			

			</nav>
			
			</div>
			)
	}

}