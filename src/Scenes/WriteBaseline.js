import React, { Component } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import InsertDetails from './Components/InsertDetails'
import UpdateDetails from './Components/UpdateDetails'
import DeleteDetails from './Components/deleteDetails'
import DeleteAllDetails from './Components/DeleteAllDetails'
import MLVGenerator from './MLVGenerator';
import LoadingPanel from './Components/LoadingPanel'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { BrowserRouter, Route, Router, HashRouter, Redirect } from 'react-router-dom';
import axios from 'axios';
import * as constants from '../Constants'
import $ from 'jquery';
import '@progress/kendo-ui';
import { Notification, Tooltip } from '@progress/kendo-popups-react-wrapper';
export default class WriteBaseline extends Component {
	resultSetListIndex = 0;
	listOfResultSetList = new Array()
	constructor(props) {
		super(props);
		this.showPopUpNotification = this.showPopUpNotification.bind(this);
		if (Object.keys(this.props.writeBaselineState).length != 0) {

			this.state = {
				...this.props.writeBaselineState
			}
		} else {
			this.state = {
				insertState: {},
				loadedTestCases: [],
				loadSelectedTestCase: {testCaseNo : '', testCaseSummary : ''},
				blurState: false,
				writeConnection: { connectionName: '', connectionID: '' },
				fetchFromAnotherSourceConnection: { connectionName: '', connectionID: '' },
				showConnectionSelectionDialog: false,
				resultSetList: [],
				resultsetOperation: '',
				showResultSet: false,
				isLoading: false,
				baselineFilesList: [],
				selected: 0,
				testCaseSummary: '',
				testCaseDescription: '',
				mountMLVGenerator: false,
				operation: '',
				columnNames: [],
				fetchFromAnotherSourceForInsertFlag: false,
				fetchFromAnotherSourceForUpdateFlag: false,
				fetchFromAnotherSourceForDeleteFlag: false,
				fetchFromAnotherSourceForInsert: {
					mlv: '',
					attributes: [],
					filter: '',
					selectedPlugin: ''
				},
				fetchFromAnotherSourceForUpdate: {
					mlv: '',
					attributes: [],
					filter: '',
					ID : '',
					PID : '',
					LEV : '',
					PIN : '',
					selectedPlugin: ''
				},
				fetchFromAnotherSourceForDelete: {
					mlv: '',
					attributes: [],
					filter: '',
					selectedPlugin: '',
					ID : '',
					PID : '',
					LEV : '',
					PIN : '',
					MLVLEFTOBJ : '',
					MLVRIGHTOBJ : ''
				},
				insertMLVs: {
					currentIndex: 0,
					insertMLVArray: []
				},
				updateMLVs: {
					currentIndex: 0,
					updateMLVArray: []
				},
				deleteMLVs: {
					currentIndex: 0,
					deleteMLVArray: []
				},
				deleteAllMLVs: {
					currentIndex: 0,
					deleteAllMLVArray: []
				},
				fetchMLVForinsert: {
					mlv: '',
					filter: '',
					attributes: [],
					selectedPlugin: ''
				},
				fetchMLVForUpdate: {
					mlv: '',
					filter: '',
					attributes: [],
					selectedPlugin: ''
				},
				fetchMLVForDelete: {
					mlv: '',
					filter: '',
					attributes: [],
					selectedPlugin: ''
				},
				rsInsertFlag: false,
				bulkInsertFlag: false,
				selectedBaseline: '',
				newBaselineName: '',
				resultSetCount: 0,
				overWrite : false


			}
		}
	}

	componentWillMount() {

		axios.post(constants.url + 'GetWriteBaselineFilesList', `MLV=${JSON.stringify({ mlv: this.state.mlv, filter: '' })}`, {
			headers: {
			}


		}).then(response => {

			console.log(response.data)
			//this.isNotLoading();
			this.setState({
				baslineFilesList: response.data,
				showConnectionSelectionDialog: true
			})
		})
	}
	handleSelect(event) {
		this.setState({
			selected: event.selected
		})
	}
	setTestCaseSummary(event) {
		this.setState({
			testCaseSummary: event.target.value
		})
	}
	setTestCaseDescription(event) {
		this.setState({
			testCaseDescription: event.target.value
		})
	}
	generateMLV(operation) {
		if (operation === 'fetchFromAnotherSource' && this.state.fetchFromAnotherSourceConnection.connectionID === '') {
			alert('Please select Fetch From Another Source Connection')
			return
		}
		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}

