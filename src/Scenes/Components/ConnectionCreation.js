import React, { Component } from 'react';
import axios from 'axios';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import * as Constants from '../../Constants.js'
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';

export default class ConnectionCreation extends Component {

	constructor(props) {

		super(props);

		this.state = {

			pluginList: [],
			secondarySelectedPlugin: '',
			secondaryConnections: []
		}
		this.selectedPlugin = ""
	}

	componentWillMount() {

		this.props.isLoading();

		axios.post(Constants.url + 'GetPlugins', { p: '1' }, {
			headers: {

				'Content-Type': 'application/json',



			}


		}).then((response) => {

			this.props.isNotLoading();
			var parsedJson = response.data;
			Constants.Constants.MLVFunctions = parsedJson.MLVFunctions;
			Constants.Constants.MLVWhereClauseFunctions = parsedJson.MLVWhereClauseFunctions;
			Constants.Constants.MLVOperators = parsedJson.MLVOperators;
			var pluginList = new Array();
			pluginList = parsedJson.pluginList.split(",")

			this.setState({

				pluginList: pluginList
			})

			this.props.setPluginList(pluginList)

		}).catch(e => {
			console.log(e)
			this.props.isNotLoading();
			alert("Something went wrong")
		})

	}

	setPlugin = (event) => {
		this.props.isLoading();
		axios.post(Constants.url + 'LoadModel', `details=${JSON.stringify({ connectionID: -1, pluginName: event.target.value })}`, {
			headers: {
			}


		}).then((response) => {

			var parsedJson = JSON.parse(atob(response.data))

			var objectList = new Array();
			console.log(parsedJson)
			objectList = parsedJson.objectList;
			var connectionID = parsedJson.connectionID;
			console.log('test')
			console.log(objectList)
			if (objectList.length != 0) {
				var secondaryConnections = new Array()
				secondaryConnections = this.state.secondaryConnections;
				secondaryConnections[0] = {};
				secondaryConnections[0]['pluginName'] = this.state.selectedPlugin;
				secondaryConnections[0]['modelCreated'] = true;
				secondaryConnections[0]['index'] = secondaryConnections.length;
				secondaryConnections[0]['objectList'] = objectList
				secondaryConnections[0]['connectionID'] = connectionID
				this.props.setObjectList(objectList);
				this.props.setConnInfoList(secondaryConnections);
				this.props.modelCreated();
				this.props.isNotLoading();
				this.setState({
					secondaryConnections: secondaryConnections
				})
			}else{
				//alert('Here')
				this.props.modelNotCreated();
				this.props.isNotLoading();
				alert("Model not saved. Please create model")
			}
		})

		this.setState({

			selectedPlugin: event.target.value

		})

	}

	connectionTest(event) {
		event.preventDefault();
		var selectedPlugin = this.state.selectedPlugin;
		if (selectedPlugin === '' || selectedPlugin === null || selectedPlugin === undefined) {
			alert('Please select a plugin to connect to');
			return
		}
		this.props.isLoading();
		axios.post(Constants.url + 'TestConnection', `selectedPlugin=${this.state.selectedPlugin}`, {
			headers: {
			}


		}).then((response) => {
			this.props.isNotLoading();
			if (response.data.status === 'true') {

				alert('Connection Successful')
			} else {

				alert('Connection Test failed')
			}

		}).catch((e) => {
			this.props.isNotLoading();
			console.log(e);
			alert(e);
		})
	}
	createModel(event) {

		event.preventDefault();
		var selectedPlugin = this.state.selectedPlugin
		if (selectedPlugin === '' || selectedPlugin === null || selectedPlugin === undefined) {
			alert('Please select a plugin to connect to');
			return
		}
		this.props.isLoading();
		axios.post(Constants.url + 'CreateModel', `selectedPlugin=${this.state.selectedPlugin}`, {
			headers: {
			}


		}).then((response) => {

			var parsedJson = JSON.parse(atob(response.data))

			var objectList = new Array();
			objectList = parsedJson.objectList;
			var connectionID = parsedJson.connectionID;
			var secondaryConnections = new Array()
			secondaryConnections = this.state.secondaryConnections;
			secondaryConnections[0] = {};
			secondaryConnections[0]['pluginName'] = this.state.selectedPlugin;
			secondaryConnections[0]['modelCreated'] = true;
			secondaryConnections[0]['index'] = secondaryConnections.length;
			secondaryConnections[0]['objectList'] = objectList
			secondaryConnections[0]['connectionID'] = connectionID
			this.props.setObjectList(objectList);
			this.props.setConnInfoList(secondaryConnections);
			this.props.modelCreated();
			this.props.isNotLoading();
			this.setState({
				secondaryConnections: secondaryConnections
			})

		}).catch(e => {
			this.props.isNotLoading();
			console.log(e)
			alert(e)
		})

	}

