import React, { Component } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import InsertDetails from './Components/InsertDetails'
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
			fetchFromAnotherSourceMLV: '',
			insertMLVs: {
				currentIndex: 0,
				insertMLVArray: []
			},
			fetchMLVForinsert :{
				mlv : '',
				filter : ''
			}


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

	parseMLVLevelWise(mlv){
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
					insertMLVArray[this.state.insertMLVs.currentIndex].attributes = temp;
					var attributeValues = new Array(temp.length)
					var attributeCollectiveValues = new Array();
					attributeCollectiveValues.push(attributeValues.fill(''))
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

	addAttributeInsertValue(index, attributeIndex, groupIndex, value){

		var insertMLVArray = this.state.insertMLVs.insertMLVArray;
		insertMLVArray[index].values[groupIndex][attributeIndex]=value;
		this.setState({
			...this.state,
			insertMLVs: {
				...this.state.insertMLVs,
				insertMLVArray: insertMLVArray
			}
		})
	}
	addAttributeInsertValueGroup(index){
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

	// * GENERATE FETCH MLV FOR INSERT
	generateFetchMLVForInsert(){
		this.setState({
			...this.state,
			mountMLVGenerator: true,
			operation : 'fetchMLVForInsert'
		})
	}
	saveFetchMLVForInsert(mlv){

		this.setState({
			...this.state,
			fetchMLVForinsert : {
				...this.state.fetchMLVForinsert,
				mlv : mlv
			},
			mountMLVGenerator: false
		})
	}
	setFilterForFetchMLVForInsert(filter){

		this.setState({
			...this.state,
			fetchMLVForinsert : {
				...this.state.fetchMLVForinsert,
				filter : filter
			}
		})
	}


	render() {
		console.log(this.state)
		var mlvGenerator = this.state.mountMLVGenerator ? (
			<MLVGenerator connInfoList={this.props.connInfoList}
				oldState={{}}
				parent={this.state.operation}
				saveMLVForFetchFromAnotherSource={this.saveMLVForFetchFromAnotherSource.bind(this)}
				saveInsertMLV={this.saveInsertMLV.bind(this)}
				saveFetchMLVForInsert={this.saveFetchMLVForInsert.bind(this)}

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
									saveFetchMLVForInsert={this.saveFetchMLVForInsert.bind(this)}
									setFilterForFetchMLVForInsert={this.setFilterForFetchMLVForInsert.bind(this)}
									generateFetchMLVForInsert={this.generateFetchMLVForInsert.bind(this)}
									fetchMLVForinsert={this.state.fetchMLVForinsert}
								/>
							</TabStripTab>
							<TabStripTab title="Update">

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