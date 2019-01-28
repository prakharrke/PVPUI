import React, { Component } from 'react';
import axios from 'axios';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import Clear from '@material-ui/icons/Clear';
import Done from '@material-ui/icons/Done';
import * as Constants from '../Constants'
export default class Connections extends Component {

	constructor(props) {
		super(props);
		this.state = {
			connections: []
		}
	}

	addConnection(event) {
		event.preventDefault();
		this.props.addConnection();

	}
	testConnection(event) {

		var index = event.target.getAttribute('index');
		this.props.testConnection(index)
	}

	createModel(event) {


		var index = event.target.getAttribute('index');
		this.props.createModel(index)


	}
	setConnectionName(event) {

		var connections = new Array();
		this.props.setConnectionName(event.target.props.index, event.target.value)

	}

	setConnectionID(event) {
		var connections = new Array();
		this.props.setConnectionID(event.target.props.index, event.target.value)
	}

	deleteConnection(event) {

		var index = event.target.getAttribute('index')
		this.props.deleteConnection(index)
	}

	render() {
		console.log(this.state)
		return (
			<div>
				<div className="row justify-content-center">
					<div className="col-lg-2">
						<Button
							primary={true}
							style={{ margin: '1em' }}
							onClick={this.addConnection.bind(this)}
						>
							New
						</Button>
					</div>

				</div>
				{
					this.props.connections.map((connection, index) => {

						return (
							<div className="row justify-content-center" style={{ width: '100%' }}>
								<div className="col-lg-5">
									<DropDownList
										data={this.props.pluginList}
										style={{ width: '100%', margin: '1em' }}
										label="Connection Name"
										index={index}
										value={connection.connectionName}
										onChange={this.setConnectionName.bind(this)}
									/>
								</div>
								<div className="col-lg-1">
									<Input
										index={index}
										style={{ width: '100%', margin: '1em' }}
										label="ID"
										value={connection.connectionID}
										onChange={this.setConnectionID.bind(this)}
									/>
								</div>
								<div className="col-lg-4">
									<Button
										className="float-right"
										primary={true}
										index={index}
										style={{ margin: '1em' }}
										onClick={this.deleteConnection.bind(this)}
									>
										Delete
									</Button>
									<Button
										className="float-right"
										primary={true}
										index={index}
										style={{ margin: '1em' }}
										onClick={this.createModel.bind(this)}
									>
										Create Model
									</Button>
									<Button
										className="float-right"
										primary={true}
										index={index}
										style={{ margin: '1em' }}
										onClick={this.testConnection.bind(this)}
									>
										Test
									</Button>
								</div>
								<div className='col-lg-2'>
									{
										connection.connectionCreated ? (

											<Done />

										) : (<Clear />)

									}
								</div>
							</div>

						)
					})
				}
			</div>
		)
	}
}