	// * METHOD TO ADD SECONDARY CONNECTION
	createNewConnection(event) {
		event.preventDefault();
		var secondaryConnections = this.state.secondaryConnections;
		secondaryConnections.push({
			pluginName: '',
			modelCreated: false,
			index: secondaryConnections.length
		})

		this.setState({
			secondaryConnections: secondaryConnections
		})
	}

	selectPluginForNewConnection(event) {
		var secondaryConnections = this.state.secondaryConnections;
		secondaryConnections[event.target.props.index]['pluginName'] = event.target.value
		secondaryConnections[event.target.props.index]['modelCreated'] = false
		this.setState({
			secondaryConnections: secondaryConnections
		})
	}

	testSecondaryConnection(event) {
		this.props.isLoading();
		console.log(event.target.getAttribute('index'))
		event.preventDefault();
		axios.post(Constants.url + 'TestConnection', `selectedPlugin=${this.state.secondaryConnections[event.target.getAttribute('index')].pluginName}`, {
			headers: {
			}


		}).then((response) => {
			this.props.isNotLoading();
			if (response.data.status === 'true') {

				alert('Connection Successful')
			} else {

				alert('Connection Test failed')
			}

		}).catch((e) => {
			console.log(e);
			alert(e);
		})

	}
	createModelForSecondaryConnection(event) {
		this.props.isLoading();
		console.log(event.target.getAttribute('index'))
		var index = event.target.getAttribute('index');
		event.preventDefault();
		axios.post(Constants.url + 'CreateModelForSecondaryConnections', `pluginDetails=${JSON.stringify({ pluginName: this.state.secondaryConnections[event.target.getAttribute('index')].pluginName, index: event.target.getAttribute('index') })}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}


		}).then((response) => {
			this.props.isNotLoading();
			var parsedJson = JSON.parse(atob(response.data))
			var connectionID = parsedJson.connectionID;
			var objectList = new Array();
			objectList = parsedJson.objectList;
			var secondaryConnections = this.state.secondaryConnections;
			secondaryConnections[index]['objectList'] = objectList
			secondaryConnections[index]['connectionID'] = connectionID;
			console.log(secondaryConnections[index]['objectList'])
			this.setState({
				secondaryConnections: secondaryConnections
			})

		})
	}


	render() {
		console.log(this.state.secondaryConnections)
		var secondayConnectionsElement = this.state.secondaryConnections.map((secondaryConnection, index) => {
			if (index === 0) return ''
			return (

				<form className="form-inline" style={{ width: "90%" }}>

					<div className="d-flex justify-content-start" style={{ width: "50%" }}>
						<DropDownList data={this.state.pluginList} index={index} onChange={this.selectPluginForNewConnection.bind(this)} defaultValue="Select Plugin" value={secondaryConnection.pluginName} style={{ width: "100%" }} />
					</div>
					<div className="d-flex justify-content-end" style={{ width: "50%" }}>
						<Button primary={true} index={index} style={{ margin: '1em' }} onClick={this.testSecondaryConnection.bind(this)}>Test Connection</Button>
						<Button primary={true} index={index} style={{ margin: '1em' }} onClick={this.createModelForSecondaryConnection.bind(this)}>Create Model</Button>
					</div>
				</form>

			)

		})


		return (
			<div style={{ width: '100%' }}>
				<div className="row">
					<form className="form-inline" style={{ width: "100%" }}>

						<div className="d-flex justify-content-start" style={{ width: "50%" }}>
							<DropDownList data={this.state.pluginList} defaultValue="Select Plugin" onChange={this.setPlugin.bind(this)} style={{ width: "100%" }} />
						</div>
						<div className="d-flex justify-content-end" style={{ width: "50%" }}>
							<Button primary={false} style={{ margin: '0.5em' }} onClick={this.connectionTest.bind(this)}>Test Connection</Button>
							<Button primary={false} style={{ margin: '0.5em' }} onClick={this.createModel.bind(this)}>Create Model</Button>
						</div>
					</form>
				</div>
				<div className="row justify-content-center" style={{ marginTop: "2em" }}>
					<div className="col-lg-8 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

						{/*<PanelBar >
													<PanelBarItem title={<i style={{ fontSize: "16px" }}>Add Connections</i>}>
														<div className="row justify-content-center" style={{ width: "100%" }}>
															<div className="row justify-content-center">
																<div className="col-lg-2">
																	<Button primary={true} style={{ margin: '1em' }} onClick={this.createNewConnection.bind(this)}>Add Connection</Button>
																</div>
						
															</div>
						
															{secondayConnectionsElement}
														</div>
													</PanelBarItem>
												</PanelBar>*/}
					</div>
				</div>


			</div>

		)
	}
}