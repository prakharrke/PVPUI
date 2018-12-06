import React, { Component } from 'react';
import LoadingPanel from './Components/LoadingPanel'
import ConnectionCreation from './Components/ConnectionCreation'
import MLVGenerator from './MLVGenerator'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Button } from '@progress/kendo-react-buttons';
import CreateBaseline from "./CreateBaseline"
export default class PVPUI extends Component {

	constructor(props) {
		super(props);
		this.state = {

			isLoading: false,
			objectList: [],
			isModelCreated: "",
			mlv: '',
			createBaseline: false

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

	addMLV(mlv) {
		this.setState({
			mlv: mlv
		})
	}
	toggleBaseline(event) {

		event.preventDefault();
		this.setState({
			createBaseline: !this.state.createBaseline
		})
	}




	render() {


		var loading = this.state.isLoading ? (<LoadingPanel />) : "";
		var mountGenerator = "";


		if (this.state.isModelCreated === true && this.state.createBaseline == false) {

			mountGenerator = <MLVGenerator
				objectList={this.state.objectList}
				addMLV={this.addMLV.bind(this)}
			/>

		} if (this.state.isModelCreated === false && this.state.createBaseline == false) {

			mountGenerator = <LoadingPanel />
		}
		if (this.state.createBaseline) {
			mountGenerator = <CreateBaseline
				isLoading={this.isLoading.bind(this)}
				isNotLoading={this.isNotLoading.bind(this)}
				mlv={this.state.mlv}
			/>

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
				<Button className="float-lg-right"
					style={{ textAlign: "center", margin: "1em" }}
					onClick={this.toggleBaseline.bind(this)}
				>
					{this.state.createBaseline ? "Generate MLV" : "Create Baseline"}
				</Button>

			</div>

		)

	}
}