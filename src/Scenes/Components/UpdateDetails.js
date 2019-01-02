import React, { Component } from 'react';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import * as Constants from '../../Constants.js';

export default class UpdateDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {

		}
	}
	toggleFetchFromAnotherSourceForUpdate(event) {
		event.preventDefault();
		this.props.toggleFetchFromAnotherSourceForUpdate()
	}
	generateMLVFetchFromAnotherSourceForUpdate(event) {
		event.preventDefault();
		this.props.generateMLVFetchFromAnotherSourceForUpdate('fetchFromAnotherSourceForUpdate')
	}
	setFetchFromSourceMLVForUpdate(event) {
		this.props.saveMLVForFetchFromAnotherSourceForUpdate(event.target.value)
	}

	addFilterForFetchFromAnotherSourceForUpdate(event) {
		//console.log(event.target.value)
		this.props.addFilterForFetchFromAnotherSourceForUpdate(event.target.value)
	}
	editFilterForFetchFromAnotherSourceForUpdate(event) {
		this.props.editFilterForFetchFromAnotherSourceForUpdate(event.target.value)
	}
	addUpdateMLV(event) {
		event.preventDefault();
		this.props.addUpdateMLV();
	}
	generateUpdateMLV(event) {
		this.props.generateUpdateMLV(event.target.id)
	}
	setUpdateMLV(event) {
		this.props.saveUpdateMLV(event.target.value, event.target.id)

	}
	deleteUpdateMLV(event) {
		event.preventDefault();
		this.props.deleteUpdateMLV(event.target.id)
	}
	addUpdateValuePair(event) {
		event.preventDefault();
		this.props.addUpdateValuePair(event.target.id)
	}

	render() {
		var updateMLVArrayElement = this.props.updateMLVArray.map((object, index) => {
			return (
				<PanelBarItem title={<i style={{ fontSize: "12px" }}>{'Update MLV ' + (index + 1)}</i>}>
					<div className="row justify-content-center">
						<div className="col-lg-1" style={{ margin: '1em' }}>
							<Button
								primary={true}
								id={object.index}
								onClick={this.generateUpdateMLV.bind(this)}
							>Generate
								</Button>
						</div>
						<div className="col-lg-9" style={{ margin: '1em' }}>
							<textarea
								placeholder="MLV*"
								class="form-control rounded-0"
								rows="5"
								id={object.index}
								value={object.mlv}
								onChange={this.setUpdateMLV.bind(this)}
							>

							</textarea>
						</div>
						<div className="col-lg-1" style={{ margin: '1em' }}>
							<Button
								primary={true}
								id={object.index}
								onClick={this.deleteUpdateMLV.bind(this)}
							>Delete
						</Button>
						</div>
					</div>
					<div className="row justify-content-center" style={{ width: "100%" }}>
						<div className="col-lg-10 justify-content-center panel-wrapper" style={{ maxWidth: "90%", margin: "0 auto" }}>

							<PanelBar >
								<PanelBarItem title={<i style={{ fontSize: "12px" }}>{'Update Values'}</i>}>
									<div>
									<div className="row justify-content-center">
										<div className="col-lg-1" style={{ margin: '1em' }}>
											<Button
												primary={true}
												id={object.index}
												onClick={this.addUpdateValuePair.bind(this)}
											>Add
											</Button>
										</div>
									</div>
									{
										
										object.values.map((valueObject, index) => {

											return (

												<div className="row justify-content-center">
													<div className="col-lg-6">
														<DropDownList
															data={object.attributes}
															label="Column Name"
															id={object.index}
															style={{ width: '100%', margin: '1em' }}
														//onChange={this.setInsertID.bind(this)}
														value={valueObject.attributeName}
														/>
													</div>
													<div className="col-lg-6">

														<Input
															data={object.attributes}
															label="Value"
															id={object.index}
															style={{ width: '100%', margin: '2em' }}
															//onChange={this.setInsertLEV.bind(this)}
															value={valueObject.value}
														/>
													</div>
												</div>

											)
										})
									}
									</div>

								</PanelBarItem>
							</PanelBar>
						</div>
					</div>

				</PanelBarItem>
			)
		})

		return (

			<div row="justify-content-center" style={{ marginTop: "1em", width: "100%" }}>
				<div className="row justify-content-center">
					<div className="col-lg-4">
						<Button
							style={{ margin: "1em" }}
							onClick={this.toggleFetchFromAnotherSourceForUpdate.bind(this)}
						>
							Fetch from another source
						</Button>
						<Switch
							style={{ margin: "1em" }}
							checked={this.props.fetchFromAnotherSourceForUpdateFlag}
						/>
					</div>

				</div>
				<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

					<PanelBar >

						{this.props.fetchFromAnotherSourceForUpdateFlag ?
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Fetch From Another Source (For Bulk Update)</i>}>

								<div className="row justify-content-center">
									<div className="col-lg-1" style={{ margin: '1em' }}>
										<Button
											primary={true}
											onClick={this.generateMLVFetchFromAnotherSourceForUpdate.bind(this)}
										>Generate
										</Button>
									</div>
									<div className="col-lg-9" style={{ margin: '1em' }}>
										<textarea
											placeholder="MLV*"
											class="form-control rounded-0"
											rows="5"
											value={this.props.fetchFromAnotherSourceForUpdate.mlv}
											onChange={this.setFetchFromSourceMLVForUpdate.bind(this)}
										>

										</textarea>
									</div>
								</div>
								<div className="row justify-content-center">
									<div className="col-lg-10" tabIndex="0">
										<Input

											placeholder="Filter"
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.editFilterForFetchFromAnotherSourceForUpdate.bind(this)}
											value={this.props.fetchFromAnotherSourceForUpdate.filter}
										/>
									</div>
								</div>
								<div className="row">

									<div className="col-lg-5">
										<select
											multiple
											className="form-control"
											size={10}
											id="totalAttributes"
											style={{ overflowX: "scroll" }}
											onDoubleClick={this.addFilterForFetchFromAnotherSourceForUpdate.bind(this)}
										>
											{this.props.fetchFromAnotherSourceForUpdate.attributes.map((attributeName) => {
												return (
													<option value={attributeName}>{attributeName}</option>

												)
											})}
										</select>
									</div>
									<div className="col-lg-2">
										<select
											multiple
											className="form-control"
											size={10}
											id="totalAttributes"
											style={{ overflowX: "scroll" }}
											onDoubleClick={this.addFilterForFetchFromAnotherSourceForUpdate.bind(this)}
										>
											{
												Constants.Constants.MLVOperators.map((operator) => {

													return (

														<option value={operator}>{operator}</option>
													)
												})
											}
										</select>
									</div>
									<div className="col-lg-5">
										<select
											multiple
											className="form-control"
											size={10}
											onDoubleClick={this.addFilterForFetchFromAnotherSourceForUpdate.bind(this)}
											id="totalAttributes"
											style={{ overflowX: "scroll" }}
										>
											{
												Constants.Constants.MLVWhereClauseFunctions.map((func) => {

													return (

														<option value={func}>{func}</option>
													)
												})
											}
										</select>

									</div>
								</div>


							</PanelBarItem> : ''}
						<PanelBarItem title={<i style={{ fontSize: "16px" }}>Update MLV</i>}>

							<div className="row justify-content-center">
								<div className="col-lg-1" style={{ margin: '1em' }}>
									<Button
										primary={true}
										onClick={this.addUpdateMLV.bind(this)}
									>Add
										</Button>
								</div>
							</div>
							<div className="row justify-content-center" style={{ width: "100%" }}>
								<div className="col-lg-10 justify-content-center panel-wrapper" style={{ maxWidth: "90%", margin: "0 auto" }}>

									<PanelBar >
										{updateMLVArrayElement}
									</PanelBar>
								</div>
							</div>
						</PanelBarItem>
					</PanelBar>
				</div>
			</div>
		)
	}

}