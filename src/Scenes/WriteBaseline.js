import React, { Component } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import InsertDetails from './Components/InsertDetails'
import UpdateDetails from './Components/UpdateDetails'
import DeleteDetails from './Components/deleteDetails'
import DeleteAllDetails from './Components/DeleteAllDetails'
import MLVGenerator from './MLVGenerator';
import { BrowserRouter, Route, Router, HashRouter, Redirect } from 'react-router-dom';
export default class WriteBaseline extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: 0,
			testCaseSummary: '',
			testCaseDescription: '',
			mountMLVGenerator: false,
			operation: '',
			fetchFromAnotherSource: false,
			fetchFromAnotherSourceForUpdateFlag: false,
			fetchFromAnotherSourceForDeleteFlag : false,
			fetchFromAnotherSourceMLV: '',
			fetchFromAnotherSourceForUpdate: {
				mlv: '',
				attributes: [],
				filter: ''
			},
			fetchFromAnotherSourceForDelete: {
				mlv: '',
				attributes: [],
				filter: ''
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
				attributes: []
			},
			fetchMLVForUpdate: {
				mlv: '',
				filter: '',
				attributes: []
			},
			fetchMLVForDelete: {
				mlv: '',
				filter: '',
				attributes: []
			},
			rsInsertFlag: false,
			bulkInsertFlag: false


		}
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
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}
		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}

	saveMLVForFetchFromAnotherSource(mlv) {

		this.setState({
			...this.state,
			fetchFromAnotherSourceMLV: mlv,
			mountMLVGenerator: false
		})
	}

	toggleFetchFromAnotherSource() {
		this.setState({
			...this.state,
			fetchFromAnotherSource: !this.state.fetchFromAnotherSource
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
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}

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
		
		if(mlv != undefined)
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
					var attributeValues = new Array(temp.length)
					var attributeCollectiveValues = new Array();
					attributeCollectiveValues.push(attributeValues.fill(''))
					insertMLVArray[this.state.insertMLVs.currentIndex].attributes = temp;
					insertMLVArray[this.state.insertMLVs.currentIndex].values = attributeCollectiveValues
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
					insertMLVArray[index].attributes = temp;
					var attributeValues = new Array(temp.length)
					var attributeCollectiveValues = new Array();
					attributeCollectiveValues.push(attributeValues.fill(''))
					insertMLVArray[index].values = attributeCollectiveValues
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

	// * METHOD TO SET ATTRIBUTES FOR INSERT_MLV
	setAttributesForInsertMLV(index, attributes) {
		console.log(attributes)
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

	addAttributeInsertValue(index, attributeIndex, groupIndex, value) {

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].values[groupIndex][attributeIndex] = value;
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
		var attributeLength = insertMLVArray[index].attributes.length;
		var attributeValues = new Array(attributeLength)
		insertMLVArray[index].values.push(attributeValues.fill(''))
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

	// * GENERATE FETCH MLV FOR INSERT
	generateFetchMLVForInsert() {
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: 'fetchMLVForInsert'
		})
	}
	saveFetchMLVForInsert(mlv) {
		var attributes = mlv.split('attributes=')[1].split(';')[0].split(',')
		this.setState({
			...this.state,
			fetchMLVForinsert: {
				...this.state.fetchMLVForinsert,
				mlv: mlv,
				attributes: attributes
			},
			mountMLVGenerator: false
		})
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

	// ****************** UPDATE_DETAILS METHODS *******************************
	toggleFetchFromAnotherSourceForUpdate() {
		this.setState({
			...this.state,
			fetchFromAnotherSourceForUpdateFlag: !this.state.fetchFromAnotherSourceForUpdateFlag
		})
	}
	generateMLVFetchFromAnotherSourceForUpdate(operation) {
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}
		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}
	saveMLVForFetchFromAnotherSourceForUpdate(mlv) {
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchFromAnotherSourceForUpdate: {
						...this.state.fetchFromAnotherSourceForUpdate,
						mlv: mlv,
						attributes: temp
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
			ID: '',
			PID: '',
			LEV: '',
			PIN: '',
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
	// * METHOD TO GENERATE UPDATE MLV
	generateUpdateMLV(index) {
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}

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
	setIDForUpdate(index, value) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].ID = value
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}
	setPIDForUpdate(index, value) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].PID = value
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}
	setLEVForUpdate(index, value) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].LEV = value
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
			}
		})
	}
	setPINForUpdate(index, value) {
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].PIN = value
		this.setState({
			...this.state,
			updateMLVs: {
				...this.state.updateMLVs,
				updateMLVArray: updateMLVArray
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
	generateFetchMLVForUpdate(operation) {
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}
		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}
	saveFetchMLVForUpdate(mlv) {
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchMLVForUpdate: {
						...this.state.fetchMLVForUpdate,
						mlv: mlv,
						attributes: temp
					},
					mountMLVGenerator: false
				})
			} catch{

				alert('Error Parsing MLV')
				return
			}

		}else{
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
	toggleFetchFromAnotherSourceForDelete(){
		this.setState({
			...this.state,
			fetchFromAnotherSourceForDeleteFlag : !this.state.fetchFromAnotherSourceForDeleteFlag
		})
	}
	generateMLVFetchFromAnotherSourceForDelete(operation) {
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}
		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}
	saveMLVForFetchFromAnotherSourceForDelete(mlv) {
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchFromAnotherSourceForDelete: {
						...this.state.fetchFromAnotherSourceForDelete,
						mlv: mlv,
						attributes: temp
					},
					mountMLVGenerator: false
				})
			} catch{

				alert('Error Parsing MLV')
				return
			}

		}else {
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
	generateDeleteMLV(index) {
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}

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
	addFilterForDelete(index,value){
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
	editFilterForDelete(index, value){
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
	generateFetchMLVForDelete(operation) {
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}
		console.log(operation)
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation: operation

		})

	}
	saveFetchMLVForDelete(mlv) {
		if (mlv != '') {
			try {

				var temp = mlv.split('attributes=')[1].split(';')[0].split(',')
				this.setState({
					...this.state,
					fetchMLVForDelete: {
						...this.state.fetchMLVForDelete,
						mlv: mlv,
						attributes: temp
					},
					mountMLVGenerator: false
				})
			} catch{

				alert('Error Parsing MLV')
				return
			}

		}else{
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
	addFilterForFetchMLVForDelete(value){
		this.setState({
			...this.state,
			fetchMLVForDelete: {
				...this.state.fetchMLVForDelete,
				filter: this.state.fetchMLVForDelete.filter + value
			}
		})
	}
	editFilterForFetchMLVForDelete(value){
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
	generateDeleteAllMLV(index) {
		if (this.props.connInfoList.length < 1) {
			alert('Please choose base connection first')
			return
		}

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
	addFilterForDeleteAll(index,value){
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
	editFilterForDeleteAll(index, value){
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


	render() {
		console.log(this.state)
		var mlvGenerator = this.state.mountMLVGenerator && this.props.connInfoList.length > 0 ? (
			<MLVGenerator connInfoList={this.props.connInfoList}
				oldState={{}}
				parent={this.state.operation}
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

			/>
		) : ''

		console.log(mlvGenerator)
		return (

			<div className="container-fluid" style={{ marginTop: "2em" }}>
				{mlvGenerator}
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
									generateMLV={this.generateMLV.bind(this)}
									saveMLVForFetchFromAnotherSource={this.saveMLVForFetchFromAnotherSource.bind(this)}
									fetchFromAnotherSourceMLV={this.state.fetchFromAnotherSourceMLV}
									fetchFromAnotherSource={this.state.fetchFromAnotherSource}
									toggleFetchFromAnotherSource={this.toggleFetchFromAnotherSource.bind(this)}
									insertMLVArray={this.state.insertMLVs.insertMLVArray}
									addInsertMLV={this.addInsertMLV.bind(this)}
									generateInsertMLV={this.generateInsertMLV.bind(this)}
									setInsertID={this.setInsertID.bind(this)}
									setInsertPID={this.setInsertPID.bind(this)}
									setInsertLEV={this.setInsertLEV.bind(this)}
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

								/>
							</TabStripTab>
							<TabStripTab title="Delete">
								<DeleteDetails
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
								/>
							</TabStripTab>
						</TabStrip>
					</div>
				</div>
			</div>
		)
	}
}