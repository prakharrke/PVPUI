import React, { Component } from 'react';
import axios from 'axios';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import Delete from '@material-ui/icons/Delete';
import Create from '@material-ui/icons/Create';
import Block from '@material-ui/icons/Block';
import Star from '@material-ui/icons/Star';
import Done from '@material-ui/icons/Done';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
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
		if(index === 0){
			alert('Atleast one connection is required.')
			return 
		}
		this.props.deleteConnection(index)
	}

	render() {
	
		return (
			<div className="row justify-content-center">
			<div className="col-lg-6">
				<div className="row">
					<div className="col-lg-2">
						<Button
							
							style={{ margin: '1em' }}
							onClick={this.addConnection.bind(this)}
						>
							<AddCircleOutline />
						</Button>
					</div>

				</div>
				{
					this.props.connections.map((connection, index) => {

						return (
							<div className="row justify-content-center d-flex align-items-baseline" style={{ width: '100%' }}>
								<div className="col-lg-4 d-flex align-items-baseline">
									<DropDownList
										data={this.props.pluginList}
										style={{ width: '100%', margin : '1em' }}
										label="Connection Name"
										index={index}
										value={connection.connectionName}
										onChange={this.setConnectionName.bind(this)}
									/>
								</div>
								<div className="col-lg-2 d-flex align-items-baseline">
									<Input
										index={index}
										style={{ width: '100%', margin: '1em' }}
										label="ID"
										value={connection.connectionID}
										onChange={this.setConnectionID.bind(this)}
									/>
								</div>
								<div className="col-lg-4 d-flex align-items-baseline">
									<Button
										className="float-right"
										
										index={index}
										style={{ margin: '1em' }}
										onClick={this.deleteConnection.bind(this)}
									>
										<Delete />
									</Button>
									<Button
										className="float-right"
										
										index={index}
										style={{ margin: '1em' }}
										onClick={this.createModel.bind(this)}
									>
										<Create />
									</Button>
									<Button
										className="float-right"
										
										index={index}
										style={{ margin: '1em' }}
										onClick={this.testConnection.bind(this)}
									>
										<Star />
									</Button>
								</div>
								<div className='col-lg-1 d-flex align-items-baseline'>
									{
										connection.connectionCreated ? (

											<Done className="float-right" style={{marginTop: '1em'}}/>

										) : (<Block className="float-right" style={{marginTop: '1em'}}/>)

									}
								</div>
							</div>

						)
					})
				}
				</div>
			</div>
		)
	}
}