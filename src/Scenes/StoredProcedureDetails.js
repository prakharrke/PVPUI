import React, { Component } from 'react';
import * as Constants from '../Constants'
import { Button, DropDownButton } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import MLVGenerator from './MLVGenerator';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import axios from 'axios';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';


export default class StoredProcedureDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			storedProcedureList: []
		}
	}

	getStoredProcedures(event) {
		axios.post(Constants.url + 'GetStoredProcedureList', `connectionDetails=${JSON.stringify({ connectionID: event.target.value.connectionID })}`, {
			headers: {
			}


		}).then(response => {
			this.setState({
				storedProcedureList: response.data
			})
		})
	}


	render() {

		return (

			<div className="container-fluid" style={{ marginTop: "2em" }}>
				<div className="row justify-content-center">
					<div className="col-lg-4">
						<DropDownList
							data={this.props.connections}
							label="Choose Plugin"
							textField="connectionName"
							dataItemKey="connectionID"
							style={{ width: '100%', margin: '1em' }}
							onChange={this.getStoredProcedures.bind(this)}
						//value={activity.activityType}
						/>
					</div>
				</div>

				<div>
					{
						this.state.storedProcedureList.length > 0 &&
						<Grid
							style={{ height: "40em" }}
							data={this.state.storedProcedureList}
							resizable={true}
							scrollable="scrollable"
						>
							<Column
								field={"procedureName"}
								title={"Procedure Name"}
								minResizableWidth={'250'}
								width={'250px'}
							/>
							<Column
								field={"procedureSignature"}
								title={"Pocedure Signature"}
								minResizableWidth={'250'}
								width={'600px'}
							/>
						</Grid>
					}
				</div>
			</div>
		)
	}
}