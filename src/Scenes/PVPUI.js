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
import Settings from './Settings'
import '../css/transition.css';
import axios from 'axios';
import Connections from './Connections'
import * as Constants from '../Constants'	
import Menu from '@material-ui/icons/Menu';
import StoredProcedureDetails from './StoredProcedureDetails'
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
			connections: [{connectionName : '', connectionID : "-100", objectList : '', connectionCreated : false}],
			writeBaselineState : {}

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
			Constants.MLVFunctions = parsedJson.MLVFunctions;
			Constants.MLVWhereClauseFunctions = parsedJson.MLVWhereClauseFunctions;
			Constants.MLVOperators = parsedJson.MLVOperators;
			console.log(Constants.MLVFunctions)
			console.log(Constants.MLVWhereClauseFunctions)
			console.log(Constants.MLVOperators)
			var pluginList = new Array();
			pluginList = parsedJson.pluginList.split(",")

			this.setState({
				...this.state,
				pluginList: pluginList
			})

			this.setPluginList(pluginList)

		}).catch(e => {
			console.log(e)
			this.isNotLoading();
			alert("Something went wrong")
		})
		this.isLoading()
		axios.post(Constants.url + 'GetConnectionsList', { p: '1' }, {
			headers: {

				'Content-Type': 'application/json',



			}


		}).then(response=>{
			this.isNotLoading()
			this.setState({
				connections : response.data
			})
		}).catch(e=>{

			this.isNotLoading()
			alert(e)
		})
	}

	setBaseConnection(baseConnection){
		this.setState({
			...this.state,
			baseConnection : {
				...baseConnection
			}
		})
	}

	isLoading() {

		this.setState({
			...this.state,
			isLoading: true
		})

	}

	isNotLoading() {

		this.setState({
			...this.state,
			isLoading: false
		})
	}

	setObjectList(objectList) {

		this.setState({
			...this.state,
			objectList: objectList
		})
	}

	setConnInfoList(connectionList) {

		this.setState({
			...this.state,
			connInfoList: connectionList
		})
	}

	modelNotCreated() {

		this.setState({
			...this.state,
			isModelCreated: false
		})
	}

	modelCreated() {

		this.setState({
			...this.state,
			isModelCreated: true
		})

	}

	addMLV(mlv) {
		this.setState({
			...this.state,
			mlv: mlv
		})
	}
	toggleBaseline(event) {

		event.preventDefault();
		this.setState({
			...this.state,
			createBaseline: !this.state.createBaseline
		})
	}

	// * MEHTOD TO STORE MLV GENERATOR STATE
	loadMLVGeneratorState(mlvGeneratorState) {
	
		this.setState({
			...this.state,
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
		var connectionID =-100;
		
		if(!connections.length == 0){

			connectionID = -109 - (connections.length)
		}

		connections.push({
			connectionName: '',
			connectionID: connectionID.toString(),
			connectionCreated: false,
			objectList: []
		})
		this.setState({
			...this.state,
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

		console.log(index)
		if(this.state.connections[index].connectionName === ''){
			alert('Please choose connection')
			return
		}
		if(this.state.connections[index].connectionID === ''){
			alert('Please set connection ID')
			return
		}
		var connectionID = this.state.connections[index].connectionID;
		var exit = false
		this.state.connections.map((connection, connIndex)=>{

			if(connection.connectionID === connectionID && index != connIndex){
				alert('ConnectionID needs to be unique')
				exit = true
			}
		})
		if(exit){
			return
		}
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
			...this.state,
			connections: connections
		})

	}

	setConnectionID(index, value) {
		
		var connections = this.state.connections;
		connections[index].connectionID = value;
		this.setState({
			...this.state,
			connections: connections
		})
	}

	deleteConnection(index) {

		//alert(event.target.getAttribute('index'))
		
		var connections = this.state.connections;
		connections.splice(index, 1)
		this.setState({
			...this.state,
			connections: connections
		})
	}

	saveWriteBaselineState(baselineState){

		this.setState({

			writeBaselineState : {...baselineState}
		})
	}

	render() {
		
		var connections = new Array();
		this.state.connections.map((connection, index)=>{
			if(connection.connectionCreated)
				connections.push(connection)
		})
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
							primary={true}
							onMouseOver={this.togglePanel.bind(this)}

						><Menu /></Button>
					</div>
				</div>
				<div className="row">


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
									<PanelBarItem title={'Registered Stored Procedures'} route="/storedprocedures" />
									<PanelBarItem title={'Connections'} route="/connections" />
									<PanelBarItem title={'Settings'} route="/settings" />
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
									connections={connections}
									setBaseConnection={this.setBaseConnection.bind(this)}
								/>)
							}} />
							<Route path='/readBaseline' render={props => {
								return (<CreateBaseline
									isLoading={this.isLoading.bind(this)}
									isNotLoading={this.isNotLoading.bind(this)}
									mlv={this.state.mlv}
									connections={connections}
									mlvGeneratorState={this.state.mlvGeneratorState}
									baseConnection={this.state.mlvGeneratorState.baseConnection}
								/>)
							}} />

							<Route path='/writeBaseline' render={props => {
								return (<WriteBaseline connections={connections} connInfoList={this.state.connInfoList} pluginList={this.state.pluginList} isLoading={this.isLoading.bind(this)} isNotLoading={this.isNotLoading.bind(this)} saveWriteBaselineState={this.saveWriteBaselineState.bind(this)} writeBaselineState={this.state.writeBaselineState} />
								)
							}} />
							<Route path='/activitiesBaseline' render={props => {
								return (<ActivitiesBaseline connections={this.state.connections} pluginList={this.state.pluginList} isLoading={this.isLoading.bind(this)}
									isNotLoading={this.isNotLoading.bind(this)} />
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
							<Route path='/storedprocedures' render={props => {
								return (<StoredProcedureDetails 
									
									isLoading={this.isLoading.bind(this)} 
									isNotLoading={this.isNotLoading.bind(this)}
									connections={this.state.connections}
									/>
								)
							}} />
							<Route path='/settings' render={props => {
								return (<Settings />
								)
							}} />
						</Switch>
					</div>

				</div>
			</div>

		)

	}
}