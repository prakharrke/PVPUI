import React, { Component } from 'react';
import axios from 'axios';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import LoadingPanel from './Components/LoadingPanel'
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import * as Constants from '../Constants.js';
import * as helper from '../helper.js';

export default class CreateBaseline extends Component {

	resultSetListIndex = 0;
	listOfResultSetList = new Array()
	constructor(props) {

		super(props);

		this.state = {
			baseConnection: {
				connectionName: '',
				connectionID: ''
			},
			blurState: false,
			testCaseSummary: '',
			testCaseDescription: '',
			runFlag: '',
			mlv: this.parseMLVLevelWise(this.props.mlv),
			testFilter: '',
			resultSheet: '',
			viewOnview: '',
			mlvQualification: '',

			resultSetList: [],

			columnNames: [],
			isLoading: false,
			baslineFilesList: [],
			showResultSet: false,
			selectedBaseline: '',
			newBaselineName: '',
			selectedDataType: {
				dataType: ''
			},
			suitableAttributes: [],
			selectedSuitableAttribute: {
				attributeName: ''
			},
			filters: {

			}
		}
	}
	componentWillUpdate(){
		if(this.props.baseConnection != undefined && this.props.baseConnection.connectionID != '' && this.props.baseConnection.connectionID != this.state.baseConnection.connectionID){
			this.setState({
				baseConnection : {
					...this.props.baseConnection
				}
			})
		}
	}
	parseMLVLevelWise(mlv) {
		console.log()


		return mlv.replace(new RegExp('Level', 'g'), '\n\r Level')
	}


	componentWillMount() {
		this.isLoading();
		axios.post(Constants.url + 'GetBaselineFilesList', `MLV=${JSON.stringify({ mlv: this.state.mlv, filter: '' })}`, {
			headers: {
			}


		}).then(response => {

			console.log(response.data)
			this.isNotLoading();
			this.setState({
				baslineFilesList: response.data
			})
		})
	}
	isLoading() {

		this.setState({

			isLoading: true,

		})
	}

	// * METHOD TO UNMOUNT LOADING COMPONENT

	isNotLoading() {

		this.setState({

			isLoading: false
		})
	}

	// * METHOD TO ADD TEST CASE SUMMARY
	addTestCaseSummary(event) {
		this.setState({
			...this.state,
			testCaseSummary: event.target.value
		})
	}

	// * METHOD TO ADD TEST CASE DESCRIPTION

	addTestCaseDescription(event) {
		this.setState({
			...this.state,
			testCaseDescription: event.target.value
		})
	}
	// * METHOD TO ADD MLV 
	addMLV(event) {
		this.setState({
			...this.state,
			mlv: this.parseMLVLevelWise(event.target.value)
		})
	}
	// * METHOD TO ADD TEST CASE FILTER
	addFilter(event) {
		console.log(event.target.value)
		this.setState({
			...this.state,
			testFilter: this.state.testFilter + event.target.value
		})
	}
	editFilter(event) {
		this.setState({
			...this.state,
			testFilter: event.target.value
		})
	}
	// * MEHTOD TO ADD RESULTSHEET NAME 
	addResultSheet(event) {
		this.setState({
			...this.state,
			resultSheet: event.target.value
		})
	}
	// * METHOD TO ADD VIEW ON VIEW
	addViewOnView(event) {
		this.setState({
			...this.state,
			viewOnview: event.target.value
		})
	}
	// * METHOD TO ADD MLV QUALIFICATION
	addMlvQualification(event) {
		this.setState({
			...this.state,
			mlvQualification: event.target.value
		})
	}

	// * METHOD TO EXECUTE MLV
	executeMLV(event) {
		if (this.state.mlv === '') {
			alert("MLV not present")
			return
		}
		this.isLoading();
		axios.post(Constants.url + 'ExecuteMLV', `MLV=${encodeURIComponent(JSON.stringify({ mlv: this.state.mlv, filter: this.state.testFilter, connectionName : this.state.baseConnection.connectionName, connectionID : this.state.baseConnection.connectionID }))}`, {
			headers: {
			}


		}).then(response => {

			this.computeResultSet(response.data)
		})

	}

