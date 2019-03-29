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
import Rotate from '@material-ui/icons/RotateRight';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import * as Constants from '../Constants'
import { Notification, Tooltip } from '@progress/kendo-popups-react-wrapper';
import $ from 'jquery';
import '@progress/kendo-ui';
export default class Connections extends Component {

	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	addConnection(event) {
		event.preventDefault();
		this.props.addConnection();

	}
	testConnection(event) {
		event.preventDefault()
		var index = event.target.id;
		this.props.testConnection(index)
	}

	createModel(event) {
		
		event.preventDefault()
	
		var index = event.target.id;
		
		this.props.createModel(index)


	}

	reloadModel(event){
		event.preventDefault();
		var index = event.target.id;
		
		this.props.reloadModel(index)
	}
	setConnectionName(event) {
		
		var connections = new Array();
		this.props.setConnectionName(event.target.props.id, event.target.value)

	}

	setConnectionID(event) {
		var connections = new Array();
		this.props.setConnectionID(event.target.props.id, event.target.value)
	}

	deleteConnection(event) {
		event.preventDefault()
		var index = event.target.id
		if(index === 0){
			alert('Atleast one connection is required.')
			return 
		}
		this.props.deleteConnection(index)
	}

	render() {
	
		return (
			<div className="row justify-content-center">
			<div className="col-lg-11">
				<div className="row">
					<div className="col-lg-1">
					<Tooltip content="Add New Connection">
						<Button
							primary={true}

							style={{ marginTop: '1em' }}
							onClick={this.addConnection.bind(this)}
						>
							<span  className="k-icon  k-i-plus-outline"></span>
						</Button>
						</Tooltip>
					</div>

				</div>
				{
					this.props.connections.map((connection, index) => {
						console.log('!!!!')
						console.log(index)
						return (
							<div className="row justify-content-center d-flex align-items-baseline" style={{ width: '100%' }}>
								<div className="col-lg-4 d-flex align-items-baseline">
									<DropDownList
										data={this.props.pluginList}
										style={{ width: '100%', margin : '1em' }}
										label="Connection Name"
										disabled={connection.connectionCreated}
										id={index}
										value={connection.connectionName}
										onChange={this.setConnectionName.bind(this)}
									/>
								</div>
								<div className="col-lg-2 d-flex align-items-baseline">
									<Input
										id={index}
										style={{ width: '100%', margin: '1em' }}
										label="ID"
										disabled={connection.connectionCreated}
										value={connection.connectionID}
										onChange={this.setConnectionID.bind(this)}
									/>
								</div>
								<div className="col-lg-4 d-flex align-items-baseline">
								<Tooltip content="Delete Connection">
									<Button
										className="float-right"
										primary={true}

										id={index}
										style={{ margin: '1em' }}
										onClick={this.deleteConnection.bind(this)}
									>
										<span id={index} className="k-icon k-i-delete k-i-trash"></span>
									</Button>
									</Tooltip>
									<Tooltip content="Create Model">
									<Button
										className="float-right"
										primary={true}
										id={index}
										style={{ margin: '1em' }}
										onClick={this.createModel.bind(this)}
									>
										<span id={index} className="k-icon k-i-pencil"></span>
									</Button>
									</Tooltip>
									<Tooltip content="Refresh Model">
									<Button
										className="float-right"
										primary={true}
										id={index}
										style={{ margin: '1em' }}
										onClick={this.reloadModel.bind(this)}
									>
										<span id={index} className=" k-icon k-i-reload k-i-refresh"></span>
									</Button>
									</Tooltip>
									<Tooltip content="Test Connection">
									<Button
										className="float-right"
										primary={true}
										id={index}
										style={{ margin: '1em' }}
										onClick={this.testConnection.bind(this)}
									>
										<span id={index} className=" k-icon k-i-star k-i-bookmark "></span>
									</Button>
									</Tooltip>
								</div>
								<div className='col-lg-1 d-flex align-items-baseline'>
								<Tooltip content={connection.connectionCreated ? "Model Created" : "Model Not Created"}>
									{
										connection.connectionCreated ? (
											
											<Done className="float-right" style={{marginTop: '1em'}}/>
											
										) : (
										
										<Block className="float-right" style={{marginTop: '1em'}}/>
										
										)

									}
									</Tooltip>
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