	saveMLVForFetchFromAnotherSource(mlv, selectedPlugin) {

		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchFromAnotherSourceForInsert: {
						...this.state.fetchFromAnotherSourceForInsert,
						mlv: mlv,
						attributes: temp,
						selectedPlugin: this.state.fetchFromAnotherSourceConnection
					},
					mountMLVGenerator: false
				})
			} catch{

				alert('Error Parsing MLV')
				return
			}

		}
		else {
			this.setState({
				...this.state,
				fetchFromAnotherSourceForInsert: {
					...this.state.fetchFromAnotherSourceForInsert,
					mlv: mlv,
					attributes: []
				},
				mountMLVGenerator: false
			})
		}
	}

	toggleFetchFromAnotherSource() {
		this.setState({
			...this.state,
			fetchFromAnotherSourceForInsertFlag: !this.state.fetchFromAnotherSourceForInsertFlag
		})
	}
	addFilterForFetchFromAnotherSourceForInsert(value) {

		this.setState({
			...this.state,
			fetchFromAnotherSourceForInsert: {
				...this.state.fetchFromAnotherSourceForInsert,
				filter: this.state.fetchFromAnotherSourceForInsert.filter + value
			}
		})
	}
	editFilterForFetchFromAnotherSourceForInsert(value) {

		this.setState({
			...this.state,
			fetchFromAnotherSourceForInsert: {
				...this.state.fetchFromAnotherSourceForInsert,
				filter: value
			}
		})
	}

	// * METHOD TO ADD EMPTY INSERT_MLV
	addInsertMLV() {
		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray.push({
			mlv: '',
			index: insertMLVArray.length,
			ID: '',
			PID: '',
			LEV: '',
			PIN: '',
			values: [[]],
			attributes: []
		})

		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}

	deleteInsertMLV(index) {
		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray.splice(index, 1);
		insertMLVArray.map((object, index) => {
			object.index = index
		})

		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}

	// * METHOD TO GENERATE INSERT MLV
	generateInsertMLV(index) {


		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				currentIndex: index
			},
			mountMLVGenerator: true,
			operation: 'insertMLV'
		})
	}


	parseMLVLevelWise(mlv) {

		if (mlv != undefined)
			return mlv.replace(new RegExp('Level', 'g'), '\n\r Level')
		else
			return ''
	}

	// * METHOD TO RECEIVE MLV FROM MLV GENERATOR AND SAVE IT
	saveInsertMLV(mlv, index) {
		if (index === undefined) {
			var insertMLVArray = this.state.insertMLVs.insertMLVArray;
			insertMLVArray[this.state.insertMLVs.currentIndex].mlv = this.parseMLVLevelWise(mlv)
			var attributeColumns = new Array();
			if (mlv != '') {
				try {
					var temp = mlv.split('attributes=')[1].split(';')[0].split(',')

					temp = temp.concat(constants.mlvObjects);
					var attributeValues = new Array(temp.length)
					//var attributeCollectiveValues = new Array();
					//attributeCollectiveValues.push(attributeValues.fill(''))
					insertMLVArray[this.state.insertMLVs.currentIndex].attributes = temp;
					//insertMLVArray[this.state.insertMLVs.currentIndex].values = attributeCollectiveValues
					//this.setAttributesForInsertMLV(index, attributeColumns)
				} catch{
					alert('Error parsing MLV')
				}
			}

			this.setState({
				...this.state,
				insertMLVs: {
					...this.state.insertMLVs,
					insertMLVArray: insertMLVArray
				},
				mountMLVGenerator: false
			})
		}
		else {

			var insertMLVArray = this.state.insertMLVs.insertMLVArray;
			insertMLVArray[index].mlv = this.parseMLVLevelWise(mlv)
			var attributeColumns = new Array();
			if (mlv != '') {
				try {
					var temp = mlv.split('attributes=')[1].split(';')[0].split(',')

					temp = temp.concat(constants.mlvObjects);
					insertMLVArray[index].attributes = temp;
					//var attributeValues = new Array(temp.length)
					//var attributeCollectiveValues = new Array();
					//attributeCollectiveValues.push(attributeValues.fill(''))
					//insertMLVArray[index].values = attributeCollectiveValues
					//this.setAttributesForInsertMLV(index, attributeColumns)
				} catch{
					alert('Error parsing MLV')
				}
			}

			this.setState({
				...this.state,
				insertMLVs: {
					...this.state.insertMLVs,
					insertMLVArray: insertMLVArray
				},
				mountMLVGenerator: false
			})
		}
	}

	setInsertID(index, value) {

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].ID = value

		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}
	setInsertPID(index, value) {

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].PID = value
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}
	setInsertLEV(index, value) {

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].LEV = value
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}
	setInsertPIN(index, value) {
		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].PIN = value
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}

	setInsertValues(index, values) {

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].values = values;
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})

	}
	// * METHOD TO ADD COLUMN VALUES BY RAW DATA

	setRawDataInsertColumns(index, value) {
		value = value.trim();
		var columnString = value.substring(1, value.length - 1);
		var columnsArray = new Array();
		columnsArray = columnString.split(',');

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		var values = insertMLVArray[index].values;
		insertMLVArray[index].values = new Array()
		insertMLVArray[index].values.push(new Array())
		insertMLVArray[index].values.map((value) => {

			columnsArray.map(columnName => {

				value.push({
					attributeName: columnName.trim(),
					value: ''
				})
			})
		})

		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})

	}

	//* METHOD TO SET RAW DATA INSERT VALUES

	setRawDataInsertValues(index, value) {
		value = value.trim();
		var valueString = value.substring(1, value.length - 1);
		var insertValues = new Array();
		insertValues = this.generateColumnValuesFromRawData(valueString);

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		var values = insertMLVArray[index].values;

		if (insertValues.length % values[0].length != 0) {
			alert('Values should be a multiple of insert columns')
			return
		}
		var columnCount = values[0].length
		var insertRowCount = insertValues.length / values[0].length;

		var rowsTobeAdded = insertRowCount - values.length
		for (var i = 1; i <= rowsTobeAdded; i++) {
			var valuePairObject = new Array();

			values[0].map(value => {
				valuePairObject.push({ ...value })
			})
			values.push(valuePairObject)
		}

		values.map((valueArray, valueArrayIndex) => {

			valueArray.map((value, valueIndex) => {

				var attributeValue = insertValues[valueArrayIndex * columnCount + valueIndex]
				value.value = attributeValue;
			})
		})

		insertMLVArray[index].values = values
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})

	}

	// * HELPER METHOD TO GENEREATE COLUMN VALUES FROM RAW DATA 
	generateColumnValuesFromRawData(str) {
		var arr = []
		var newStr = '';
		var bCounter = 0;
		for (var i = 0; i < str.length; i++) {
			if (str[i] != ',')
				newStr = newStr + str[i];
			else
				if (bCounter != 0)
					newStr = newStr + str[i];
			if (str[i] == '(')
				bCounter++;
			if (str[i] == ')')
				bCounter--;


			if (str[i] == ',' && bCounter == 0) {
				arr.push(newStr)
				newStr = '';

			}

			if (i == str.length - 1)
				arr.push(newStr)
		}

		return arr

	}
	// * METHOD TO ADD ATTRIBUTE VALUE PAIR FOR INSERT

	addAttributeValuePairForInsert(index) {

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		var values = insertMLVArray[index].values;

		insertMLVArray[index].values.map((value) => {

			value.push({
				attributeName: '',
				value: ''
			})
		})

		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}

	addAttributeValuePairForInsertNew(index, attributeName) {
		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		var values = insertMLVArray[index].values;

		insertMLVArray[index].values.map((value) => {

			value.push({
				attributeName: attributeName,
				value: ''
			})
		})

		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}

	// * METHOD TO SET ATTRIBUTES FOR INSERT_MLV
	setAttributesForInsertMLV(index, attributes) {

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].attributes = attributes;
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}
	setSelectedAttributeForInsert(index, attributeIndex, value) {
		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].values.map((attributeValueArray, index) => {
			attributeValueArray[attributeIndex].attributeName = value
		})
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}

	addAttributeInsertValue(index, attributeIndex, groupIndex, value) {

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].values[groupIndex][attributeIndex].value = value;
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}
	deleteSelectedAttributeForInsert(index, attributeIndex) {
		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].values.map(valueArray => {

			valueArray.splice(attributeIndex, 1)
		})
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})

	}
	addAttributeInsertValueGroup(index) {
		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		//var attributeLength = insertMLVArray[index].attributes.length;
		//var attributeValues = new Array(attributeLength)
		//insertMLVArray[index].values.push(attributeValues.fill(''))
		var attributeValuePair = new Array();
		insertMLVArray[index].values[0].map(object => {
			attributeValuePair.push({
				attributeName: object.attributeName,
				value: ''
			})
		})
		insertMLVArray[index].values.push(attributeValuePair)
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})

	}
	deleteAttributeInsertValueGroup(index, groupIndex) {
		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].values.splice(groupIndex, 1);
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})

	}

	copyInsertMLVToInsertFetch() {
		this.setState({
			...this.state,
			fetchMLVForinsert: {
				...this.state.fetchMLVForinsert,
				mlv: this.state.insertMLVs.insertMLVArray[0].mlv,
				attributes: this.state.insertMLVs.insertMLVArray[0].attributes
			}
		})
	}

	// * GENERATE FETCH MLV FOR INSERT
	generateFetchMLVForInsert() {

		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: 'fetchMLVForInsert'
		})
	}
	saveFetchMLVForInsert(mlv, selectedPlugin) {

		try {
			var attributes = mlv.split('attributes=')[1].split(';')[0].split(',')

			this.setState({
				...this.state,
				fetchMLVForinsert: {
					...this.state.fetchMLVForinsert,
					mlv: mlv,
					attributes: attributes,
					selectedPlugin: selectedPlugin
				},
				mountMLVGenerator: false
			})
		} catch{
			alert('Error Parsing MLV')
		}
	}
	addFilterForFetchMLVForInsert(value) {

		this.setState({
			...this.state,
			fetchMLVForinsert: {
				...this.state.fetchMLVForinsert,
				filter: this.state.fetchMLVForinsert.filter + value
			}
		})
	}
	editFilterForFetchMLVForInsert(value) {

		this.setState({
			...this.state,
			fetchMLVForinsert: {
				...this.state.fetchMLVForinsert,
				filter: value
			}
		})
	}
	toggleRSInsert() {
		this.setState({
			...this.state,
			rsInsertFlag: !this.state.rsInsertFlag
		})
	}
	toggleBulkInsert() {
		this.setState({
			...this.state,
			bulkInsertFlag: !this.state.bulkInsertFlag
		})
	}

	executeInsert() {
		if (this.state.insertMLVs.insertMLVArray.length == 0) {
			alert('Please provide at least one insert MLV')
			return
		} else {

			var exit = false;
			this.state.insertMLVs.insertMLVArray.map((object, index) => {

				if (object.mlv === '') {
					alert('Insert MLV at index ' + index + ' is empty. Either delete it or provide an MLV')
					exit = true
					return
				}

			})
			if (exit) {
				return
			}

		}

		if (this.state.deleteAllMLVs.deleteAllMLVArray.length == 0) {
			alert('Please provide at least one delete all MLV to delete the data inserted from insert operation')
			return
		} else {

			var exit = false;
			this.state.deleteAllMLVs.deleteAllMLVArray.map((object, index) => {

				if (object.mlv === '') {
					alert('Delete all MLV at index ' + index + ' is empty. Either delete it or provide an MLV')
					exit = true
					return
				}
				if (object.filter === '') {
					alert('Filter for delete all MLV at index ' + index + ' is empty. This might delete all the data in application. Please provide filter.')
					exit = true;
					return
				}
			})
			if (exit) {
				return
			}

		}

		if (this.state.writeConnection.connectionID === '') {
			alert('Please select at least write destination connection');
			return
		}
		if (this.state.fetchFromAnotherSourceForInsertFlag || this.state.fetchFromAnotherSourceForUpdateFlag || this.state.fetchFromAnotherSourceForDeleteFlag) {
			if (this.state.fetchFromAnotherSourceConnection.connectionID === '') {
				alert('You have set fetch from another source as true in one of the cases. Please select fetch from another source connection')
				return
			}
		}



		var insertDetails = {}
		insertDetails['fetchFromAnotherSourceForInsert'] = this.state.fetchFromAnotherSourceForInsert;
		insertDetails['insertMLVs'] = this.state.insertMLVs;
		insertDetails['fetchMLVForinsert'] = this.state.fetchMLVForinsert;
		insertDetails['fetchFromAnotherSourceForInsertFlag'] = this.state.fetchFromAnotherSourceForInsertFlag;
		insertDetails['rsInsert'] = this.state.rsInsertFlag;
		insertDetails['bulkInsert'] = this.state.bulkInsertFlag;

		insertDetails['fetchFromAnotherSourceForUpdate'] = this.state.fetchFromAnotherSourceForUpdate;
		insertDetails['updateMLVs'] = this.state.updateMLVs;
		insertDetails['fetchMLVForUpdate'] = this.state.fetchMLVForUpdate;
		insertDetails['fetchFromAnotherSourceForUpdateFlag'] = this.state.fetchFromAnotherSourceForUpdateFlag;

		insertDetails['fetchFromAnotherSourceForDelete'] = this.state.fetchFromAnotherSourceForDelete;
		insertDetails['deleteMLVs'] = this.state.deleteMLVs;
		insertDetails['fetchMLVForDelete'] = this.state.fetchMLVForDelete;
		insertDetails['fetchFromAnotherSourceForDeleteFlag'] = this.state.fetchFromAnotherSourceForDeleteFlag;

		insertDetails['deleteAllMLVs'] = this.state.deleteAllMLVs;

		insertDetails['writePluginName'] = this.state.writeConnection.connectionID;
		insertDetails['fetchFromAnotherSourcePluginName'] = this.state.fetchFromAnotherSourceConnection.connectionID
		this.props.isLoading();
		axios.post(constants.url + 'ExecuteInsert', 'insertDetails=' + (encodeURIComponent(JSON.stringify(insertDetails))), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
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

	saveInsertDetailsState(insertState) {
		this.setState({
			...this.state,
			insertState: insertState
		})
	}

	// ****************** UPDATE_DETAILS METHODS *******************************
	toggleFetchFromAnotherSourceForUpdate() {
		this.setState({
			...this.state,
			fetchFromAnotherSourceForUpdateFlag: !this.state.fetchFromAnotherSourceForUpdateFlag
		})
	}
	generateMLVFetchFromAnotherSourceForUpdate(operation) {
		if (this.state.fetchFromAnotherSourceConnection.connectionID === '') {
			alert('Select Fetch From Another Source Connection')
			return
		}
		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}
	saveMLVForFetchFromAnotherSourceForUpdate(mlv, selectedPlugin) {
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchFromAnotherSourceForUpdate: {
						...this.state.fetchFromAnotherSourceForUpdate,
						mlv: mlv,
						attributes: temp,
						selectedPlugin: this.state.fetchFromAnotherSourceConnection
					},
					mountMLVGenerator: false
				})
			} catch{

				alert('Error Parsing MLV')
				return
			}

		}

	}
	addFilterForFetchFromAnotherSourceForUpdate(value) {

		this.setState({
			...this.state,
			fetchFromAnotherSourceForUpdate: {
				...this.state.fetchFromAnotherSourceForUpdate,
				filter: this.state.fetchFromAnotherSourceForUpdate.filter + value
			}
		})
	}
	editFilterForFetchFromAnotherSourceForUpdate(value) {

		this.setState({
			...this.state,
			fetchFromAnotherSourceForUpdate: {
				...this.state.fetchFromAnotherSourceForUpdate,
				filter: value
			}
		})
	}
	// * METHOD TO ADD EMPTY UPDATE_MLV
	addUpdateMLV() {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray.push({
			mlv: '',
			index: updateMLVArray.length,
			ID: ' ',
			PID: ' ',
			LEV: ' ',
			PIN: ' ',
			MLVLEFTOBJ: ' ',
			MLVRIGHTOBJ: ' ',
			MLVOBJECT: '',
			values: [],
			filter: '',
			attributes: ['MLVLEFTOBJ', 'MLVRIGHTOBJ', 'MLVOBJECT'],

		})

		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}
	copyInsertMLVToUpdate(index) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].mlv = this.state.insertMLVs.insertMLVArray[0].mlv;
		updateMLVArray[index].attributes = this.state.insertMLVs.insertMLVArray[0].attributes;
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}
	// * METHOD TO GENERATE UPDATE MLV
	generateUpdateMLV(index) {


		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				currentIndex: index
			},
			mountMLVGenerator: true,
			operation: 'updateMLV'
		})
	}
	// * METHOD TO RECEIVE MLV FROM MLV GENERATOR AND SAVE IT
	saveUpdateMLV(mlv, index) {
		if (index === undefined) {
			var updateMLVArray = this.state.updateMLVs.updateMLVArray;
			updateMLVArray[this.state.updateMLVs.currentIndex].mlv = this.parseMLVLevelWise(mlv)
			var attributeColumns = new Array();
			if (mlv != '') {
				try {
					var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
					//var attributeValues = new Array(temp.length)
					//var attributeCollectiveValues = new Array();
					//attributeCollectiveValues.push(attributeValues.fill(''))
					updateMLVArray[this.state.updateMLVs.currentIndex].attributes = temp;
					//insertMLVArray[this.state.insertMLVs.currentIndex].values = attributeCollectiveValues
					//this.setAttributesForInsertMLV(index, attributeColumns)
				} catch{
					alert('Error parsing MLV')
				}
			}

			this.setState({
				...this.state,
				updateMLVs: {
					...this.state.updateMLVs,
					updateMLVArray: updateMLVArray
				},
				mountMLVGenerator: false
			})
		}
		else {

			var updateMLVArray = this.state.updateMLVs.updateMLVArray;
			updateMLVArray[index].mlv = this.parseMLVLevelWise(mlv)
			var attributeColumns = new Array();
			if (mlv != '') {
				try {
					var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
					updateMLVArray[index].attributes = temp;
					//var attributeValues = new Array(temp.length)
					//var attributeCollectiveValues = new Array();
					//attributeCollectiveValues.push(attributeValues.fill(''))
					//insertMLVArray[index].values = attributeCollectiveValues
					//this.setAttributesForInsertMLV(index, attributeColumns)
				} catch{
					alert('Error parsing MLV')
				}
			}

			this.setState({
				...this.state,
				updateMLVs: {
					...this.state.updateMLVs,
					updateMLVArray: updateMLVArray
				},
				mountMLVGenerator: false
			})
		}
	}
	deleteUpdateMLV(index) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray.splice(index, 1);
		updateMLVArray.map((object, index) => {
			object.index = index
		})

		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}
	addUpdateValuePair(index) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].values.push({
			attributeName: '',
			value: '',
		})

		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})

	}
	setSelectedAttribute(index, attributeIndex, attributeName) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].values[attributeIndex].attributeName = attributeName;
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})

	}
	setValueForSelectedAttributeForUpdate(index, attributeIndex, value) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].values[attributeIndex].value = value;
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}
	deleteSelectedAttributeForUpdate(index, attributeIndex) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].values.splice(attributeIndex, 1);
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})

	}
	setIDForUpdate(value) {
		
		this.setState({
			...this.state,
			fetchFromAnotherSourceForUpdate : {
				...this.state.fetchFromAnotherSourceForUpdate,
				ID : value
			}
		})
	}
	setPIDForUpdate(value) {
		this.setState({
			...this.state,
			fetchFromAnotherSourceForUpdate : {
				...this.state.fetchFromAnotherSourceForUpdate,
				PID : value
			}
		})
	}
	setLEVForUpdate(value) {
		this.setState({
			...this.state,
			fetchFromAnotherSourceForUpdate : {
				...this.state.fetchFromAnotherSourceForUpdate,
				LEV : value
			}
		})
	}
	setPINForUpdate(value) {
		this.setState({
			...this.state,
			fetchFromAnotherSourceForUpdate : {
				...this.state.fetchFromAnotherSourceForUpdate,
				PIN : value
			}
		})
	}
	addFilterForUpdate(index, value) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].filter = updateMLVArray[index].filter + value
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}

	editFilterForUpdate(index, value) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].filter = value
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}
	copyInsertMLVToUpdateFetch() {
		this.setState({
			...this.state,
			fetchMLVForUpdate: {
				...this.state.fetchMLVForinsert,
				mlv: this.state.insertMLVs.insertMLVArray[0].mlv,
				attributes: this.state.insertMLVs.insertMLVArray[0].attributes
			}
		})
	}
	generateFetchMLVForUpdate(operation) {

		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}
	saveFetchMLVForUpdate(mlv, selectedPlugin) {
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchMLVForUpdate: {
						...this.state.fetchMLVForUpdate,
						mlv: mlv,
						attributes: temp,
						selectedPlugin: this.state.fetchFromAnotherSourceConnection
					},
					mountMLVGenerator: false
				})
			} catch{

				alert('Error Parsing MLV')
				return
			}

		} else {
			this.setState({
				...this.state,
				fetchMLVForUpdate: {
					...this.state.fetchMLVForUpdate,
					mlv: mlv,
					attributes: []
				},
				mountMLVGenerator: false
			})
		}

	}
	addFilterForFetchMLVForUpdate(value) {

		this.setState({
			...this.state,
			fetchMLVForUpdate: {
				...this.state.fetchMLVForUpdate,
				filter: this.state.fetchMLVForUpdate.filter + value
			}
		})
	}
	editFilterForFetchMLVForUpdate(value) {

		this.setState({
			...this.state,
			fetchMLVForUpdate: {
				...this.state.fetchMLVForUpdate,
				filter: value
			}
		})
	}

	// ********************************** DELETE METHODS **********************************************
	toggleFetchFromAnotherSourceForDelete() {
		this.setState({
			...this.state,
			fetchFromAnotherSourceForDeleteFlag: !this.state.fetchFromAnotherSourceForDeleteFlag
		})
	}
	generateMLVFetchFromAnotherSourceForDelete(operation) {
		if (this.state.fetchFromAnotherSourceConnection.connectionID === '') {
			alert('Please select Fetch From Another Source Connection')
			return
		}
		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}
	saveMLVForFetchFromAnotherSourceForDelete(mlv, selectedPlugin) {
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchFromAnotherSourceForDelete: {
						...this.state.fetchFromAnotherSourceForDelete,
						mlv: mlv,
						attributes: temp,
						selectedPlugin: this.state.fetchFromAnotherSourceConnection
					},
					mountMLVGenerator: false
				})
			} catch{

				alert('Error Parsing MLV')
				return
			}

		} else {
			this.setState({
				...this.state,
				fetchFromAnotherSourceForDelete: {
					...this.state.fetchFromAnotherSourceForDelete,
					mlv: mlv,
					attributes: []
				},
				mountMLVGenerator: false
			})
		}

	}
	addFilterForFetchFromAnotherSourceForDelete(value) {

		this.setState({
			...this.state,
			fetchFromAnotherSourceForDelete: {
				...this.state.fetchFromAnotherSourceForDelete,
				filter: this.state.fetchFromAnotherSourceForDelete.filter + value
			}
		})
	}
	editFilterForFetchFromAnotherSourceForDelete(value) {

		this.setState({
			...this.state,
			fetchFromAnotherSourceForDelete: {
				...this.state.fetchFromAnotherSourceForDelete,
				filter: value
			}
		})
	}

	setIDForDelete(value){
		this.setState({
			...this.state,
			fetchFromAnotherSourceForDelete : {
				...this.state.fetchFromAnotherSourceForDelete,
				ID : value
			}
		})
	}

	setPIDForDelete(value){
		this.setState({
			...this.state,
			fetchFromAnotherSourceForDelete : {
				...this.state.fetchFromAnotherSourceForDelete,
				PID : value
			}
		})
	}

	setLEVForDelete(value){
		this.setState({
			...this.state,
			fetchFromAnotherSourceForDelete : {
				...this.state.fetchFromAnotherSourceForDelete,
				LEV : value
			}
		})
	}
	setPINForDelete(value){
		this.setState({
			...this.state,
			fetchFromAnotherSourceForDelete : {
				...this.state.fetchFromAnotherSourceForDelete,
				PIN : value
			}
		})
	}

	// * METHOD TO ADD EMPTY DELETE_MLV
	addDeleteMLV() {
		var deleteMLVArray = this.state.deleteMLVs.deleteMLVArray;
		deleteMLVArray.push({
			mlv: '',
			index: deleteMLVArray.length,
			filter: '',
			attributes: ['MLVLEFTOBJ', 'MLVRIGHTOBJ', 'MLVOBJECT'],

		})

		this.setState({
			...this.state,
			deleteMLVs: {
				...this.state.deleteMLVs,
				deleteMLVArray: deleteMLVArray
			}
		})
	}
	copyInsertMLVToDelete(index) {
		var deleteMLVArray = this.state.deleteMLVs.deleteMLVArray;
		deleteMLVArray[index].mlv = this.state.insertMLVs.insertMLVArray[0].mlv;
		deleteMLVArray[index].attributes = this.state.insertMLVs.insertMLVArray[0].attributes;
		this.setState({
			...this.state,
			deleteMLVs: {
				...this.state.deleteMLVs,
				deleteMLVArray: deleteMLVArray
			}
		})
	}
	generateDeleteMLV(index) {


		this.setState({
			...this.state,
			deleteMLVs: {
				...this.state.deleteMLVs,
				currentIndex: index
			},
			mountMLVGenerator: true,
			operation: 'deleteMLV'
		})
	}


	saveDeleteMLV(mlv, index) {
		if (index === undefined) {
			var deleteMLVArray = this.state.deleteMLVs.deleteMLVArray;
			deleteMLVArray[this.state.deleteMLVs.currentIndex].mlv = this.parseMLVLevelWise(mlv)
			var attributeColumns = new Array();
			if (mlv != '') {
				try {
					var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
					//var attributeValues = new Array(temp.length)
					//var attributeCollectiveValues = new Array();
					//attributeCollectiveValues.push(attributeValues.fill(''))
					deleteMLVArray[this.state.deleteMLVs.currentIndex].attributes = temp;
					//insertMLVArray[this.state.insertMLVs.currentIndex].values = attributeCollectiveValues
					//this.setAttributesForInsertMLV(index, attributeColumns)
				} catch{
					alert('Error parsing MLV')
				}
			}

			this.setState({
				...this.state,
				deleteMLVs: {
					...this.state.deleteMLVs,
					deleteMLVArray: deleteMLVArray
				},
				mountMLVGenerator: false
			})
		}
		else {

			var deleteMLVArray = this.state.deleteMLVs.deleteMLVArray;
			deleteMLVArray[index].mlv = this.parseMLVLevelWise(mlv)
			var attributeColumns = new Array();
			if (mlv != '') {
				try {
					var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
					deleteMLVArray[index].attributes = temp;
					//var attributeValues = new Array(temp.length)
					//var attributeCollectiveValues = new Array();
					//attributeCollectiveValues.push(attributeValues.fill(''))
					//insertMLVArray[index].values = attributeCollectiveValues
					//this.setAttributesForInsertMLV(index, attributeColumns)
				} catch{
					alert('Error parsing MLV')
				}
			}

			this.setState({
				...this.state,
				deleteMLVs: {
					...this.state.deleteMLVs,
					deleteMLVArray: deleteMLVArray
				},
				mountMLVGenerator: false
			})
		}
	}

	deleteDeleteMLV(index) {
		var deleteMLVArray = this.state.deleteMLVs.deleteMLVArray;
		deleteMLVArray.splice(index, 1);
		deleteMLVArray.map((object, index) => {
			object.index = index
		})

		this.setState({
			...this.state,
			deleteMLVs: {
				...this.state.deleteMLVs,
				deleteMLVArray: deleteMLVArray
			}
		})
	}
	addFilterForDelete(index, value) {
		var deleteMLVArray = this.state.deleteMLVs.deleteMLVArray;
		deleteMLVArray[index].filter = deleteMLVArray[index].filter + value
		this.setState({
			...this.state,
			deleteMLVs: {
				...this.state.deleteMLVs,
				deleteMLVArray: deleteMLVArray
			}
		})
	}
	editFilterForDelete(index, value) {
		var deleteMLVArray = this.state.deleteMLVs.deleteMLVArray;
		deleteMLVArray[index].filter = value
		this.setState({
			...this.state,
			deleteMLVs: {
				...this.state.deleteMLVs,
				deleteMLVArray: deleteMLVArray
			}
		})
	}
	copyInsertMLVToDeleteFetch() {
		this.setState({
			...this.state,
			fetchMLVForDelete: {
				...this.state.fetchMLVForDelete,
				mlv: this.state.insertMLVs.insertMLVArray[0].mlv,
				attributes: this.state.insertMLVs.insertMLVArray[0].attributes
			}
		})
	}
	generateFetchMLVForDelete(operation) {

		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}
	saveFetchMLVForDelete(mlv, selectedPlugin) {
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchMLVForDelete: {
						...this.state.fetchMLVForDelete,
						mlv: mlv,
						attributes: temp,
						selectedPlugin: this.state.fetchFromAnotherSourceConnection
					},
					mountMLVGenerator: false
				})
			} catch{

				alert('Error Parsing MLV')
				return
			}

		} else {
			this.setState({
				...this.state,
				fetchMLVForDelete: {
					...this.state.fetchMLVForDelete,
					mlv: mlv,
					attributes: []
				},
				mountMLVGenerator: false
			})
		}

	}
	addFilterForFetchMLVForDelete(value) {
		this.setState({
			...this.state,
			fetchMLVForDelete: {
				...this.state.fetchMLVForDelete,
				filter: this.state.fetchMLVForDelete.filter + value
			}
		})
	}
	editFilterForFetchMLVForDelete(value) {
		this.setState({
			...this.state,
			fetchMLVForDelete: {
				...this.state.fetchMLVForDelete,
				filter: value
			}
		})
	}

	//************************** DELETE_ALL METHODS ***************************************
	addDeleteAllMLV() {
		var deleteAllMLVArray = this.state.deleteAllMLVs.deleteAllMLVArray;
		deleteAllMLVArray.push({
			mlv: '',
			index: deleteAllMLVArray.length,
			filter: '',
			attributes: ['MLVLEFTOBJ', 'MLVRIGHTOBJ', 'MLVOBJECT'],

		})

		this.setState({
			...this.state,
			deleteAllMLVs: {
				...this.state.deleteAllMLVs,
				deleteAllMLVArray: deleteAllMLVArray
			}
		})
	}
	copyInsertMLVToDeleteAll(index) {
		var deleteAllMLVArray = this.state.deleteAllMLVs.deleteAllMLVArray;
		deleteAllMLVArray[index].mlv = this.state.insertMLVs.insertMLVArray[0].mlv;
		deleteAllMLVArray[index].attributes = this.state.insertMLVs.insertMLVArray[0].attributes;
		this.setState({
			...this.state,
			deleteAllMLVs: {
				...this.state.deleteAllMLVs,
				deleteAllMLVArray: deleteAllMLVArray
			}
		})
	}
	generateDeleteAllMLV(index) {


		this.setState({
			...this.state,
			deleteAllMLVs: {
				...this.state.deleteAllMLVs,
				currentIndex: index
			},
			mountMLVGenerator: true,
			operation: 'deleteAllMLV'
		})
	}
	saveDeleteAllMLV(mlv, index) {
		if (index === undefined) {
			var deleteAllMLVArray = this.state.deleteAllMLVs.deleteAllMLVArray;
			deleteAllMLVArray[this.state.deleteAllMLVs.currentIndex].mlv = this.parseMLVLevelWise(mlv)
			var attributeColumns = new Array();
			if (mlv != '') {
				try {
					var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
					//var attributeValues = new Array(temp.length)
					//var attributeCollectiveValues = new Array();
					//attributeCollectiveValues.push(attributeValues.fill(''))
					deleteAllMLVArray[this.state.deleteAllMLVs.currentIndex].attributes = temp;
					//insertMLVArray[this.state.insertMLVs.currentIndex].values = attributeCollectiveValues
					//this.setAttributesForInsertMLV(index, attributeColumns)
				} catch{
					alert('Error parsing MLV')
				}
			}

			this.setState({
				...this.state,
				deleteAllMLVs: {
					...this.state.deleteAllMLVs,
					deleteAllMLVArray: deleteAllMLVArray
				},
				mountMLVGenerator: false
			})
		}
		else {

			var deleteAllMLVArray = this.state.deleteAllMLVs.deleteAllMLVArray;
			deleteAllMLVArray[index].mlv = this.parseMLVLevelWise(mlv)
			var attributeColumns = new Array();
			if (mlv != '') {
				try {
					var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
					deleteAllMLVArray[index].attributes = temp;
					//var attributeValues = new Array(temp.length)
					//var attributeCollectiveValues = new Array();
					//attributeCollectiveValues.push(attributeValues.fill(''))
					//insertMLVArray[index].values = attributeCollectiveValues
					//this.setAttributesForInsertMLV(index, attributeColumns)
				} catch{
					alert('Error parsing MLV')
				}
			}

			this.setState({
				...this.state,
				deleteAllMLVs: {
					...this.state.deleteAllMLVs,
					deleteAllMLVArray: deleteAllMLVArray
				},
				mountMLVGenerator: false
			})
		}
	}
	deleteDeleteAllMLV(index) {
		var deleteAllMLVArray = this.state.deleteAllMLVs.deleteAllMLVArray;
		deleteAllMLVArray.splice(index, 1);
		deleteAllMLVArray.map((object, index) => {
			object.index = index
		})

		this.setState({
			...this.state,
			deleteAllMLVs: {
				...this.state.deleteMLVs,
				deleteAllMLVArray: deleteAllMLVArray
			}
		})
	}
	addFilterForDeleteAll(index, value) {
		var deleteAllMLVArray = this.state.deleteAllMLVs.deleteAllMLVArray;
		deleteAllMLVArray[index].filter = deleteAllMLVArray[index].filter + value
		this.setState({
			...this.state,
			deleteAllMLVs: {
				...this.state.deleteAllMLVs,
				deleteAllMLVArray: deleteAllMLVArray
			}
		})
	}
	editFilterForDeleteAll(index, value) {
		var deleteAllMLVArray = this.state.deleteAllMLVs.deleteAllMLVArray;
		deleteAllMLVArray[index].filter = value
		this.setState({
			...this.state,
			deleteAllMLVs: {
				...this.state.deleteAllMLVs,
				deleteAllMLVArray: deleteAllMLVArray
			}
		})
	}

	selectBaseline(event) {
		this.setState({
			selectedBaseline: event.target.value
		})

		axios.post(constants.url + 'LoadWriteBaseline', 'baselineDetails=' + (encodeURIComponent(JSON.stringify({ baselineName: event.target.value }))), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}


		}).then(response => {
			console.log(response.data.testCases)
			this.setState({
				...this.state,
				loadedTestCases: response.data.testCases,
				newBaselineName : ''
			})
		})

	}

	addNewBaseline(event) {
		this.setState({
			selectedBaseline: '',
			newBaselineName: event.target.value
		})
	}

	// ************************* METHOD TO GENERATE BASELINE ***********************************
	generateBaseline() {

		if (this.state.selectedBaseline == '' && this.state.newBaselineName == '') {
			alert('Please select baseline excel file')
			return
		}
		if (this.state.testCaseSummary === '') {
			alert('Please enter test case summary')
			return
		}
		if (this.state.testCaseDescription === '') {
			alert('Please enter test case Description')
			return
		}
		this.setState({
			...this.state,
			isLoading: true
		})
		this.props.isLoading();
		var requestBody = {
			...this.state
		}
		requestBody.newBaselineName = requestBody.newBaselineName + '.xlsx'
		axios.post(constants.url + 'GenerateWriteBaseline', 'writeBaselineDetails=' + (encodeURIComponent(JSON.stringify(requestBody))), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}


		}).then(response => {
			this.props.isNotLoading();
			//alert(response.data)
			this.showPopUpNotification("Baseline Generated", "success");
			this.setState({
				...this.state,
				isLoading: false
			})
		}).catch(error => {
			this.props.isNotLoading();
			//alert(error)
			this.showPopUpNotification("Baseline Generation Failed", "error");
			this.setState({
				...this.state,
				isLoading: false
			})
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
	toggleDialog(event) {
		if (this.state.showConnectionSelectionDialog) {
			if (this.state.writeConnection === '') {
				alert('Please provide write connection')
				return
			}
		}
		this.setState({
			showConnectionSelectionDialog: !this.state.showConnectionSelectionDialog
		})
	}

	setWriteConnection(event) {
		var connectionName = event.target.getAttribute('connectionName');
		this.setState({
			...this.state,
			writeConnection: {
				connectionID: event.target.value,
				connectionName: connectionName
			}
		})
	}

	setFetchFromAnotherSourceConnection(event) {
		var connectionName = event.target.getAttribute('connectionName');
		this.setState({
			...this.state,
			fetchFromAnotherSourceConnection: {
				connectionID: event.target.value,
				connectionName: connectionName
			}
		})
	}

	loadSelectedTestCase(event) {

		this.setState({
			loadSelectedTestCase: event.target.value
		})

		axios.post(constants.url + 'LoadSelectedWriteTestCase', `testCaseDetails=${JSON.stringify({ baselineName: this.state.selectedBaseline, testCase: event.target.value })}`, {
			headers: {
			}


		}).then(response => {
			console.log(response.data)
			this.loadSelectedTestCaseInsert(response.data)
			this.loadSelectedTestCaseUpdate(response.data)
			this.loadSelectedTestCaseDelete(response.data)
			this.loadSelectedTestCaseDeleteAll(response.data)
			this.setState({
				...this.state,
				loadSelectedTestCase: event.target.value
			})
		})

	}

	loadSelectedTestCaseInsert(testCaseDetails) {
		var insertMLVArray = testCaseDetails.insertMLV.split('||');

		
		var insertIDArray = testCaseDetails.insertID.split('||').length > 0 ? testCaseDetails.insertID.split('||') : new Array() ;
		
		var insertPIDArray = testCaseDetails.insertPID.split('||').length > 0 ? testCaseDetails.insertPID.split('||') : new Array() ;
		
		var insertLEVArray = testCaseDetails.insertLEV.split('||').length > 0 ? testCaseDetails.insertLEV.split('||') : new Array();
		
		var insertPINColumnArray = testCaseDetails.insertPINColumn.split('||').length > 0 ? testCaseDetails.insertPINColumn.split('||') : new Array();

		var insertColumnsArray = testCaseDetails.insertColumns.split('||');
		var insertValuesArray = testCaseDetails.insertValues.split('||');

		var insertRSFlag = testCaseDetails.insertRSFlag;
		var bulkInsertFlag = testCaseDetails.bulkInsertFlag;
		var fetchFromAnotherSourceForInsertFlag = testCaseDetails.fetchFromAnotherSourceForInsertFlag;

		var fetchFromAnotherSourceForInsertMLV = testCaseDetails.fetchFromAnotherSourceForInsertMLV;
		var fetchFromAnotherSourceForInsertFilter = testCaseDetails.fetchFromAnotherSourceForInsertFilter;

		var insertSelectMLV = testCaseDetails.insertSelectMLV;
		var insertSelectFilter = testCaseDetails.insertSelectFilter;

		var newInsertMLVsArray = new Array();
		insertMLVArray.map((mlv, index) => {
			
			var insertMLV = {
				mlv: mlv.trim(),
				index: index,
				ID: insertIDArray[index] != undefined ? insertIDArray[index] : '',
				PID: insertPIDArray[index] != undefined ? insertPIDArray[index] : '',
				LEV: insertLEVArray[index] != undefined ? insertLEVArray[index] : '',
				PIN: insertPINColumnArray[index] != undefined ? insertPINColumnArray[index] : '',
				values: [[]],
				attributes: mlv != '' ? (mlv.split('attributes=')[1].split(';')[0].split(',')) : new Array()
			}
			console.log('%%%%%%%%%%')
			console.log(insertMLV)

			// * SETTING VALUES

			var currentColumns = insertColumnsArray[index].trim();
			currentColumns = currentColumns.substring(1, currentColumns.length - 1)
			console.log('current columns ' + currentColumns);


			var currentValues = insertValuesArray[index].trim();
			currentValues = currentValues.substring(1, currentValues.length - 1);
			console.log('current column values' + currentValues);

			//alert('arrayLength ' + arrayLength)
			var currentColumnsArray = currentColumns.split(',');
			var currentColumnLength = currentColumnsArray.length;
			this.splitValues(currentValues);
			//var currentValuesArray = currentValues.split(',');
			var currentValuesArray = this.splitValues(currentValues);
			var currentValuesLength = currentValuesArray.length;

			var arrayLength = currentValuesLength / currentColumnLength;
			//alert('arrayLength ' + arrayLength)

			var valuesArray = new Array();
			if(arrayLength == 0)
				valuesArray.push(new Array());

			for (var i = 0; i < arrayLength; i++) {
				var valueArray = new Array();
				for (var j = 0; j < currentColumnsArray.length; j++) {
					//alert(currentColumnsArray[j])
					var value = {
						attributeName: currentColumnsArray[j].trim(),
						value: currentValuesArray[i * currentColumnLength + j]
					}

					valueArray.push(value)
				}

				valuesArray.push(valueArray)
			}

			insertMLV.values = valuesArray;

			newInsertMLVsArray.push(insertMLV)

		})

		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: newInsertMLVsArray
			},
			fetchFromAnotherSourceForInsertFlag: fetchFromAnotherSourceForInsertFlag,
			rsInsertFlag: false,
			bulkInsertFlag: false,
			fetchFromAnotherSourceForInsert: {
				mlv: fetchFromAnotherSourceForInsertMLV.trim(),
				attributes: fetchFromAnotherSourceForInsertMLV != '' ? (fetchFromAnotherSourceForInsertMLV.split('attributes=')[1].split(';')[0].split(',')) : new Array(),
				filter: fetchFromAnotherSourceForInsertFilter,
				selectedPlugin: ''
			},

			fetchMLVForinsert: {
				mlv: insertSelectMLV,
				filter: insertSelectFilter,
				attributes: insertSelectMLV != '' ? (insertSelectMLV.split('attributes=')[1].split(';')[0].split(',')) : new Array(),
				selectedPlugin: ''
			},


		})


	}

	loadSelectedTestCaseUpdate(testCaseDetails) {

		var bulkUpdateFlag = testCaseDetails.bulkUpdateFlag;
		var updateMLVArray = testCaseDetails.updateMLV.split('||');
		var updateColumnsArray = testCaseDetails.updateColumns.split('||');
		var updateFilterString = testCaseDetails.updateFilter;
		var updateFilterArray = new Array();
		var updateSelectMLV = testCaseDetails.updateSelectMLV;
		var updateSelectFilter = testCaseDetails.updateSelectFilter;
		var fetchFromAnotherSourceForUpdateMLV = '';
		var fetchFromAnotherSourceForUpdateFilter = '';
		var ID = '';
		var PID = '';
		var LEV = '';
		var PIN = '';
		var MLVLEFTOBJ = '';
		var MLVRIGHTOBJ = '';

		if(!bulkUpdateFlag){
			updateFilterArray = updateFilterString.split('||');
		}
		if(bulkUpdateFlag){
			fetchFromAnotherSourceForUpdateMLV = updateFilterString.split('||')[0];
			fetchFromAnotherSourceForUpdateFilter = updateFilterString.split('||')[1];
			ID = updateFilterString.split('||')[2];
			PID = updateFilterString.split('||')[3];
			LEV = updateFilterString.split('||')[4];
			PIN = updateFilterString.split('||')[5];
		}
		// * CASE WHEN BULK UPDATE FLAG IS TRUE



		// * CASE WHEN BULK UPDATE FLAG IS NOT TRUE

		//var updateMLVArray = new Array();
		var updateMLVs = new Array();
		updateMLVArray.map((mlv, index)=>{
			var updateMLV = {
				mlv: mlv.trim(),
				index: index,
				values: [],
				attributes: mlv != '' ? (mlv.split('attributes=')[1].split(';')[0].split(',')) : new Array(),
				filter : bulkUpdateFlag ? '' : updateFilterArray[index]
			}

			// * SETTING VALUES
			var currentColumnValues = updateColumnsArray[index];
			var columnValuePairArray = new Array();
			columnValuePairArray = this.splitValues(currentColumnValues);
			var values = new Array();
			for(var i=0; i< columnValuePairArray.length; i++){
				var temp = {
					attributeName : columnValuePairArray[i].split('=')[0],
					value : bulkUpdateFlag ? columnValuePairArray[i].split('=')[1].trim().substring(1, columnValuePairArray[i].split('=')[1].trim().length-1) : columnValuePairArray[i].split('=')[1].trim()
				}
				values.push(temp)
			}

			updateMLV.values = values;
			updateMLVs.push(updateMLV)
		
		})

		this.setState({
			...this.state,
			updateMLVs : {
				...this.state.updateMLVs,
				updateMLVArray : updateMLVs
			},
			fetchFromAnotherSourceForUpdate : {
				...this.state.fetchFromAnotherSourceForUpdate,
				mlv : fetchFromAnotherSourceForUpdateMLV,
				attributes : fetchFromAnotherSourceForUpdateMLV != '' ? (fetchFromAnotherSourceForUpdateMLV.split('attributes=')[1].split(';')[0].split(',')) : new Array(),
				filter : fetchFromAnotherSourceForUpdateFilter,
				ID : ID,
				PID : PID,
				LEV : LEV,
				PIN : PIN

			},
			fetchFromAnotherSourceForUpdateFlag : bulkUpdateFlag,
			fetchMLVForUpdate: {
					...this.state.fetchMLVForUpdate,
					mlv: updateSelectMLV,
					filter: updateSelectFilter,
					attributes: updateSelectMLV != '' ? (updateSelectMLV.split('attributes=')[1].split(';')[0].split(',')) : new Array(),
					
				}
		})

		 
	}

	loadSelectedTestCaseDelete(testCaseDetails) {
		var bulkDeleteFlag = testCaseDetails.bulkDeleteFlag;
		var deleteMLVArray = testCaseDetails.deleteMLV.split('||');
		var deleteFilterString = testCaseDetails.deleteFilter;
		var deleteSelectMLV = testCaseDetails.deleteSelectMLV;
		var deleteSelectFilter = testCaseDetails.deleteSelectFilter;
		var deleteFilterArray = new Array();
		var fetchFromAnotherSourceForDeleteMLV = '';
		var fetchFromAnotherSourceForDeleteFilter = '';
		var ID = '';
		var PID = '';
		var LEV = '';
		var PIN = '';

		if(!bulkDeleteFlag){
			deleteFilterArray = deleteFilterString.split('||');
		}
		if(bulkDeleteFlag){
			fetchFromAnotherSourceForDeleteMLV = deleteFilterString.split('||')[0];
			fetchFromAnotherSourceForDeleteFilter = deleteFilterString.split('||')[1];
			ID = deleteFilterString.split('||')[2];
			PID = deleteFilterString.split('||')[3];
			LEV = deleteFilterString.split('||')[4];
			PIN = deleteFilterString.split('||')[5];
		}

		var deleteMLVs = new Array();

		deleteMLVArray.map((mlv, index)=>{
			var temp = {
				mlv: mlv,
				index: index,
				filter: !bulkDeleteFlag ? deleteFilterArray[index] : '',
				attributes: mlv != '' ? (mlv.split('attributes=')[1].split(';')[0].split(',')) : new Array()
			}
		deleteMLVs.push(temp);
		})

		this.setState({
			...this.state,
			deleteMLVs : {
				...this.state.deleteMLVs,
				deleteMLVArray : deleteMLVs
			},
			fetchFromAnotherSourceForDeleteFlag : bulkDeleteFlag,
			fetchMLVForDelete: {
					mlv: deleteSelectMLV,
					filter: deleteSelectFilter,
					attributes: deleteSelectMLV != '' ? (deleteSelectMLV.split('attributes=')[1].split(';')[0].split(',')) : new Array(),
					selectedPlugin: ''
				},

			fetchFromAnotherSourceForDelete: {
					mlv: fetchFromAnotherSourceForDeleteMLV,
					attributes: fetchFromAnotherSourceForDeleteMLV != '' ? (fetchFromAnotherSourceForDeleteMLV.split('attributes=')[1].split(';')[0].split(',')) : new Array(),
					filter: fetchFromAnotherSourceForDeleteFilter,
					selectedPlugin: '',
					ID : ID,
					PID : PID,
					LEV : LEV,
					PIN : PIN,
				}


		})

	}

	loadSelectedTestCaseDeleteAll(testCaseDetails) {

		var deleteAllMLVArray = testCaseDetails.deleteAllMLV.split('||');
		var deleteAllMLVFilter = testCaseDetails.deleteAllFilter.split('||');

		var deleteAllMLVs = new Array();
		deleteAllMLVArray.map((mlv, index)=>{

			var temp = {
				mlv: mlv,
				index: index,
				filter: deleteAllMLVFilter.length > 0 ? deleteAllMLVFilter[index] : '',
				attributes:mlv != '' ? (mlv.split('attributes=')[1].split(';')[0].split(',')) : new Array(),
			}

			deleteAllMLVs.push(temp);
		})

		this.setState({
			...this.state,
			deleteAllMLVs: {
					currentIndex: 0,
					deleteAllMLVArray: deleteAllMLVs
				}
		})
	}

	splitValues(values) {

		var quotesClosed = true;
		var parentQuoteType = '';
		var valueAdded = true;
		var valuesArray = new Array();
		var parentQuoteCount = 0;
		var newVal = '';
		var bCount = 0;
		for (var i = 0; i < values.length; i++) {
			var character = values[i];

			if (valueAdded) {
				//alert(character)
				if (character == '"'){
					parentQuoteType = '"';
					//alert('parentQuote ' + parentQuoteType)
				}else {
				if (character == "'"){

					parentQuoteType = "'";
					//alert('parentQuote ' + parentQuoteType)
				}else
					parentQuoteType = "";
			}
				

				valueAdded = false;
			}

			if (character != ',')
				newVal = newVal + character;
			else{
				//alert('comma')
					//alert(character)
					//alert(parentQuoteCount)
				if (parentQuoteCount % 2 != 0 || bCount !=0){
					//alert('comma')
					//alert(character)
					//alert(parentQuoteCount)
					newVal = newVal + character;
				}
			}
			//alert('before char comp')
			//alert(character)
			//alert(parentQuoteType)
			if (character == parentQuoteType && bCount == 0) {
				//alert('character == parentQuote')
				if (i > 0) {
					if (values[i - 1] != '\\')
						parentQuoteCount++;
				} else {
					parentQuoteCount++;
				}
			}

			if (character == '(')
				bCount++;
			if (character == ')')
				bCount--;

			if (character === ',' && parentQuoteCount % 2 == 0 && bCount == 0) {
				valuesArray.push(newVal);
				newVal = '';
				valueAdded = true;
				parentQuoteType = '';
				parentQuoteCount = 0;
			}

			if (i == values.length - 1)
				valuesArray.push(newVal)



		}

		console.log('NEW VALUES GENERATED !!!!!')
		console.log(valuesArray)
		return valuesArray
	}

	toggleOverWrite(event){
		this.setState({
			...this.state,
			overWrite : !this.state.overWrite
		})
	}

	componentWillUnmount() {
		this.props.saveWriteBaselineState(this.state)
	}

	 showPopUpNotification = (message, type) => {
        this.popUpNotificationWidget.show(message, type);
    }


	render() {

		var loadingComponent = this.state.isLoading ? <LoadingPanel /> : ""
		var fetchFromAnotherSourceConnectionSelectionElement = (
			<div>
			 <Notification widgetRef={(widget) => this.popUpNotificationWidget = widget} height= '5em' style={{height : '5em', width : '5em', fontSize : '4em'}}/>
				{this.state.showConnectionSelectionDialog && <Dialog title={"Please select connections"} onClose={this.toggleDialog.bind(this)} width={800} height={500}>
					<div className="row justify-content-center" style={{ width: '100%' }}>
						<div className="col-lg-6">
							<select
								multiple
								className="form-control"
								size={12}
								//onDoubleClick={this.addPredicate.bind(this)}

								style={{ overflowX: "scroll" }}
							>
								{
									this.props.connections.map((connection) => {

										return (

											<option key={connection.connectionID}
												onDoubleClick={this.setWriteConnection.bind(this)}
												value={connection.connectionID}
												connectionName={connection.connectionName}
											>{connection.connectionName}</option>
										)
									})
								}
							</select>
							<Input

								label="Destination Connection"
								style={{ width: "90%", textAlign: "center", margin: "1em" }}
								value={this.state.writeConnection.connectionName}
							/>
						</div>
						<div className="col-lg-6">
							<select
								multiple
								className="form-control"
								size={12}
								//onDoubleClick={this.addPredicate.bind(this)}

								style={{ overflowX: "scroll" }}
							>
								{
									this.props.connections.map((connection) => {

										return (

											<option key={connection.connectionID}
												onDoubleClick={this.setFetchFromAnotherSourceConnection.bind(this)}
												value={connection.connectionID}
												connectionName={connection.connectionName}
											>{connection.connectionName}</option>
										)
									})
								}
							</select>
							<Input

								label="Source Connection"
								style={{ width: "90%", textAlign: "center", margin: "1em" }}

								value={this.state.fetchFromAnotherSourceConnection.connectionName}
							/>
						</div>
					</div>
					<DialogActionsBar>
						<Button
							primary={true}
							onClick={this.toggleDialog.bind(this)}
						>
							Cancel
					</Button>
						<Button
							primary={true}
							onClick={this.toggleDialog.bind(this)}
						>
							Save
					</Button>

					</DialogActionsBar>
				</Dialog>}
			</div>


		)
		console.log(this.state)
		var mlvGenerator = this.state.mountMLVGenerator ? (
			<MLVGenerator
				oldState={{}}
				parent={this.state.operation}
				connections={this.props.connections}
				saveMLVForFetchFromAnotherSource={this.saveMLVForFetchFromAnotherSource.bind(this)}
				saveInsertMLV={this.saveInsertMLV.bind(this)}
				saveFetchMLVForInsert={this.saveFetchMLVForInsert.bind(this)}
				saveMLVForFetchFromAnotherSourceForUpdate={this.saveMLVForFetchFromAnotherSourceForUpdate.bind(this)}
				saveUpdateMLV={this.saveUpdateMLV.bind(this)}
				saveFetchMLVForUpdate={this.saveFetchMLVForUpdate.bind(this)}
				saveMLVForFetchFromAnotherSourceForDelete={this.saveMLVForFetchFromAnotherSourceForDelete.bind(this)}
				saveDeleteMLV={this.saveDeleteMLV.bind(this)}
				saveFetchMLVForDelete={this.saveFetchMLVForDelete.bind(this)}
				saveDeleteAllMLV={this.saveDeleteAllMLV.bind(this)}
				writeConnection={this.state.writeConnection}
				fetchFromAnotherSourceConnection={this.state.fetchFromAnotherSourceConnection}

			/>
		) : ''

		console.log(mlvGenerator)
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
				{fetchFromAnotherSourceConnectionSelectionElement}
				<div className="container-fluid" style={{ marginTop: "2em", filter: this.state.blurState ? "blur(40px)" : "none" }}>
					{loadingComponent}
					{mlvGenerator}
					<div className="row justify-content-center">
						<div className="col-lg-2">
							<Button
								style={{ margin: "1em" }}
								onClick={this.toggleDialog.bind(this)}
								primary={true}
							>
								Set Write Connections
									</Button>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-lg-6 justify-content-center">
							<DropDownList
								style={{ margin: "1em", width: "100%" }}
								data={this.state.baslineFilesList}
								label="Select baseline file"
								onChange={this.selectBaseline.bind(this)}
								value={this.state.selectedBaseline}
							/>
							<DropDownList
								style={{ margin: "1em", width: "100%" }}
								data={this.state.loadedTestCases}
								label="Load Test Case"
								textField='testCaseLabel'
								dataItemKey='testCaseNo'
								onChange={this.loadSelectedTestCase.bind(this)}
								value={this.state.loadSelectedTestCase}
							/>
							<Input

								label="Add a new baseline instead.."
								value={this.state.newBaselineName}
								style={{ width: "100%", textAlign: "center", margin: "1em" }}
								onChange={this.addNewBaseline.bind(this)}

							/>


						</div>




					</div>
					<div className="row">
						<div className="col-lg-6">
							<form className="k-form">
								<Input
									required={true}
									label="Test Case Summary*"
									style={{ width: "90%", textAlign: "center", margin: "1em" }}
									value={this.state.testCaseSummary}
									onChange={this.setTestCaseSummary.bind(this)}

								/>
							</form>
						</div>
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

					<div className="row">
						<div className="col-lg-12">
							<TabStrip selected={this.state.selected} onSelect={this.handleSelect.bind(this)}>

								<TabStripTab title="Insert">
									<InsertDetails
										insertState={this.state.insertState}
										saveInsertDetailsState={this.saveInsertDetailsState.bind(this)}
										generateMLV={this.generateMLV.bind(this)}
										saveMLVForFetchFromAnotherSource={this.saveMLVForFetchFromAnotherSource.bind(this)}
										fetchFromAnotherSourceForInsert={this.state.fetchFromAnotherSourceForInsert}
										fetchFromAnotherSourceForInsertFlag={this.state.fetchFromAnotherSourceForInsertFlag}
										toggleFetchFromAnotherSource={this.toggleFetchFromAnotherSource.bind(this)}
										insertMLVArray={this.state.insertMLVs.insertMLVArray}
										addInsertMLV={this.addInsertMLV.bind(this)}
										generateInsertMLV={this.generateInsertMLV.bind(this)}
										setInsertID={this.setInsertID.bind(this)}
										setInsertPID={this.setInsertPID.bind(this)}
										setInsertLEV={this.setInsertLEV.bind(this)}
										setInsertPIN={this.setInsertPIN.bind(this)}
										saveInsertMLV={this.saveInsertMLV.bind(this)}
										setInsertValues={this.setInsertValues.bind(this)}
										setAttributesForInsertMLV={this.setAttributesForInsertMLV.bind(this)}
										addAttributeInsertValue={this.addAttributeInsertValue.bind(this)}
										addAttributeInsertValueGroup={this.addAttributeInsertValueGroup.bind(this)}
										deleteAttributeInsertValueGroup={this.deleteAttributeInsertValueGroup.bind(this)}
										saveFetchMLVForInsert={this.saveFetchMLVForInsert.bind(this)}
										addFilterForFetchMLVForInsert={this.addFilterForFetchMLVForInsert.bind(this)}
										editFilterForFetchMLVForInsert={this.editFilterForFetchMLVForInsert.bind(this)}
										generateFetchMLVForInsert={this.generateFetchMLVForInsert.bind(this)}
										fetchMLVForinsert={this.state.fetchMLVForinsert}
										toggleRSInsert={this.toggleRSInsert.bind(this)}
										toggleBulkInsert={this.toggleBulkInsert.bind(this)}
										rsInsertFlag={this.state.rsInsertFlag}
										bulkInsertFlag={this.state.bulkInsertFlag}
										deleteInsertMLV={this.deleteInsertMLV.bind(this)}
										insertMLVLength={this.state.insertMLVs.insertMLVArray.length}
										addAttributeValuePairForInsert={this.addAttributeValuePairForInsert.bind(this)}
										setSelectedAttributeForInsert={this.setSelectedAttributeForInsert.bind(this)}
										addAttributeValuePairForInsertNew={this.addAttributeValuePairForInsertNew.bind(this)}
										addFilterForFetchFromAnotherSourceForInsert={this.addFilterForFetchFromAnotherSourceForInsert.bind(this)}
										editFilterForFetchFromAnotherSourceForInsert={this.editFilterForFetchFromAnotherSourceForInsert.bind(this)}
										copyInsertMLVToInsertFetch={this.copyInsertMLVToInsertFetch.bind(this)}
										executeInsert={this.executeInsert.bind(this)}
										deleteSelectedAttributeForInsert={this.deleteSelectedAttributeForInsert.bind(this)}
										setRawDataInsertColumns={this.setRawDataInsertColumns.bind(this)}
										setRawDataInsertValues={this.setRawDataInsertValues.bind(this)}
									/>
								</TabStripTab>
								<TabStripTab title="Update">
									<UpdateDetails
										toggleFetchFromAnotherSourceForUpdate={this.toggleFetchFromAnotherSourceForUpdate.bind(this)}
										fetchFromAnotherSourceForUpdateFlag={this.state.fetchFromAnotherSourceForUpdateFlag}
										generateMLVFetchFromAnotherSourceForUpdate={this.generateMLVFetchFromAnotherSourceForUpdate.bind(this)}
										fetchFromAnotherSourceForUpdate={this.state.fetchFromAnotherSourceForUpdate}
										saveMLVForFetchFromAnotherSourceForUpdate={this.saveMLVForFetchFromAnotherSourceForUpdate.bind(this)}
										addFilterForFetchFromAnotherSourceForUpdate={this.addFilterForFetchFromAnotherSourceForUpdate.bind(this)}
										editFilterForFetchFromAnotherSourceForUpdate={this.editFilterForFetchFromAnotherSourceForUpdate.bind(this)}
										updateMLVArray={this.state.updateMLVs.updateMLVArray}
										addUpdateMLV={this.addUpdateMLV.bind(this)}
										generateUpdateMLV={this.generateUpdateMLV.bind(this)}
										saveUpdateMLV={this.saveUpdateMLV.bind(this)}
										deleteUpdateMLV={this.deleteUpdateMLV.bind(this)}
										addUpdateValuePair={this.addUpdateValuePair.bind(this)}
										setSelectedAttribute={this.setSelectedAttribute.bind(this)}
										setValueForSelectedAttributeForUpdate={this.setValueForSelectedAttributeForUpdate.bind(this)}
										deleteSelectedAttributeForUpdate={this.deleteSelectedAttributeForUpdate.bind(this)}
										setIDForUpdate={this.setIDForUpdate.bind(this)}
										setPIDForUpdate={this.setPIDForUpdate.bind(this)}
										setLEVForUpdate={this.setLEVForUpdate.bind(this)}
										setPINForUpdate={this.setPINForUpdate.bind(this)}
										addFilterForUpdate={this.addFilterForUpdate.bind(this)}
										editFilterForUpdate={this.editFilterForUpdate.bind(this)}
										generateFetchMLVForUpdate={this.generateFetchMLVForUpdate.bind(this)}
										saveFetchMLVForUpdate={this.saveFetchMLVForUpdate.bind(this)}
										fetchMLVForUpdate={this.state.fetchMLVForUpdate}
										addFilterForFetchMLVForUpdate={this.addFilterForFetchMLVForUpdate.bind(this)}
										editFilterForFetchMLVForUpdate={this.editFilterForFetchMLVForUpdate.bind(this)}
										insertMLVLength={this.state.insertMLVs.insertMLVArray.length}
										copyInsertMLVToUpdateFetch={this.copyInsertMLVToUpdateFetch.bind(this)}
										copyInsertMLVToUpdate={this.copyInsertMLVToUpdate.bind(this)}

									/>
								</TabStripTab>
								<TabStripTab title="Delete">
									<DeleteDetails
										setIDForDelete={this.setIDForDelete.bind(this)}
										setPIDForDelete={this.setPIDForDelete.bind(this)}
										setLEVForDelete={this.setLEVForDelete.bind(this)}
										setPINForDelete={this.setPINForDelete.bind(this)}
										deleteMLVs={this.state.deleteMLVs}
										addDeleteMLV={this.addDeleteMLV.bind(this)}
										generateDeleteMLV={this.generateDeleteMLV.bind(this)}
										saveDeleteMLV={this.saveDeleteMLV.bind(this)}
										deleteDeleteMLV={this.deleteDeleteMLV.bind(this)}
										addFilterForDelete={this.addFilterForDelete.bind(this)}
										editFilterForDelete={this.editFilterForDelete.bind(this)}
										fetchMLVForDelete={this.state.fetchMLVForDelete}
										generateFetchMLVForDelete={this.generateFetchMLVForDelete.bind(this)}
										saveFetchMLVForDelete={this.saveFetchMLVForDelete.bind(this)}
										addFilterForFetchMLVForDelete={this.addFilterForFetchMLVForDelete.bind(this)}
										editFilterForFetchMLVForDelete={this.editFilterForFetchMLVForDelete.bind(this)}
										toggleFetchFromAnotherSourceForDelete={this.toggleFetchFromAnotherSourceForDelete.bind(this)}
										fetchFromAnotherSourceForDeleteFlag={this.state.fetchFromAnotherSourceForDeleteFlag}
										fetchFromAnotherSourceForDelete={this.state.fetchFromAnotherSourceForDelete}
										saveMLVForFetchFromAnotherSourceForDelete={this.saveMLVForFetchFromAnotherSourceForDelete.bind(this)}
										addFilterForFetchFromAnotherSourceForDelete={this.addFilterForFetchFromAnotherSourceForDelete.bind(this)}
										editFilterForFetchFromAnotherSourceForDelete={this.editFilterForFetchFromAnotherSourceForDelete.bind(this)}
										generateMLVFetchFromAnotherSourceForDelete={this.generateMLVFetchFromAnotherSourceForDelete.bind(this)}
										insertMLVLength={this.state.insertMLVs.insertMLVArray.length}
										copyInsertMLVToDeleteFetch={this.copyInsertMLVToDeleteFetch.bind(this)}
										copyInsertMLVToDelete={this.copyInsertMLVToDelete.bind(this)}

									/>
								</TabStripTab>
								<TabStripTab title="Delete All">
									<DeleteAllDetails
										deleteAllMLVs={this.state.deleteAllMLVs}
										addDeleteAllMLV={this.addDeleteAllMLV.bind(this)}
										generateDeleteAllMLV={this.generateDeleteAllMLV.bind(this)}
										saveDeleteAllMLV={this.saveDeleteAllMLV.bind(this)}
										deleteDeleteAllMLV={this.deleteDeleteAllMLV.bind(this)}
										addFilterForDeleteAll={this.addFilterForDeleteAll.bind(this)}
										editFilterForDeleteAll={this.editFilterForDeleteAll.bind(this)}
										generateBaseline={this.generateBaseline.bind(this)}
										insertMLVLength={this.state.insertMLVs.insertMLVArray.length}
										copyInsertMLVToDeleteAll={this.copyInsertMLVToDeleteAll.bind(this)}
									/>
								</TabStripTab>
							</TabStrip>
						</div>
					</div>
					<div className="row d-flex" style={{ width: '100%' }}>
						<div className="col-lg-1">
							<Button
								style={{ margin: "1em" }}
								onClick={this.executeInsert.bind(this)}
								primary={true}
							>
								Execute
									</Button>
						</div>
						<div className="col-lg-7"></div>
						<div className="col-lg-2">
							{ this.state.loadSelectedTestCase.testCaseNo != '' && 
								<div><Switch
									style={{ margin: "2em" }}
									checked={this.state.overWrite}
									onChange={this.toggleOverWrite.bind(this)}
								/>Overwrite Test Case</div>}
						</div>
						<div className="col-lg-2 ">
							<Button
								className="float-right"
								primary={true}
								//id={object.index}
								onClick={this.generateBaseline.bind(this)}
								style={{ margin: '1em' }}
							>Generate Baseline
					</Button>
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