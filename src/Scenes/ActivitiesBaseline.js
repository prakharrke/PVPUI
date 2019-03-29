import React, { Component } from 'react';
import * as Constants from '../Constants'
import { Button, DropDownButton } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import MLVGenerator from './MLVGenerator';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import axios from 'axios';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import LoadingPanel from './Components/LoadingPanel'
export default class ActivitiesBaseline extends Component {

	resultSetListIndex = 0;
	listOfResultSetList = new Array()
	constructor(props) {
		super(props);
		this.currentActivityIndex = 0;
		this.currentConnection = ''
		this.state = {
			activities: [{
				activityName: 'Activity',
				activityType: '',
				mlv: '',
				filter: '',
				ID: '',
				PID: '',
				LEV: '',
				PIN: '',
				MLVLEFTOBJ: '',
				MLVRIGHTOBJ: '',
				MLVOBJECT: '',
				attributes: ['MLVLEFTOBJ', 'MLVRIGHTOBJ', 'MLVOBJECT'],
				values: [[]],
				connection: { connectionID: '', connectionName: '' },
				saveResultSet: true,
				useResultSet: '',
				resultSetVariable: 'rs' + '_' + new Date().getTime(),
				attributeGroupIndex: 0
			}],
			mountMLVGenerator: false,
			resultSetList: [],
			resultsetOperation: '',
			showResultSet: false,
			columnNames: [],
			resultSetCount: 0,
			blurState: false,
			baslineFilesList: [],
			selectedBaseline: '',
			newBaselineName: '',
			testCaseDescription: ''

		}

	}

	componentWillMount() {
		this.props.isLoading();
		axios.post(Constants.url + 'GetActivitiesBaselineFilesList', `MLV=${JSON.stringify({ mlv: this.state.mlv, filter: '' })}`, {
			headers: {
			}


		}).then(response => {
			this.props.isNotLoading()
			console.log(response.data)
			//this.isNotLoading();
			this.setState({
				baslineFilesList: response.data,

			})
		}).catch(e=>{
			this.props.isNotLoading();
			alert(e)
		})
	}

	addActivity(event) {
		console.log(event.item)
		var index = event.target.props.id

		if (event.item === 'Before')
			this.addActivityBefore(index);
		if (event.item === 'After')
			this.addActivityAfter(index);



	}

