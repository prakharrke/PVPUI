import React, { Component } from 'react';
import LoadingPanel from './Components/LoadingPanel'
import ConnectionCreation from './Components/ConnectionCreation'
import MLVGenerator from './MLVGenerator'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Button } from '@progress/kendo-react-buttons';
import CreateBaseline from "./CreateBaseline"
import { BrowserRouter, Route, Router, HashRouter, Redirect, Switch } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import WriteBaseline from './WriteBaseline'
import ActivitiesBaseline from './ActivitiesBaseline'
import '../css/transition.css';
import axios from 'axios';
import Connections from './Connections'
import * as Constants from '../Constants'	
import Menu from '@material-ui/icons/Menu';
export default class PVPUI extends Component {

	constructor(props) {
		super(props);
		this.state = {

			isLoading: false,
			objectList: [],
			isModelCreated: "",
			mlv: '',
			createBaseline: false,
			mlvGeneratorState: {},
			connInfoList: [],
			pluginList: [],
			showPanel: false,
			connections: [{connectionName : '', connectionID : '', objectList : '', connectionCreated : false}]

		}


	}
	componentWillMount(){

		this.isLoading();

		axios.post(Constants.url + 'GetPlugins', { p: '1' }, {
			headers: {

				'Content-Type': 'application/json',



			}


		}).then((response) => {

			this.isNotLoading();
			var parsedJson = response.data;
			Constants.Constants.MLVFunctions = parsedJson.MLVFunctions;
			Constants.Constants.MLVWhereClauseFunctions = parsedJson.MLVWhereClauseFunctions;
			Constants.Constants.MLVOperators = parsedJson.MLVOperators;
			var pluginList = new Array();
			pluginList = parsedJson.pluginList.split(",")

			this.setState({

				pluginList: pluginList
			})

			this.setPluginList(pluginList)

		}).catch(e => {
			console.log(e)
			this.isNotLoading();
			alert("Something went wrong")
		})
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

	setConnInfoList(connectionList) {

		this.setState({
			connInfoList: connectionList
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

	// * MEHTOD TO STORE MLV GENERATOR STATE
	loadMLVGeneratorState(mlvGeneratorState) {
		this.setState({
			mlvGeneratorState: {
				...mlvGeneratorState
			}
		})
	}


	onSelect = (event) => {
		switch (event.target.props.route) {
			case '/mlvGenerator':
				//if (this.state.connInfoList.length > 0)
					this.props.history.push(event.target.props.route);
				//else
				//	alert('Please choose base connection first')
				return
				break;
			default:
				this.props.history.push(event.target.props.route);

		}

	}

	setPluginList(pluginList) {
		this.setState({
			...this.state,
			pluginList: pluginList
		})
	}

	togglePanel(event) {
		event.preventDefault();
		this.setState({
			...this.state,
			showPanel: true
		})
	}

	hidePanel(event) {

		this.setState({
			...this.state,
			showPanel: false
		})

	}

	addConnection() {
		
		
		var connections = this.state.connections
		connections.push({
			connectionName: '',
			connectionID: '',
			connectionCreated: false,
			objectList: []
		})
		this.setState({
			connections: connections
		})

	}
	testConnection(index) {
		this.isLoading()
		//var index = event.target.getAttribute('index');
		axios.post(Constants.url + 'TestConnectionNew', `connectionDetails=${JSON.stringify({...this.state.connections[index]})}`, {
			headers: {
			}


		}).then(response => {
			this.isNotLoading()
			alert(response.data)
		}).catch(e => {
			this.isNotLoading()
			alert(e)
		})
	}

	createModel(index) {

		this.isLoading()
		//var index = event.target.getAttribute('index');
		
		axios.post(Constants.url + 'CreateModelNew',  `connectionDetails=${JSON.stringify({...this.state.connections[index]})}`, {
			headers: {
				
			}


		}).then(response => {
			this.isNotLoading()
			var connections = this.state.connections;
			connections[index].objectList = response.data.objectList
			connections[index].connectionCreated = response.data.connectionCreated
			this.setState({
				connections: connections

			})
		}).catch(e => {
			this.isNotLoading()
			alert(e)
		})


	}

	setConnectionName(index, value) {

		
		var connections = this.state.connections;
		connections[index].connectionName = value;
		this.setState({
			connections: connections
		})

	}

	setConnectionID(index, value) {
		
		var connections = this.state.connections;
		connections[index].connectionID = value;
		this.setState({
			connections: connections
		})
	}

	deleteConnection(index) {

		//alert(event.target.getAttribute('index'))
		
		var connections = this.state.connections;
		connections.splice(index, 1)
		this.setState({
			connections: connections
		})
	}

	render() {

		console.log(this.state.connections)
		var loading = this.state.isLoading ? (<LoadingPanel />) : "";
		var mountGenerator = "";


		if (this.state.isModelCreated === true && this.state.createBaseline == false) {

			mountGenerator = <MLVGenerator
				objectList={this.state.objectList}
				connInfoList={this.state.connInfoList}
				addMLV={this.addMLV.bind(this)}
				oldState={this.state.mlvGeneratorState}
				loadMLVGeneratorState={this.loadMLVGeneratorState.bind(this)}
			/>

		}
		 if (this.state.isModelCreated === false && this.state.createBaseline == false) {

			mountGenerator = ""
		}
		if (this.state.createBaseline) {
			mountGenerator = <CreateBaseline
				isLoading={this.isLoading.bind(this)}
				isNotLoading={this.isNotLoading.bind(this)}
				mlv={this.state.mlv}
				mlvGeneratorState={this.state.mlvGeneratorState}
			/>

		}
		return (

			<div className="container-fluid" style={{margin : '1em'}}>

				{loading}
				{/*<nav className="navbar navbar-expand-lg">
									<ConnectionCreation
										isLoading={this.isLoading.bind(this)}
										isNotLoading={this.isNotLoading.bind(this)}
										setObjectList={this.setObjectList.bind(this)}
										modelNotCreated={this.modelNotCreated.bind(this)}
										modelCreated={this.modelCreated.bind(this)}
										setConnInfoList={this.setConnInfoList.bind(this)}
										setPluginList={this.setPluginList.bind(this)}
									/>
				
								</nav>*/}

				<div className="row">
					<div className="col-lg-2">
						<Button
							
							onMouseOver={this.togglePanel.bind(this)}

						><Menu /></Button>
					</div>
				</div>
				<div className="row"
				>


					{this.state.showPanel &&


						<div className="col-lg-2" onMouseLeave={this.hidePanel.bind(this)}>
							<ReactCSSTransitionGroup
								transitionName="example"
								transitionEnterTimeout={500}
								transitionLeaveTimeout={300}>
								<PanelBar
									expandMode={'single'}
									onSelect={this.onSelect.bind(this)}

								>
									<PanelBarItem title={'MLV Generator'} route="/mlvGenerator" />
									<PanelBarItem title={'Read Baseline'} route="/readBaseline" />
									<PanelBarItem title={'Write Baseline'} route="/writeBaseline" />
									<PanelBarItem title={'Activities Baseline'} route="/activitiesBaseline" />
									<PanelBarItem title={'Connections'} route="/connections" />
								</PanelBar>
							</ReactCSSTransitionGroup>
						</div>}

					<div className={`col-lg-${this.state.showPanel ? "10" : "12"}`}>
						<Switch>
							<Route path='/mlvGenerator' render={props => {
								return (<MLVGenerator
									objectList={this.state.objectList}
									connInfoList={this.state.connInfoList}
									addMLV={this.addMLV.bind(this)}
									oldState={this.state.mlvGeneratorState}
									loadMLVGeneratorState={this.loadMLVGeneratorState.bind(this)}
									connections={this.state.connections}
								/>)
							}} />
							<Route path='/readBaseline' render={props => {
								return (<CreateBaseline
									isLoading={this.isLoading.bind(this)}
									isNotLoading={this.isNotLoading.bind(this)}
									mlv={this.state.mlv}
									mlvGeneratorState={this.state.mlvGeneratorState}
								/>)
							}} />

							<Route path='/writeBaseline' render={props => {
								return (<WriteBaseline connInfoList={this.state.connInfoList} pluginList={this.state.pluginList} isLoading={this.isLoading.bind(this)} isNotLoading={this.isNotLoading.bind(this)} />
								)
							}} />
							<Route path='/activitiesBaseline' render={props => {
								return (<ActivitiesBaseline connInfoList={this.state.connInfoList} pluginList={this.state.pluginList} />
								)
							}} />
							<Route path='/connections' render={props => {
								return (<Connections 
									connInfoList={this.state.connInfoList} pluginList={this.state.pluginList} 
									isLoading={this.isLoading.bind(this)} 
									isNotLoading={this.isNotLoading.bind(this)}
									testConnection={this.testConnection.bind(this)}
									createModel={this.createModel.bind(this)}
									setConnectionID={this.setConnectionID.bind(this)}
									setConnectionName={this.setConnectionName.bind(this)} 
									connections={this.state.connections}
									addConnection={this.addConnection.bind(this)}
									deleteConnection={this.deleteConnection.bind(this)}
									/>
								)
							}} />
						</Switch>
					</div>

				</div>
			</div>

		)

	}
}