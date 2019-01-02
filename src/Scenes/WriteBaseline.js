import React, { Component } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import InsertDetails from './Components/InsertDetails'
import UpdateDetails from './Components/UpdateDetails'
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
			fetchFromAnotherSourceMLV: '',
			fetchFromAnotherSourceForUpdate: {
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
			fetchMLVForinsert: {
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
		console.log()


		return mlv.replace(new RegExp('Level', 'g'), '\n\r Level')
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
						attributes : temp
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
			values: [],
			attributes: ['MLVLEFTOBJ','MLVRIGHTOBJ','MLVOBJECT']
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
	addUpdateValuePair(index){
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].values.push({
			attributeName : '',
			value : '',
		})

		this.setState({
			...this.state,
			updateMLVs : {
				...this.state.updateMLVs,
				updateMLVArray : updateMLVArray
			}
		})

	}
	setSelectedAttribute(index,attributeIndex,attributeName){
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].values[attributeIndex].attributeName=attributeName;
		this.setState({
			...this.state,
			updateMLVs : {
				...this.state.updateMLVs,
				updateMLVArray : updateMLVArray
			}
		})

	}
	setValueForSelectedAttributeForUpdate(index,attributeIndex,value){
		var updateMLVArray = this.state.updateMLVs.updateMLVArray;
		updateMLVArray[index].values[attributeIndex].value=value;
		this.setState({
			...this.state,
			updateMLVs : {
				...this.state.updateMLVs,
				updateMLVArray : updateMLVArray
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
								/>
							</TabStripTab>
							<TabStripTab title="Delete">

							</TabStripTab>
							<TabStripTab title="Delete All">

							</TabStripTab>
						</TabStrip>
					</div>
				</div>
			</div>
		)
	}
}