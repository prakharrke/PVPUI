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
		if (this.props.fetchFromAnotherSourceForUpdateFlag && this.props.updateMLVArray.length === 1) {
			alert('Only one update MLV is allowed with fetch from another source')
			return
		}
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
	setSelectedAttributeForUpdate(event) {
		this.props.setSelectedAttribute(event.target.props.id, event.target.props.attributeIndex, event.target.value)
	}
	setValueForSelectedAttributeForUpdate(event) {
		this.props.setValueForSelectedAttributeForUpdate(event.target.props.id, event.target.props.attributeIndex, event.target.value)
	}
	deleteSelectedAttributeForUpdate(event) {
		event.preventDefault();
		this.props.deleteSelectedAttributeForUpdate(event.target.id, event.target.attributeIndex)

	}
	setIDForUpdate(event) {
		this.props.setIDForUpdate(event.target.props.id, event.target.value)
	}
	setPIDForUpdate(event) {
		this.props.setPIDForUpdate(event.target.props.id, event.target.value)
	}
	setLEVForUpdate(event) {
		this.props.setLEVForUpdate(event.target.props.id, event.target.value)
	}
	setPINForUpdate(event) {
		this.props.setPINForUpdate(event.target.props.id, event.target.value)
	}
	addFilterForUpdate(event) {

		this.props.addFilterForUpdate(event.target.id, event.target.value)
	}
	editFilterForUpdate(event) {
		this.props.editFilterForUpdate(event.target.props.id, event.target.value)
	}
	generateFetchMLVForUpdate(event){
		event.preventDefault();
		this.props.generateFetchMLVForUpdate('fetchMLVForUpdate')
	}
	saveFetchMLVForUpdate(event){
		this.props.saveFetchMLVForUpdate(event.target.value)
	}
	addFilterForFetchMLVForUpdate(event){
		this.props.addFilterForFetchMLVForUpdate(event.target.value)
	}
	editFilterForFetchMLVForUpdate(event){
		this.props.editFilterForFetchMLVForUpdate(event.target.value)
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
					<div className="row justify-content-center">
						<div className='col-lg-3'>
							<DropDownList
								data={object.attributes}
								label="ID"
								id={object.index}
								style={{ width: '100%', margin: '1em' }}
								onChange={this.setIDForUpdate.bind(this)}
								value={object.ID}
							/>
						</div>
						<div className='col-lg-3'>
							<DropDownList
								data={object.attributes}
								label="PID"
								id={object.index}
								style={{ width: '100%', margin: '1em' }}
								onChange={this.setPIDForUpdate.bind(this)}
								value={object.PID}
							/>
						</div>
						<div className='col-lg-3'>
							<Input
								data={object.attributes}
								label="LEV"
								id={object.index}
								style={{ width: '100%', margin: '2em' }}
								onChange={this.setLEVForUpdate.bind(this)}
								value={object.LEV}
							/>
						</div>
						<div className='col-lg-3'>
							<DropDownList
								data={object.attributes}
								label="PIN"
								id={object.index}
								attributeIndex={index}
								style={{ width: '100%', margin: '1em' }}
								onChange={this.setPINForUpdate.bind(this)}
								value={object.PIN}
							/>
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
														<div className="col-lg-5">
															<DropDownList
																data={object.attributes}
																label="Column Name"
																id={object.index}
																attributeIndex={index}
																style={{ width: '100%', margin: '1em' }}
																onChange={this.setSelectedAttributeForUpdate.bind(this)}
																value={valueObject.attributeName}
															/>
														</div>
														<div className="col-lg-5">

															<Input
																data={object.attributes}
																label="Value"
																id={object.index}
																attributeIndex={index}
																style={{ width: '100%', margin: '2em' }}
																onChange={this.setValueForSelectedAttributeForUpdate.bind(this)}
																value={valueObject.value}
															/>
														</div>
														<div className='col-lg-1'>
															<Button
																primary={true}
																id={object.index}
																attributeIndex={index}
																onClick={this.deleteSelectedAttributeForUpdate.bind(this)}
															>Delete
															</Button>
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
					<div className="row justify-content-center">
						<div className="col-lg-10" tabIndex="0">
							<Input

								placeholder="Filter"
								style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
								onChange={this.editFilterForUpdate.bind(this)}
								value={object.filter}
								id={object.index}
							/>
						</div>
					</div>
					<div className="row">

						<div className="col-lg-5">
							<select
								multiple
								className="form-control"
								size={10}
								style={{ overflowX: "scroll" }}
							>
								{object.attributes.map((attributeName) => {
									return (
										<option
											value={attributeName}
											id={object.index}
											onDoubleClick={this.addFilterForUpdate.bind(this)}
										>{attributeName}</option>

									)
								})}
							</select>
						</div>
						<div className="col-lg-2">
							<select
								multiple
								className="form-control"
								size={10}
								style={{ overflowX: "scroll" }}
							>
								{
									Constants.Constants.MLVOperators.map((operator) => {

										return (

											<option
												id={object.index}
												onDoubleClick={this.addFilterForUpdate.bind(this)}
												value={operator}>{operator}</option>
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

								style={{ overflowX: "scroll" }}
							>
								{
									Constants.Constants.MLVWhereClauseFunctions.map((func) => {

										return (

											<option
												value={func}
												id={object.index}
												onDoubleClick={this.addFilterForUpdate.bind(this)}
											>{func}</option>
										)
									})
								}
							</select>

						</div>
					</div>

				</PanelBarItem>
			)
		})

		return (

			<div className="row justify-content-center" style={{ marginTop: "1em", width: "100%" }}>
				<div className="col-lg-12">
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
						<PanelBarItem title={<i style={{ fontSize: "16px" }}>Fetch MLV</i>}>

							<div className="row justify-content-center">
								<div className="col-lg-1" style={{ margin: '1em' }}>
									<Button
										primary={true}
										onClick={this.generateFetchMLVForUpdate.bind(this)}
									>Generate
										</Button>
								</div>
								<div className="col-lg-9" style={{ margin: '1em' }}>
									<textarea
										placeholder="MLV*"
										class="form-control rounded-0"
										rows="5"
										value={this.props.fetchMLVForUpdate.mlv}
										onChange={this.saveFetchMLVForUpdate.bind(this)}
									>

									</textarea>
								</div>
							</div>
								<div className="row justify-content-center">
									<div className="col-lg-10" tabIndex="0">
										<Input

											placeholder="Filter"
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.editFilterForFetchMLVForUpdate.bind(this)}
											value={this.props.fetchMLVForUpdate.filter}
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
											onDoubleClick={this.addFilterForFetchMLVForUpdate.bind(this)}
										>
											{this.props.fetchMLVForUpdate.attributes.map((attributeName) => {
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
											onDoubleClick={this.addFilterForFetchMLVForUpdate.bind(this)}
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
											onDoubleClick={this.addFilterForFetchMLVForUpdate.bind(this)}
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

						</PanelBarItem>
					</PanelBar>
				</div>
				</div>
			</div>
		)
	}

}