	// * METHOD TO COMPUTE RESULT SET FROM SERVER
	computeResultSet(response) {


		try {

			console.log(response)
			var resultsetList = new Array();

			//alert(response)

			//alert(response.length)

			var parsed = response;

			// columnsNames array to hold decoded keys (columns in resultset)

			var columnNames = new Array();



			var keys = Object.keys(parsed[0]);

			// populating columnNames array by decoding every element of keys array

			for (var i = 0; i < keys.length; i++) {

				var key = keys[i];

				columnNames[i] = atob(key);


			}

			this.setState({
				...this.state,
				columnNames: columnNames
			})

			// * Populating resultsetList array with decoded values from the parsed resultset received.

			for (var i = 0; i < parsed.length; i++) {


				var temp = {};

				for (var j = 0; j < keys.length; j++) {


					var value = parsed[i][keys[j]];

					// * fetching value from pared resultset and decoding it
					console.log(atob(value));

					temp[columnNames[j]] = atob(value);
				}

				resultsetList[i] = temp;
			}

			console.log(temp)

			console.log(resultsetList);
			this.isNotLoading();
			this.setState({
				...this.state,
				resultSetList: resultsetList,
				showResultSet: true,
				blurState: true

			})

		} catch{
			this.isNotLoading();
			alert("Error occurred while executing MLV.")
		}

	}

	// * MEHTOD TO CLOSE THE RESULTSET WINDOW
	closeResultSet(event) {
		event.preventDefault();
		this.setState({
			showResultSet: false,
			blurState: false
		})
	}

	// * METHOD TO ADD NEW BASELINE
	addNewBaseline(event) {

		this.setState({
			...this.state,
			selectedBaseline: '',
			newBaselineName: event.target.value
		})
	}

	// * METHOD TO SELECT FROM EXISTING BASELINES
	selectBaseline(event) {
		this.setState({
			newBaselineName: '',
			selectedBaseline: event.target.value
		})
	}

	// * METHOD TO ADD TO BASELINE

