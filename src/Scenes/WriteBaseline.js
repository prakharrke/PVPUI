import React, { Component } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import InsertDetails from './Components/InsertDetails'
export default class WriteBaseline extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: 0,
			testCaseSummary: '',
			testCaseDescription: ''
		}
	}
	handleSelect(event) {
		this.setState({
			selected: event.selected
		})
	}
	setTestCaseSummary(event){
		this.setState({
			testCaseSummary : event.target.value
		})
	}
	setTestCaseDescription(event){
		this.setState({
			testCaseDescription : event.target.value
		})
	}
	render() {

		return (

			<div className="container-fluid" style={{ marginTop: "2em" }}>
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
					<InsertDetails />
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