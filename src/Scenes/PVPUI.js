import React, { Component } from 'react';
import LoadingPanel from './Components/LoadingPanel'
import ConnectionCreation from './Components/ConnectionCreation'
import MLVGenerator from './MLVGenerator'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
export default class PVPUI extends Component {

	constructor(props) {
		super(props);
		this.state = {

			isLoading: false,
			objectList: [],
			isModelCreated: true

		}


	}

	isLoading() {

		this.setState({

			isLoading: true
		})

	}

	isNotLoading() {

		this.setState({

			isLoading: false
		})
	}

	setObjectList(objectList) {

		this.setState({
			objectList: objectList
		})
	}

	modelNotCreated() {

		this.setState({
			isModelCreated: false
		})
	}

	modelCreated() {

		this.setState({
			isModelCreated: true
		})

	}




	render() {


		var loading = this.state.isLoading ? (<LoadingPanel />) : "";
		var mountGenerator = "";


		if (this.state.isModelCreated === true) {

			mountGenerator = <MLVGenerator
				objectList={this.state.objectList}
			/>

		} if (this.state.isModelCreated === false) {

			mountGenerator = <LoadingPanel />
		}
		return (

			<div className="container-fluid">


				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<ConnectionCreation
						isLoading={this.isLoading.bind(this)}
						isNotLoading={this.isNotLoading.bind(this)}
						setObjectList={this.setObjectList.bind(this)}
						modelNotCreated={this.modelNotCreated.bind(this)}
						modelCreated={this.modelCreated.bind(this)}
					/>

				</nav>
				{loading}
				<ReactCSSTransitionGroup
					transitionName="example"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}
					style={{ width: "100%" }}
				>
					{mountGenerator}
				</ReactCSSTransitionGroup>

			</div>

		)

	}
}