	addToBaseline(event) {
		event.preventDefault();
		if (this.state.mlv === '') {
			alert('Please add MLV to be inserted')
			return
		}
		if (this.state.resultSheet === '') {
			alert('Please enter resultsheet name')
			return
		}
		if (this.state.selectedBaseline === '' && this.state.newBaselineName === '') {
			alert('Please select baseline name')
			return
		}
		this.isLoading();

		var baselineDetails = {
			testCaseSummary: this.state.testCaseSummary,
			testCaseDescription: this.state.testCaseDescription,
			mlv: this.state.mlv,
			testFilter: this.state.testFilter,
			resultSheetName: this.state.resultSheet,
			viewOnview: this.state.viewOnview,
			mlvQualification: this.state.mlvQualification,
			selectedBaseline: this.state.selectedBaseline,
			newBaselineName: this.state.newBaselineName,
			filters: {
				...this.state.filters
			},
			connectionName : this.state.baseConnection.connectionName,
			connectionID : this.state.baseConnection.connectionID

		}

		console.log(baselineDetails)

		axios.post(Constants.url + 'AddToBaseline', `baselineDetails=${encodeURIComponent(JSON.stringify(baselineDetails))}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}


		}).then((response) => {
			this.isNotLoading();
			console.log(response.data)
			console.log(response.data);

			alert(response.data)
		})


	}

	// * METHOD TO SELECT DATA TYPE FOR FILTER GENERATION
	selectDataType(event) {

		if (this.props.mlvGeneratorState.selectedObjectList === undefined) {
			alert('Only available if mlv is generated using generator')
			return
		}

		this.setState({
			...this.state,
			selectedDataType: {
				...event.target.value
			},
			selectedSuitableAttribute: {}
		})
		console.log(this.props.mlvGeneratorState)
		var requestData = {}
		this.props.mlvGeneratorState.selectedObjectList.map(object => {

			requestData[object.objectID] = this.props.mlvGeneratorState[object.objectID];

		})
		requestData['selectedObjectList'] = this.props.mlvGeneratorState.selectedObjectList;
		requestData['parallelExecution'] = this.props.mlvGeneratorState.parallelExecution;
		requestData['cache'] = this.props.mlvGeneratorState.cache;
		var state = {
			...requestData,
			dataType: {
				...event.target.value
			}
		}

		axios.post(Constants.url + 'GenerateFilterTestCases', `state=${encodeURIComponent(JSON.stringify(state))}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}


		}).then((response) => {

			var suitableAttributes = JSON.parse(atob(response.data));
			console.log(suitableAttributes)
			this.setState({
				...this.state,
				suitableAttributes: suitableAttributes
			})

		})


	}

	// * METHOD TO SELECT SUITABLE ATTRIBUTE
	selectSuitableAttribute(event) {
		this.setState({
			...this.state,
			selectedSuitableAttribute: {
				...event.target.value
			},
			filters: {

				[event.target.value.columnName]: {}

			}
		})
	}

	// * METHOD TO SET FILTER VALUE
	setFilterValue(event) {
		// WE NEED COLUMN_NAME OF THE SELECTED ATTRIBUTE AS IT IS USED AS KEY IN FILTERS OBJECT OF STATE FOR EVERY ATTRIBUTE
		var key = this.state.selectedSuitableAttribute.columnName
		var selectedAttribute = this.state.selectedSuitableAttribute.attributeName
		var filterExpression = event.target.props.filterExpression;
		var filterKey = event.target.props.filterKey;
		var filterName = event.target.props.filterName;
		this.setState({
			...this.state,
			filters: {
				...this.state.filters,
				[key]: {
					...this.state.filters[key],
					[filterKey]: {

						filterExpression: filterExpression,
						value: event.target.value,
						name: filterName
					}

				}
			}
		})
	}

	// * METHOD TO EXECUTE FILTER MLVs
	executeFilterMLVs(event) {

		var temp = {
			mlv: this.state.mlv,
			filters: {
				...this.state.filters
			},
			connectionName : this.state.baseConnection.connectionName,
			connectionID : this.state.baseConnection.connectionID
			
		}
		console.log(JSON.stringify(temp));

		this.isLoading()
		axios.post(Constants.url + 'ExecuteFilterMLV', `MLV=${encodeURIComponent(JSON.stringify(temp))}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}


		}).then((response) => {

			console.log(response.data)
			this.listOfResultSetList = response.data;

			this.computeResultSet(this.listOfResultSetList[this.resultSetListIndex])
		}).catch(e => {
			this.isNotLoading()
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

	// * METHOD TO ADD FILTERS GENERATED TO BASELINE

	addFiltersGeneratedToBaseline(event) {
		this.isLoading();
		event.preventDefault();
		var baselineDetails = {
			filters: {
				...this.state.filters
			},
			mlv: this.state.mlv,
			testCaseSummary: this.state.testCaseSummary,
			testCaseDescription: this.state.testCaseDescription,
			runFlag: this.state.runFlag,
			viewOnView: this.state.viewOnview,
			mlvQualification: this.state.mlvQualification,
			selectedBaseline: this.state.selectedBaseline,
			newBaselineName: this.state.newBaselineName,
			connectionName : this.state.baseConnection.connectionName,
			connectionID : this.state.baseConnection.connectionID

		}

		axios.post(Constants.url + 'AddGeneratedFiltersToBaseline', `baselineDetails=${encodeURIComponent(JSON.stringify(baselineDetails))}`, {
			headers: {
			}


		}).then(response => {
			this.isNotLoading();
			alert(response.data)
		}).catch(e => {
			this.isNotLoading();
			alert("Error occured. Please follow logs")
		})
	}
	setBaseConnection(event){
		this.setState({
			...this.state,
			baseConnection : {
				...event.target.value
			}
		})
	}

	render() {
		console.log(this.state)

		var columnsElement = this.state.columnNames.map((column) => {


			return (

				<Column
					field={column}
					title={column}
					minResizableWidth={'250'}
					width={'250px'}
				/>


			)
		})
		var loadingComponent = this.state.isLoading ? <LoadingPanel /> : ""

		var attributeColumns = new Array();
		if (this.state.mlv != '') {
			try {
				var temp = this.state.mlv.split('attributes=')[1].split(';')[0].split(',')
				attributeColumns = temp;
			} catch{
				alert('Error parsing MLV')
			}
		}

		return (
			<div>

				<div className="container-fluid" style={{ marginTop: "2em" }}>

					<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto", filter: this.state.blurState ? "blur(40px)" : "none" }}>
						<PanelBar >
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Baseline Details</i>}>
								<div className="k-form">

									<div className="row justify-content-center">
										<div className="col-lg-6">
											<DropDownList

												data={this.props.connections}
												onChange={this.setBaseConnection.bind(this)}
												style={{ width: '100%' }}
												label='Select Base Connection'
												textField='connectionName'
												dataItemKey='connectionID'
												value={this.state.baseConnection}

											/>
										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-lg-6 justify-content-center">
											<Input
												required={true}
												label="Test Case Summary*"
												value={this.state.testCaseSummary}
												style={{ width: "100%", textAlign: "center", margin: "1em" }}
												onChange={this.addTestCaseSummary.bind(this)}

											/>
										</div>
										<div className="col-lg-6">
											<Input
												required={true}
												label="Test Case Description*"
												value={this.state.testCaseDescription}
												style={{ width: "100%", textAlign: "center", margin: "1em" }}
												onChange={this.addTestCaseDescription.bind(this)}

											/>
										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-lg-6">
											<Input
												required={true}
												label="Result Sheet Name*"
												value={this.state.resultSheet}
												style={{ width: "100%", textAlign: "center", margin: "1em" }}
												onChange={this.addResultSheet.bind(this)}

											/>
										</div>
										<div className="col-lg-6">
											<Input
												required={true}
												label="View on View"
												value={this.state.viewOnview}
												style={{ width: "100%", textAlign: "center", margin: "1em" }}
												onChange={this.addViewOnView.bind(this)}

											/>
										</div>
									</div>

									<div className="row justify-content-center">

										<div className="col-lg-6">
											<Input
												required={true}
												label="MLV Qualification"
												value={this.state.mlvQualification}
												style={{ width: "100%", textAlign: "center", margin: "1em" }}
												onChange={this.addMlvQualification.bind(this)}

											/>
										</div>
									</div>

									<div className="row justify-content-center">
										<div className="col-lg-10">

											<textarea label="MLV*" class="form-control rounded-0" id="exampleFormControlTextarea1" rows="5" value={this.state.mlv} onChange={this.addMLV.bind(this)}>

											</textarea>

										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-lg-10" tabIndex="0">
											<Input

												placeholder="Filter"
												style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
												onChange={this.editFilter.bind(this)}
												value={this.state.testFilter}
											/>
										</div>
									</div>
									<div className="row">

										<div className="col-lg-5">
											<select
												multiple
												className="form-control"
												size={10}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
												onDoubleClick={this.addFilter.bind(this)}
											>
												{attributeColumns.map((attributeName) => {
													return (
														<option value={attributeName}>{attributeName}</option>

													)
												})}
											</select>
										</div>
										<div className="col-lg-2">
											<select
												multiple
												className="form-control"
												size={10}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
												onDoubleClick={this.addFilter.bind(this)}
											>
												{
													Constants.Constants.MLVOperators.map((operator) => {

														return (

															<option value={operator}>{operator}</option>
														)
													})
												}
											</select>
										</div>
										<div className="col-lg-5">
											<select
												multiple
												className="form-control"
												size={10}
												onDoubleClick={this.addFilter.bind(this)}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
											>
												{
													Constants.Constants.MLVWhereClauseFunctions.map((func) => {

														return (

															<option value={func}>{func}</option>
														)
													})
												}
											</select>

										</div>
									</div>
								</div>
								<Button
									primary={true}
									style={{ textAlign: "center", margin: "1em" }}
									onClick={this.executeMLV.bind(this)}
								>
									Execute MLV
									</Button>
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
								<Button
									primary={true}
									style={{ margin: "1em" }}
									onClick={this.addToBaseline.bind(this)}
								>
									Add Test Case
							</Button>

							</PanelBarItem>

							{

								<PanelBarItem title={<i style={{ fontSize: "16px" }}>Generate Filters</i>}>
									<div className="row justify-content-center">
										<div className="col-lg-2">
											<DropDownList
												style={{ margin: "1em", width: "100%" }}
												data={Constants.dataTypes}
												textField="dataType"
												dataItemKey="id"
												label="Select Data type"
												value={this.state.selectedDataType}
												onChange={this.selectDataType.bind(this)}

											/>
										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-lg-6">
											<DropDownList
												style={{ margin: "1em", width: "100%" }}
												data={this.state.suitableAttributes}
												textField="attributeName"
												dataItemKey="index"
												label="Attribute To Apply Filter On"
												value={this.state.selectedSuitableAttribute}
												onChange={this.selectSuitableAttribute.bind(this)}

											/>
										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-lg-4">
											{
												this.state.selectedDataType.dataType !== '' && this.state.selectedSuitableAttribute.attributeName !== '' &&
												helper.getFilters(this.state.selectedDataType.type).map((filter) => {
													return (
														<Input

															id={this.state.selectedSuitableAttribute.columnName + "_" + filter.name}
															value={this.state.selectedSuitableAttribute.columnName + " " + filter.value}
															style={{ width: "100%", textAlign: "center", margin: "1em" }}


														/>
													)
												})
											}
										</div>
										<div className="col-lg-2">
											{
												this.state.selectedDataType.dataType !== '' && this.state.selectedSuitableAttribute.attributeName !== '' &&
												helper.getFilters(this.state.selectedDataType.type).map((filter) => {
													return (
														<Input

															filterKey={this.state.selectedSuitableAttribute.columnName + "_" + filter.name}
															filterName={filter.name}
															filterExpression={this.state.selectedSuitableAttribute.columnName + " " + filter.value}
															style={{ width: "100%", textAlign: "center", margin: "1em" }}
															onChange={this.setFilterValue.bind(this)}

														/>
													)
												})
											}
										</div>
										<Button
											primary={true}
											style={{ margin: "1em" }}
											onClick={this.executeFilterMLVs.bind(this)}
										>
											Execute Filters
												</Button>

									</div>
									<div className="row justify-content-center">
										<div className="col-lg-2">
											<Button
												primary={true}
												style={{ margin: "1em" }}
												onClick={this.addFiltersGeneratedToBaseline.bind(this)}
											>
												Add
															</Button>
										</div>
									</div>
								</PanelBarItem>}
						</PanelBar>
					</div>
					{loadingComponent}
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
								<div className='col-lg-2'></div>
								<div className='col-lg-2'></div>
								<div className='col-lg-2'></div>
								<div className='col-lg-1'></div>
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
			</div>

		)
	}
}