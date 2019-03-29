import React, { Component } from 'react';
import axios from 'axios';
import * as Constants from '../Constants'
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';

export default class ModelComparator extends Component {

	constructor(props) {
		super(props)
		this.state = {

			selectedConnection: {},
			modelBaselines: new Array(),
			modelBaseline: {},
			selectedConnectionForComparasion: {}
		}
	}

	componentWillMount() {
		axios.post(Constants.url + 'GetExistingModels', `reportDetails=`, {
			headers: {
			}


		}).then(response => {

			var modelBaselines = new Array();
			console.log(response.data)
			response.data.map(model => {

				var date = new Date(model.timeStamp);

				modelBaselines.push({
					pluginNameWithDate: `${model.pluginName} - ${date}`,
					pluginName: model.pluginName,
					timeStamp: model.timeStamp
				})
			})

			this.setState({
				...this.state,
				modelBaselines: modelBaselines
			})

		}).catch(e => {
			alert(e.message)
		})
	}
	selectConnectionForModelBaselineCreation(event) {
		this.setState({
			selectedConnection: event.target.value
		})
	}

	createModelBaseline(event) {
		event.preventDefault();
		axios.post(Constants.url + 'CreateModelBaseline', `connectionDetails=${JSON.stringify({ connectionID: this.state.selectedConnection.connectionID, baselineName : this.state.newBaselineName })}`, {
			headers: {
			}


		}).then(response => {

		}).catch(e => {
			alert(e.message)
		})

	}
	setConnectionForModelComparasion(event) {
		this.setState({
			...this.state,
			selectedConnectionForComparasion: event.target.value
		})
	}

	setModelBaseline(event) {
		this.setState({
			...this.state,
			modelBaseline: event.target.value
		})
	}

	compareModel(event) {
		event.preventDefault();

		axios.post(Constants.url + 'CompareModelBaseline', `details=${JSON.stringify({ connectionID: this.state.selectedConnectionForComparasion.connectionID, pluginName: this.state.modelBaseline.pluginName, timeStamp: this.state.modelBaseline.timeStamp })}`, {
			headers: {
			}


		})

	}

	addNewBaselineName(event){

		this.setState({
			...this.state,
			newBaselineName : event.target.value
		})
	}

	render() {

		console.log(this.state)

		return (

			<div className="container-fluid" style={{ marginTop: "2em", marginBottom: '5em' }}>

				<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>
					<PanelBar >
						<PanelBarItem title={<i style={{ fontSize: "16px" }}>Create Model Baseline</i>}>

							<div className="row justify-content-center" style={{ margin: '2em' }}>
								<div className="col-lg-4">
									<Input

										label="Enter Baseline Name"
										value={this.state.newBaselineName}
										style={{ width: "100%", textAlign: "center", marginBottom: "1em" }}
										onChange={this.addNewBaselineName.bind(this)}

									/>
								</div>
								<div className="col-lg-4">
									<DropDownList

										data={this.props.connections}
										onChange={this.selectConnectionForModelBaselineCreation.bind(this)}
										style={{ width: '100%' }}
										label='Select Connection'
										textField='connectionName'
										dataItemKey='connectionID'
									//value={this.state.baseConnection}

									/>
								</div>
								<div className="col-lg-2">
									<Button primary={true} onClick={this.createModelBaseline.bind(this)}>Create Model Baseline</Button>
								</div>
							</div>

						</PanelBarItem>
						<PanelBarItem title={<i style={{ fontSize: "16px" }}>Compare Model Baseline</i>}>

							<div className="row justify-content-center" style={{ margin: '2em' }}>
								<div className="col-lg-4">
									<DropDownList

										data={this.props.connections}
										onChange={this.setConnectionForModelComparasion.bind(this)}
										style={{ width: '100%' }}
										label='Select Connection for Comparasion'
										textField={'connectionName'}
										dataItemKey='connectionID'
									//value={this.state.baseConnection}

									/>
								</div>
								<div className="col-lg-4">
									<DropDownList

										data={this.state.modelBaselines}
										onChange={this.setModelBaseline.bind(this)}
										style={{ width: '100%' }}
										label='Select Model Basline'
										textField={'pluginNameWithDate'}
										dataItemKey='timeStamp'
									//value={this.state.baseConnection}

									/>
								</div>
								<div className="col-lg-2">
									<Button primary={true} onClick={this.compareModel.bind(this)}>Compare Model Baseline</Button>
								</div>
							</div>
						</PanelBarItem>
					</PanelBar>
				</div>

			</div>

		)
	}

}