	deleteActivity(event) {
		event.preventDefault();
		var activities = this.state.activities;
		var index = event.target.getAttribute('id');
		if (activities.length === 1) {
			alert('At least one activity is requied')
			return
		}
		activities.splice(index, 1);
		this.setState({
			...this.state,
			activities: activities
		})
	}
	setActivityType(event) {
		var index = event.target.props.id;
		var activities = this.state.activities;
		activities[index].activityType = event.target.value;
		activities[index].activityName = event.target.value;
		this.setState({
			...this.state,
			activities: activities
		})
	}
	setActivityConnection(event) {
		var index = event.target.props.id;
		var activities = this.state.activities;
		activities[index].connection = { ...event.target.value };
		this.setState({
			activities: activities
		})
	}
	generateMLV(event) {
		event.preventDefault();

		this.currentActivityIndex = event.target.getAttribute('id');
		this.currentConnection = this.state.activities[event.target.getAttribute('id')].connection;
		if (this.state.activities[event.target.getAttribute('id')].connection.connectionID === '') {
			alert('Please Select Activity Connection')
			return
		}
		if (this.state.activities[event.target.getAttribute('id')].activityType === '') {
			alert('Please Select Activity Type')
			return
		}
		this.setState({
			mountMLVGenerator: true
		})
	}
	saveGeneratedMLV(mlv) {
		console.log(mlv)
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				var activities = this.state.activities;
				activities[this.currentActivityIndex].mlv = mlv
				activities[this.currentActivityIndex].attributes = activities[this.currentActivityIndex].attributes.concat(temp)
				this.setState({
					activities: activities,
					mountMLVGenerator: false
				})
			} catch (e) {

				alert('Error while parsing MLV')
			}
		} else {
			var activities = this.state.activities;
			activities[this.currentActivityIndex].mlv = mlv
			activities[this.currentActivityIndex].attributes = []
			this.setState({
				activities: activities,
				mountMLVGenerator: false,
				[`attributeGroupIndex_${this.currentActivityIndex}`]: 0
			})
		}
	}

	saveMLV(event) {
		var mlv = event.target.value;
		var index = event.target.id;
		this.currentActivityIndex = index;
		this.saveGeneratedMLV(mlv)
	}
	addFilter(event) {

		var activities = this.state.activities;
		activities[event.target.id].filter = activities[event.target.id].filter + ' ' + event.target.value
		this.setState({
			...this.state,
			activities: activities
		})
	}
	editFilter(event) {
		var index = event.target.props.id;
		var activities = this.state.activities;
		activities[index].filter = event.target.value
		this.setState({
			...this.state,
			activities: activities
		})
	}
	saveResultSet(event) {
		event.preventDefault();
		var index = event.target.getAttribute("id");
		var activities = this.state.activities;
		activities[index].saveResultSet = !activities[index].saveResultSet

		this.setState({
			...this.state,
			activities: activities
		})
	}
	setUseResultSet(event) {
		var index = event.target.props.id;
		var activities = this.state.activities
		activities[index].useResultSet = event.target.value;
		this.setState({
			...this.state,
			activities: activities
		})
	}

	setRSVariable(event) {
		var activities = this.state.activities
		var index = event.target.props.id
		activities[index].resultSetVariable = event.target.value

		this.setState({
			...this.state,
			activities: activities
		})
	}

	addColumnValuePairFromSavedResultSet(event) {

		var index = event.target.id;
		var activities = this.state.activities;
		var activityType = activities[index].activityType;
		var newValuesArray = new Array();
		activities[index].values.push(newValuesArray);
		activities[index].values[0].push({
			attributeName: event.target.value,
			value: ''
		})

		this.setState({
			...this.state,
			activities: activities
		})


	}
	setColumnValueFromSavedResultSet(event) {

		var index = event.target.props.id;
		var label = event.target.props.label;

		var attributeIndex = event.target.props.attributeIndex;
		var activities = this.state.activities;
		activities[index].values[0].map((value, index) => {
			if (index === attributeIndex)
				value.value = event.target.value
		})

		if (label === 'MLVLEFTOBJ') {
			activities[index].MLVLEFTOBJ = event.target.value
		}

		if (label === 'MLVRIGHTOBJ') {
			activities[index].MLVRIGHTOBJ = event.target.value
		}
		if (label === 'MLVOBJECT') {
			activities[index].MLVOBJECT = event.target.value
		}
		this.setState({
			...this.state,
			activities: activities
		})
	}
	deleteAttributeValuePairForSavedResultset(event) {
		event.preventDefault();
		var index = event.target.getAttribute('id');
		var attributeIndex = event.target.getAttribute('attributeIndex');
		var activities = this.state.activities
		activities[index].values[0].splice(attributeIndex, 1)
		this.setState({
			...this.state,
			activities: activities
		})

	}
	addAttributeValueGroup(event) {
		event.preventDefault();
		var activities = this.state.activities;
		var attributeValuePair = new Array();
		var index = event.target.getAttribute('id');
		activities[index].values[0].map((object) => {

			attributeValuePair.push({
				attributeName: object.attributeName,
				value: ''
			})
		})
		activities[index].values.push(attributeValuePair)
		//activities[index].attributeGroupIndex = activities[index].attributeGroupIndex + 1
		this.setState({
			...this.state,
			activities: activities
		})
	}
	addColumnValuePair(event) {
		var index = event.target.id;
		var activities = this.state.activities;
		activities[index].values.map((value, index) => {
			value.push({
				attributeName: event.target.value,
				value: ''
			})
		})

		this.setState({
			...this.state,
			activities: activities
		})
	}
	setColumnValue(event) {
		var index = event.target.props.id;
		var attributeIndex = event.target.props.attributeIndex;
		var activities = this.state.activities
		var attributeGroupIndex = activities[index].attributeGroupIndex;
		activities[index].values[attributeGroupIndex][attributeIndex].value = event.target.value

		this.setState({
			...this.state,
			activities: activities
		})
	}

	moveLeftAttributeValueGroup(event) {
		event.preventDefault();
		var activities = this.state.activities
		var index = event.target.getAttribute('id');
		var attributeGroupIndex = activities[index].attributeGroupIndex;
		if (attributeGroupIndex === 0) {
			return
		}
		else {
			activities[index].attributeGroupIndex = activities[index].attributeGroupIndex - 1
		}
		this.setState({
			...this.state,
			activities: activities
		})

	}

	moveRightAttributeValueGroup(event) {
		event.preventDefault();
		var activities = this.state.activities
		var index = event.target.getAttribute('id');
		var attributeGroupIndex = activities[index].attributeGroupIndex;
		if (attributeGroupIndex === activities[index].values.length - 1) {
			return
		}
		else {
			activities[index].attributeGroupIndex = activities[index].attributeGroupIndex + 1
		}
		this.setState({
			...this.state,
			activities: activities
		})

	}

	deleteAttributeValuePair(event) {
		event.preventDefault();
		var index = event.target.getAttribute('id');
		var attributeIndex = event.target.getAttribute('attributeIndex');
		var activities = this.state.activities;
		var attributeGroupIndex = activities[index].attributeGroupIndex
		activities[index].values[attributeGroupIndex].splice(attributeIndex, 1)
		this.setState({
			...this.state,
			activities: activities
		})

	}
	deleteAttributeValueGroup(event) {
		event.preventDefault();
		var index = event.target.getAttribute('id');
		var activities = this.state.activities
		if (activities[index].values.length === 1) {
			alert('At least one value set is required')
			return
		} else {
			activities[index].values.splice(activities[index].attributeGroupIndex, 1)
			if (activities[index].attributeGroupIndex > activities[index].values.length - 1)
				activities[index].attributeGroupIndex = activities[index].attributeGroupIndex - 1
		}
		this.setState({
			...this.state,
			activities: activities
		})

	}
	addActivityAfter(index) {

		//event.preventDefault();
		//var index = event.target.getAttribute('id')
		var activities = this.state.activities;
		var activitiesFirst = new Array()
		var activitiesSecond = new Array();
		activities.map((activity, activityIndex) => {

			if (activityIndex <= index)
				activitiesFirst.push(activity)
			else
				activitiesSecond.push(activity)
		})
		activitiesFirst.push({
			activityName: 'Activity',
			activityType: '',
			mlv: '',
			filter: '',
			ID: '',
			PID: '',
			LEV: '',
			PIN: '',
			MLVLEFTOBJ: ' ',
			MLVRIGHTOBJ: ' ',
			MLVOBJECT: '',
			attributes: [],
			values: [[]],
			connection: { connectionID: '', connectionName: '' },
			saveResultSet: true,
			useResultSet: '',
			resultSetVariable: 'rs' + '_' + new Date().getTime(),
			attributeGroupIndex: 0
		})

		this.setState({
			...this.state,
			activities: activitiesFirst.concat(activitiesSecond)
		})

	}
	addActivityBefore(index) {

		//event.preventDefault();
		//var index = event.target.getAttribute('id')
		var activities = this.state.activities;
		var activitiesFirst = new Array()
		var activitiesSecond = new Array();
		activities.map((activity, activityIndex) => {

			if (activityIndex < index)
				activitiesFirst.push(activity)
			else
				activitiesSecond.push(activity)
		})
		activitiesFirst.push({
			activityName: 'Activity',
			activityType: '',
			mlv: '',
			filter: '',
			ID: '',
			PID: '',
			LEV: '',
			PIN: '',
			MLVLEFTOBJ: ' ',
			MLVRIGHTOBJ: ' ',
			MLVOBJECT: '',
			attributes: [],
			values: [[]],
			connection: { connectionID: '', connectionName: '' },
			saveResultSet: true,
			useResultSet: '',
			resultSetVariable: 'rs' + '_' + new Date().getTime(),
			attributeGroupIndex: 0
		})

		this.setState({
			...this.state,
			activities: activitiesFirst.concat(activitiesSecond)
		})

	}
	setID(event) {
		var index = event.target.props.id
		var activities = this.state.activities;
		activities[index].ID = event.target.value;
		this.setState({
			...this.state,
			activities: activities
		})
	}
	setPID(event) {
		var index = event.target.props.id
		var activities = this.state.activities;
		activities[index].PID = event.target.value;
		this.setState({
			...this.state,
			activities: activities
		})
	}
	setLEV(event) {
		var index = event.target.props.id
		var activities = this.state.activities;
		activities[index].LEV = event.target.value;
		this.setState({
			...this.state,
			activities: activities
		})
	}
	setPIN(event) {
		var index = event.target.props.id
		var activities = this.state.activities;
		activities[index].PIN = event.target.value;
		this.setState({
			...this.state,
			activities: activities
		})
	}

	executeActivities(event) {
		event.preventDefault();
		this.props.isLoading();
		axios.post(Constants.url + 'ExecuteActivities', `activities=${encodeURIComponent(JSON.stringify({ activities: this.state.activities }))}`, {
			headers: {
			}


		}).then(response => {
			this.props.isNotLoading();
			console.log('RESULT SET DATA')
			console.log(response.data)
			var resultSets = response.data
			this.listOfResultSetList = response.data
			this.computeResultSet(this.listOfResultSetList[this.resultSetListIndex])
		}).catch(e => {
			this.props.isNotLoading();
			console.log(e)
			alert(e)
		})

	}

	decreaseIndex(event) {
		var length = this.listOfResultSetList.length;
		if (this.resultSetListIndex === 0) {
			this.resultSetListIndex = 0
		}
		else {
			this.resultSetListIndex = this.resultSetListIndex - 1;
		}
		if (length !== 0) {
			this.computeResultSet(this.listOfResultSetList[this.resultSetListIndex])
		}

	}

	increaseIndex(event) {
		var length = this.listOfResultSetList.length;


		if (this.resultSetListIndex === (length - 1)) {
			this.resultSetListIndex = (length - 1)
		}
		else {
			this.resultSetListIndex = this.resultSetListIndex + 1
		}
		if (length !== 0) {
			this.computeResultSet(this.listOfResultSetList[this.resultSetListIndex])
		}
	}
	closeResultSet(event) {
		event.preventDefault();
		this.setState({
			showResultSet: false,
			blurState: false
		})
	}

	computeResultSet(response) {


		try {
			console.log('^^^^^^^^^^^^^^^^^^')
			console.log(response)
			var resultsetList = new Array();

			//alert(response)

			//alert(response.length)

			var parsed = JSON.parse(response);
			console.log(parsed)
			// columnsNames array to hold decoded keys (columns in resultset)
			var resultsetOperation = JSON.parse(parsed[0]).operation;
			
			if(JSON.parse(parsed[0]).columnNames.length > 0){
			var columnNames = new Array();



			//var keys = Object.keys(parsed[0]);
			columnNames = JSON.parse(parsed[0]).columnNames;
			
			// populating columnNames array by decoding every element of keys array

			/*for (var i = 0; i < keys.length; i++) {

				var key = keys[i];

				columnNames[i] = atob(key);


			}*/

			this.setState({
				...this.state,
				columnNames: JSON.parse(parsed[0]).columnNames,
				resultsetOperation: resultsetOperation
			})

			// * Populating resultsetList array with decoded values from the parsed resultset received.

			for (var i = 0; i < parsed.length; i++) {


				var temp = {};

				for (var j = 0; j < columnNames.length; j++) {


					var value = JSON.parse(parsed[i])[columnNames[j]];

					// * fetching value from pared resultset and decoding it
					console.log(value);

					temp[columnNames[j]] = value;
				}

				resultsetList[i] = temp;
			}

			console.log(temp)

			console.log(resultsetList);

			//this.isNotLoading();
			}
			this.setState({
				...this.state,
				columnNames: JSON.parse(parsed[0]).columnNames.length > 0 ? JSON.parse(parsed[0]).columnNames: ['defaultColumn'],
				resultsetOperation:   resultsetOperation ,
				resultSetList: JSON.parse(parsed[0]).columnNames.length > 0 ? resultsetList : [{defaultColumn : 'Empty resultset'}],
				showResultSet: true,
				blurState: true,
				resultSetCount: JSON.parse(parsed[0]).columnNames.length > 0 ? resultsetList.length : 0

			})

		} catch{
			//this.isNotLoading();
			alert("Emtpy result set")

		}

	}

	selectBaseline(event) {

		this.setState({
			...this.state,
			selectedBaseline: event.target.value,
			newBaselineName: ''
		})
	}

	addNewBaseline(event) {
		this.setState({
			...this.state,
			newBaselineName: event.target.value,
			selectedBaseline: ''
		})
	}

	setTestCaseDescription(event) {
		this.setState({
			...this.state,
			testCaseDescription: event.target.value
		})
	}

	generateBaseline(event) {
		event.preventDefault();
		
		if (this.state.selectedBaseline === '' && this.state.newBaselineName === '') {
			alert('Please select baseline')
			return
		}
		if (this.state.testCaseDescription === '') {
			alert('Please add test case description')
			return
		}
		this.props.isLoading();
		var baselineName = '';
		if (this.state.selectedBaseline === '' && this.state.newBaselineName != '')
			baselineName = this.state.newBaselineName + ".xlsx";

		if (this.state.selectedBaseline != '' && this.state.newBaselineName == '')
			baselineName = this.state.selectedBaseline;
		axios.post(Constants.url + 'AddActivitiesToBaseline', `details=${encodeURIComponent(JSON.stringify({ activities: this.state.activities, baselineName: baselineName, baselineNameTruncated : baselineName }))}`, {
			headers: {
			}


		}).then(response => {
			this.props.isNotLoading();
			alert(response.data)
		}).catch(e=>{
			this.props.isNotLoading();
			alert(e)
		})

	}


	render() {
		console.log(this.state.activities)

		var mlvGenerator = this.state.mountMLVGenerator ? (
			<MLVGenerator
				oldState={{}}
				writeConnection={this.currentConnection}
				connections={this.props.connections}
				parent="Activities"
				saveGeneratedMLV={this.saveGeneratedMLV.bind(this)}
			/>
		) : ''
		var columnsElement = this.state.columnNames.map((column) => {


			return (

				<Column
					field={column}
					title={column}
					minResizableWidth={'250px'}
					width={'250px'}
				/>


			)
		})
		return (
			<div>
				<div className="container-fluid" style={{ marginTop: "2em", filter: this.state.blurState ? "blur(40px)" : "none" }}>
					{mlvGenerator}
					<div className="row justify-content-center">
						<div className="col-lg-6 justify-content-center">
							<DropDownList
								style={{ margin: "1em", width: "100%" }}
								data={this.state.baslineFilesList}
								label="Select baseline file"
								onChange={this.selectBaseline.bind(this)}
								value={this.state.selectedBaseline}
							/>
							<Input

								label="Add a new baseline instead.."
								value={this.state.newBaselineName}
								style={{ width: "100%", textAlign: "center", margin: "1em" }}
								onChange={this.addNewBaseline.bind(this)}

							/>


						</div>
					</div>
					<div className="row justify-content-center">

						<div className="col-lg-6">
							<form className="k-form">
								<Input
									required={true}
									label="Test Case Description*"
									style={{ width: "90%", textAlign: "center", margin: "1em" }}
									onChange={this.setTestCaseDescription.bind(this)}
									value={this.state.testCaseDescription}
								/>
							</form>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-lg-2">
							<Button
								primary={true}
								style={{ margin: '1em' }}
								//id={object.index}
								onClick={this.executeActivities.bind(this)}
							>Execute</Button>
						</div>
						<div className="col-lg-2">
							<Button
								primary={true}
								style={{ margin: '1em' }}
								//id={object.index}
								onClick={this.generateBaseline.bind(this)}
							>Generate Baseline</Button>
						</div>
					</div>
					<div className="row justify-content-center" style={{ width: "100%" }}>
						<div className="col-lg-10 justify-content-center panel-wrapper" style={{ maxWidth: "90%", margin: "0 auto" }}>

							{
								this.state.activities.map((activity, index) => {

									return (
										<div className='row'>
											<div className="col-lg-10">
												<PanelBar >
													<PanelBarItem title={<i style={{ fontSize: "12px" }}>{activity.activityName}</i>}>
														<div className="row justify-content-center">
															<div className="col-lg-4">
																<DropDownList
																	data={Constants.activityTypes}
																	label="Activity Type"
																	id={index}
																	style={{ width: '100%', margin: '1em' }}
																	onChange={this.setActivityType.bind(this)}
																	value={activity.activityType}
																/>
															</div>
															<div className="col-lg-4">
																<DropDownList
																	data={this.props.connections}
																	label="Connection"
																	id={index}
																	textField='connectionName'
																	dataItemKey='connectionID'
																	style={{ width: '100%', margin: '1em' }}
																	onChange={this.setActivityConnection.bind(this)}
																	value={activity.connection}
																/>
															</div>
															<div className="col-lg-2">
																<Button
																	primary={true}
																	style={{ margin: '1em' }}
																	id={index}
																	onClick={this.deleteActivity.bind(this)}
																>Delete</Button>
															</div>
														</div>
														<div className="row justify-content-center">
															<div className="col-lg-1" style={{ margin: '1em' }}>
																<Button
																	primary={true}
																	style={{ margin: '1em' }}
																	id={index}
																	onClick={this.generateMLV.bind(this)}
																>Genrate</Button>
															</div>
															<div className="col-lg-9" style={{ margin: '1em' }}>
																<textarea
																	placeholder="MLV*"
																	class="form-control rounded-0"
																	rows="5"
																	id={index}
																	value={activity.mlv}
																	style={{ width: '100%' }}
																	onChange={this.saveMLV.bind(this)}
																>

																</textarea>
															</div>
														</div>
														<div className="row justify-content-center">
															<div className="col-lg-10" tabIndex="0">
																<Input

																	placeholder="Filter"
																	style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
																	onChange={this.editFilter.bind(this)}
																	value={activity.filter}
																	id={index}
																/>
															</div>
														</div>
														<div className="row justify-content-center">
															<div className="col-lg-4" style={{ margin: '1em' }}>
																<select
																	multiple
																	className="form-control"
																	size={10}
																	style={{ overflowX: "scroll" }}
																>
																	{activity.attributes.map((attributeName) => {
																		return (
																			<option
																				value={attributeName}
																				id={index}
																				onDoubleClick={this.addFilter.bind(this)}
																			>{attributeName}</option>

																		)
																	})}
																</select>
															</div>

															<div className="col-lg-2" style={{ margin: '1em' }}>
																<select
																	multiple
																	className="form-control"
																	size={10}
																	style={{ overflowX: "scroll" }}
																>
																	{
																		Constants.MLVOperators.map((operator) => {

																			return (

																				<option
																					id={index}
																					onDoubleClick={this.addFilter.bind(this)}
																					value={operator}>{operator}</option>
																			)
																		})
																	}
																</select>
															</div>

															<div className="col-lg-4" style={{ margin: '1em' }}>
																<select
																	multiple
																	className="form-control"
																	size={10}

																	style={{ overflowX: "scroll" }}
																>
																	{
																		Constants.MLVWhereClauseFunctions.map((func) => {

																			return (

																				<option
																					value={func}
																					id={index}
																					onDoubleClick={this.addFilter.bind(this)}
																				>{func}</option>
																			)
																		})
																	}
																</select>
															</div>
														</div>
														<div className="row justify-content-center">
															<div className="col-lg-3">
																<DropDownList
																	data={[''].concat(activity.attributes)}
																	label="ID"
																	id={index}
																	style={{ width: '100%', margin: '1em' }}
																	onChange={this.setID.bind(this)}
																	value={activity.ID}
																/>

															</div>
															<div className="col-lg-3">
																<DropDownList
																	data={[''].concat(activity.attributes)}
																	label="PID"
																	id={index}
																	style={{ width: '100%', margin: '1em' }}
																	onChange={this.setPID.bind(this)}
																	value={activity.PID}
																/>
															</div>
															<div className="col-lg-3">

																<DropDownList
																	data={[''].concat(activity.attributes)}
																	label="LEV"
																	id={index}
																	style={{ width: '100%', margin: '1em' }}
																	onChange={this.setLEV.bind(this)}
																	value={activity.LEV}
																/>
															</div>
															<div className="col-lg-3">
																<DropDownList
																	data={[''].concat(activity.attributes)}
																	label="PIN"
																	id={index}
																	style={{ width: '100%', margin: '1em' }}
																	onChange={this.setPIN.bind(this)}
																	value={activity.PIN}
																/>
															</div>
														</div>
														{activity.activityType === 'Select' ?
															(<div className="row justify-content-center">
																<div className="col-lg-3" style={{ margin: '1em' }}>
																	<Button
																		primary={true}
																		style={{ margin: '1em' }}
																		id={index}
																		onClick={this.saveResultSet.bind(this)}
																	>Save ResultSet</Button>
																	<Switch
																		style={{ margin: "1em" }}
																		checked={activity.saveResultSet}
																	/>
																</div>
																<div className="col-lg-3">
																	<Input

																		label={"RS Variable"}
																		//groupIndex={this.state[`attributeGroupIndex_${object.index}`]}
																		id={index}

																		style={{ width: '80%', margin: '2em' }}
																		onChange={this.setRSVariable.bind(this)}
																		value={activity.resultSetVariable}
																	/>
																</div>
															</div>) : ''}
														{
															activity.activityType != 'Select' && activity.activityType != 'Delete' && activity.activityType != 'Stored Procedure' && activity.activityType != '' ? (


																<PanelBarItem title={<i style={{ fontSize: "12px" }}>{activity.activityName + ' Values'}</i>}>
																	<div className="row justify-content-center">
																		<div className="col-lg-4">


																			<DropDownList
																				data={
																					this.state.activities.map((act, actIndex) => {
																						if (act.saveResultSet && actIndex < index)
																							return act.resultSetVariable
																						else
																							return ''
																					})
																				}
																				label="Use ResultSet"
																				id={index}
																				style={{ width: '100%', margin: '1em' }}
																				onChange={this.setUseResultSet.bind(this)}
																				value={activity.useResultSet}
																			/>



																		</div>
																	</div>
																	{
																		activity.useResultSet != '' ? (
																			<div className="row justify-content-center">
																				<div className="col-lg-4">
																					<select
																						multiple
																						className="form-control"
																						size={10}
																						style={{ overflowX: "scroll" }}
																					>
																						{activity.attributes.map((attributeName) => {
																							return (
																								<option
																									value={attributeName}
																									id={index}
																									onDoubleClick={this.addColumnValuePairFromSavedResultSet.bind(this)}
																								>{attributeName}</option>

																							)
																						})}
																					</select>
																				</div>
																				<div className="col-lg-4">

																					{

																						//Array.isArray(activity.values[0]) &&
																						activity.values[0].map((value, valueIndex) => {

																							var attributeValueMap = new Array()
																							this.state.activities.map((act, actIndex) => {

																								if (act.resultSetVariable === activity.useResultSet) {
																									attributeValueMap = act.attributes
																								}
																							})
																							return (
																								<div className='row'>
																									<div className='col-lg-10'>


																										{
																											value.attributeName === 'MLVLEFTOBJ' || value.attributeName === 'MLVRIGHTOBJ' || value.attributeName === 'MLVOBJECT' ?
																												(
																													<Input
																														label={value.attributeName}
																														id={index}
																														attributeIndex={valueIndex}
																														style={{ width: '100%', margin: '1em' }}
																														onChange={this.setColumnValueFromSavedResultSet.bind(this)}
																														value={value.value}
																													/>

																												) :

																												(
																													<DropDownList
																														data={attributeValueMap}

																														label={value.attributeName}
																														id={index}
																														attributeIndex={valueIndex}
																														style={{ width: '100%', margin: '1em' }}
																														onChange={this.setColumnValueFromSavedResultSet.bind(this)}
																														value={value.value}
																													/>)}
																									</div>
																									<div className='col-lg-2'>
																										<Button
																											primary={true}
																											id={index}
																											attributeIndex={valueIndex}
																											style={{ margin: '1em' }}
																											onClick={this.deleteAttributeValuePairForSavedResultset.bind(this)}
																										>{"Delete"}</Button>
																									</div>
																								</div>
																							)
																						})
																					}
																				</div>
																			</div>
																		) : (
																				<div>
																					{
																						activity.activityType === 'Insert' || activity.activityType === 'Bulk Insert' ?
																							(
																								<div>
																									<div className="row justify-content-center">

																										<div className="col-lg-1">
																											<Button
																												primary={true}
																												id={index}
																												style={{ margin: '1em' }}
																												onClick={this.moveLeftAttributeValueGroup.bind(this)}
																											>{'<'}</Button>
																										</div>
																										<div className="col-lg-1">
																											<Button
																												primary={true}
																												id={index}
																												style={{ margin: '1em' }}
																												onClick={this.addAttributeValueGroup.bind(this)}
																											>{'+'}</Button>
																										</div>
																										<div className="col-lg-1">
																											<Button
																												primary={true}
																												id={index}
																												style={{ margin: '1em' }}
																												onClick={this.deleteAttributeValueGroup.bind(this)}
																											>{'X'}</Button>
																										</div>
																										<div className="col-lg-1">
																											<Button
																												primary={true}
																												id={index}
																												style={{ margin: '1em' }}
																												onClick={this.moveRightAttributeValueGroup.bind(this)}
																											>{'>'}</Button>
																										</div>

																									</div>
																									<div className="row justify-content-center">
																										<div className="col-lg-1">
																											{
																												activity.attributeGroupIndex + 1 + ' of ' + activity.values.length}
																										</div>


																									</div>
																								</div>) : ''
																					}
																					<div className="row justify-content-center">
																						<div className="col-lg-4">
																							<select
																								multiple
																								className="form-control"
																								size={10}
																								style={{ overflowX: "scroll" }}
																							>
																								{activity.attributes.map((attributeName) => {
																									return (
																										<option
																											value={attributeName}
																											id={index}
																											onDoubleClick={this.addColumnValuePair.bind(this)}
																										>{attributeName}</option>

																									)
																								})}
																							</select>
																						</div>
																						<div className="col-lg-6">
																							{
																								activity.values[activity.attributeGroupIndex].map((value, valueIndex) => {

																									return (
																										<div className='row'>
																											<div className='col-lg-10'>
																												<Input

																													label={value.attributeName}
																													//groupIndex={this.state[`attributeGroupIndex_${object.index}`]}
																													id={index}
																													attributeIndex={valueIndex}
																													style={{ width: '80%', margin: '2em' }}
																													onChange={this.setColumnValue.bind(this)}
																													value={value.value}
																												/>
																											</div>
																											<div className='col-lg-1'>
																												<Button
																													primary={true}
																													id={index}
																													attributeIndex={valueIndex}
																													style={{ margin: '1em' }}
																													onClick={this.deleteAttributeValuePair.bind(this)}
																												>{"Delete"}</Button>
																											</div>
																										</div>

																									)
																								})
																							}
																						</div>
																					</div>
																				</div>
																			)
																	}
																</PanelBarItem>



															) : ''
														}
													</PanelBarItem>

												</PanelBar>
											</div>
											<div className='col-lg-1'>
												<DropDownButton id={index} onItemClick={this.addActivity.bind(this)} primary={true} text="Add Activity" items={['Before', 'After']} />
											</div>
										</div>

									)
								})
							}

						</div>
					</div>

				</div>
				{
					this.state.resultSetList.length > 0 &&
					this.state.showResultSet == true &&

					<div className="fixed-bottom" style={{ width: "100%", height: '50%', position: 'absolute' }}>
						<div className="row justify-content-right">
							<div className='col-lg-2'>
								<Button
									primary={true}
									style={{ margin: "1em" }}
									onClick={this.decreaseIndex.bind(this)}
								>
									Left
						</Button>
								<Button
									primary={true}
									style={{ margin: "1em" }}
									onClick={this.increaseIndex.bind(this)}
								>
									Right
						</Button>
							</div>

							<div className='col-lg-2'></div>
							<div className='col-lg-4'>
								<b><span style={{ color: 'rgba(0, 0, 0, 0.38)' }}>{this.state.resultsetOperation}</span></b>
							</div>

							<div className='col-lg-3'>
								<b><span style={{ color: 'rgba(0, 0, 0, 0.38)' }}>RS Count : {this.state.resultSetCount}</span></b>
							</div>

							<div className='col-lg-1'>
								<Button
									primary={true}
									style={{ margin: "1em" }}
									onClick={this.closeResultSet.bind(this)}
								>
									Close
						</Button>
							</div>
						</div>

						<div style={{ overflowY: "scroll" }}>
							<Grid
								style={{ height: "40em" }}
								data={this.state.resultSetList}
								resizable={true}
								scrollable="scrollable"
							>
								{
									columnsElement
								}
							</Grid>
						</div>
					</div>
				}
			</div>
		)

	}
}