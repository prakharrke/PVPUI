import React, { Component } from 'react';
import LoadingPanel from './Components/LoadingPanel'
import ConnectionCreation from './Components/ConnectionCreation'
import MLVGenerator from './MLVGenerator'

export default class PVPUI extends Component {

	constructor(props) {
		super(props);
		this.state = {

			isLoading: false
		}


	}

	isLoading() {

		this.setState({

			isLoading: true
		})

	}

	isNotLoading() {

		this.setState({

			isLoading : false 
		})
	}

	render() {
		var loading = this.state.isLoading ? (<LoadingPanel />) : ""
		return (

			<div class="container-fluid">


				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<ConnectionCreation isLoading={this.isLoading.bind(this)} isNotLoading = {this.isNotLoading.bind(this)}/>

				</nav>
				{loading}
				<MLVGenerator />

			</div>

		)

	}
}