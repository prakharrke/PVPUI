import React, { Component } from 'react';
import axios from 'axios';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
export default class CreateBaseline extends Component {

	constructor(props) {
		super(props);
		this.state = {
			testCaseSummary: '',
			testCaseDescription: '',
			runFlag: '',
			mlv: '',
			testFilter: '',
			resultSheet: '',
			viewOnview: '',
			mlvQualification: '',
			resultSetList: [],
			columnNames: []
		}
	}

	// * METHOD TO ADD TEST CASE SUMMARY
	addTestCaseSummary(event) {
		this.setState({
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
			mlv: event.target.value
		})
	}
	// * METHOD TO ADD TEST CASE FILTER
	addTestCaseFilter(event) {

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
		axios.post('http://localhost:9090/PVPUI/ExecuteMLV', `MLV=${JSON.stringify({ mlv: this.state.mlv, filter: '' })}`, {
			headers: {
			}


		}).then(response => {

			this.computeResultSet(response.data)
		})

	}

	// * METHOD TO COMPUTE RESULT SET FROM SERVER
	computeResultSet(response) {
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
		this.setState({
			...this.state,
			resultSetList: resultsetList,

		})
	}

	render() {

		var columnsElement = this.state.columnNames.map((column) => {
			console.log('!!!!!!!!')
			console.log(column)
			return (

				<Column
					field={column}
					title={column}
				/>


			)
		})

		return (

			<div className="container-fluid" style={{ marginTop: "2em" }}>
				<div className="row">
					<div className="col-lg-12">
						<Input

							label="Test Case Summary"
							value={this.state.testCaseSummary}
							style={{ width: "100%", textAlign: "center", margin: "1em" }}
							onChange={this.addTestCaseSummary.bind(this)}

						/>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<Input

							label="Test Case Description"
							value={this.state.testCaseDescription}
							style={{ width: "100%", textAlign: "center", margin: "1em" }}
							onChange={this.addTestCaseDescription.bind(this)}

						/>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<Input

							label="Test Case Filter"
							value={this.state.testFilter}
							style={{ width: "100%", textAlign: "center", margin: "1em" }}
							onChange={this.addTestCaseFilter.bind(this)}

						/>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<Input

							label="Result Sheet Name"
							value={this.state.resultSheet}
							style={{ width: "100%", textAlign: "center", margin: "1em" }}
							onChange={this.addResultSheet.bind(this)}

						/>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<Input

							label="View on View"
							value={this.state.viewOnview}
							style={{ width: "100%", textAlign: "center", margin: "1em" }}
							onChange={this.addViewOnView.bind(this)}

						/>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<Input

							label="MLV Qualification"
							value={this.state.mlvQualification}
							style={{ width: "100%", textAlign: "center", margin: "1em" }}
							onChange={this.addMlvQualification.bind(this)}

						/>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<Input

							label="MLV"
							value={this.state.mlv}
							style={{ width: "100%", textAlign: "center", margin: "1em", height: "10em" }}
							onChange={this.addMLV.bind(this)}

						/>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-2">
						<Button
							style={{ textAlign: "center", margin: "1em" }}
							onClick={this.executeMLV.bind(this)}
						>
							Execute MLV
						</Button>
					</div>
				</div>

				<div>

					{
						this.state.resultSetList.length > 0 &&
						<Grid
						style={{height : "40em"}}
						data={this.state.resultSetList}
						>
							{
								columnsElement
							}
						</Grid>}

				</div>
			</div>

		)
	}
}