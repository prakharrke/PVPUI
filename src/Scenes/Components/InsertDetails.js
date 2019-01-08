import React, { Component } from 'react';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import * as Constants from '../../Constants.js';
export default class InsertDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchFromAnotherSource: false,
			rawData: true,

		}
	}
	toggleFetchFromAnotherSource(event) {
		event.preventDefault();
		this.props.toggleFetchFromAnotherSource()
	}
	generateMLVFetchFromAnotherSource(event) {
		event.preventDefault();

		this.props.generateMLV('fetchFromAnotherSource');
	}
	setFetchFromSourceMLV(event) {
		this.props.saveMLVForFetchFromAnotherSource(event.target.value)
	}
	addFilterForFetchFromAnotherSourceForInsert(event) {
		//console.log(event.target.value)
		this.props.addFilterForFetchFromAnotherSourceForInsert(event.target.value)
	}
	editFilterForFetchFromAnotherSourceForInsert(event) {
		this.props.editFilterForFetchFromAnotherSourceForInsert(event.target.value)
	}
	addInsertMLV(event) {
		event.preventDefault();
		if (this.props.fetchFromAnotherSourceForInsertFlag && this.props.insertMLVArray.length === 1) {
			alert('Only one insert MLV is allowed with fetch from another source')
			return
		}
		this.props.addInsertMLV()


	}
	deleteInsertMLV(event) {
		event.preventDefault();
		this.props.deleteInsertMLV(event.target.id)
	}

	generateInsertMLV(event) {

		this.props.generateInsertMLV(event.target.id)
		this.setState({
			...this.state,
			[`attributeGroupIndex_${event.target.id}`]: 0
		})
	}


	setInsertID(event) {
		this.props.setInsertID(event.target.props.id, event.target.value)
	}


	setInsertPID(event) {
		this.props.setInsertPID(event.target.props.id, event.target.value)
	}


	setInsertLEV(event) {
		this.props.setInsertLEV(event.target.props.id, event.target.value)
	}

	setInsertMLV(event) {
		this.props.saveInsertMLV(event.target.value, event.target.id)
		this.setState({
			...this.state,
			[`attributeGroupIndex_${event.target.id}`]: 0
		})
	}
	toggleRawData(event) {
		event.preventDefault();
		this.setState({
			rawData: !this.state.rawData
		})
	}

	setInsertValues(event) {
		this.props.setInsertValues(event.target.id, event.target.value)
	}
	addAttributeInsertValue(event) {
		this.props.addAttributeInsertValue(event.target.props.id, event.target.props.attributeIndex, event.target.props.groupIndex, event.target.value)
	}
	addAttributeInsertValueGroup(event) {
		event.preventDefault();

		this.props.addAttributeInsertValueGroup(event.target.id)

	}
	deleteAttributeInsertValueGroup(event) {
		if (this.props.insertMLVArray[event.target.id].values.length === 1) {
			alert('At least one value set is required')
			return
		}

		this.props.deleteAttributeInsertValueGroup(event.target.id, `attributeGroupIndex_${event.target.id}`)

		if (this.props.insertMLVArray[event.target.id].values.length === this.state[`attributeGroupIndex_${event.target.id}`]) {
			this.setState({
				[`attributeGroupIndex_${event.target.id}`]: this.state[`attributeGroupIndex_${event.target.id}`] - 1
			})
		}

	}
	moveRightAttributeInsertValueGroup(event) {
		event.preventDefault();
		var attributeLength = this.props.insertMLVArray[event.target.id].values.length

		if (this.state[`attributeGroupIndex_${event.target.id}`] + 1 <= attributeLength - 1)
			this.setState({
				[`attributeGroupIndex_${event.target.id}`]: this.state[`attributeGroupIndex_${event.target.id}`] + 1
			})
	}
	moveLeftAttributeInsertValueGroup(event) {
		event.preventDefault();
		var attributeLength = this.props.insertMLVArray[event.target.id].values.length

		if (this.state[`attributeGroupIndex_${event.target.id}`] - 1 >= 0)
			this.setState({
				[`attributeGroupIndex_${event.target.id}`]: this.state[`attributeGroupIndex_${event.target.id}`] - 1
			})
	}

	// * GENERATE FETCH MLV FOR INSERT

	generateFetchMLVForInsert(event) {

		this.props.generateFetchMLVForInsert();

	}
	saveFetchMLVForInsert(event) {
		this.props.saveFetchMLVForInsert(event.target.value)
	}
	// * METHOD TO ADD TEST CASE FILTER
	addFilterForFetchMLVForInsert(event) {
		//console.log(event.target.value)
		this.props.addFilterForFetchMLVForInsert(event.target.value)
	}
	editFilterForFetchMLVForInsert(event) {
		this.props.editFilterForFetchMLVForInsert(event.target.value)
	}
	toggleRSInsert(event) {
		event.preventDefault();
		this.props.toggleRSInsert();
	}
	toggleBulkInsert(event) {
		event.preventDefault();
		this.props.toggleBulkInsert();

	}
	addAttributeValuePairForInsert(event) {
		event.preventDefault();
		this.props.addAttributeValuePairForInsert(event.target.id);
	}
	setSelectedAttributeForInsert(event) {

		this.props.setSelectedAttributeForInsert(event.target.props.id, event.target.props.attributeIndex, event.target.value)
	}

	setInsertPIN(event) {
		this.props.setInsertPIN(event.target.props.id, event.target.value)
	}


	render() {

		var insertMLVArrayElement = this.props.insertMLVArray.map((object, index) => {


			return (

				<PanelBarItem title={<i style={{ fontSize: "12px" }}>{'Insert MLV ' + (index + 1)}</i>}>

					<div className="row justify-content-center">
						<div className="col-lg-1" style={{ margin: '1em' }}>
							<Button
								primary={true}
								id={object.index}
								onClick={this.generateInsertMLV.bind(this)}
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
								onChange={this.setInsertMLV.bind(this)}
							>

							</textarea>
						</div>
						<div className="col-lg-1" style={{ margin: '1em' }}>
							<Button
								primary={true}
								id={object.index}
								onClick={this.deleteInsertMLV.bind(this)}
							>Delete
								</Button>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-lg-3">
							<DropDownList
								data={object.attributes}
								label="ID"
								id={object.index}
								style={{ width: '100%', margin: '1em' }}
								onChange={this.setInsertID.bind(this)}
								value={object.ID}
							/>

						</div>
						<div className="col-lg-3">
							<DropDownList
								data={object.attributes}
								label="PID"
								id={object.index}
								style={{ width: '100%', margin: '1em' }}
								onChange={this.setInsertPID.bind(this)}
								value={object.PID}
							/>
						</div>
						<div className="col-lg-3">
							<Input
								data={object.attributes}
								label="LEV"
								id={object.index}
								style={{ width: '100%', margin: '2em' }}
								onChange={this.setInsertLEV.bind(this)}
								value={object.LEV}
							/>
						</div>
						<div className="col-lg-3">
							<DropDownList
								data={object.attributes}
								label="PIN"
								id={object.index}
								style={{ width: '100%', margin: '1em' }}
								onChange={this.setInsertPIN.bind(this)}
								value={object.PIN}
							/>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-lg-2">
							<Button
								style={{ margin: "1em" }}
								onClick={this.toggleRawData.bind(this)}
							>
								Raw Data
						</Button>
							<Switch
								style={{ margin: "1em" }}
								checked={this.state.rawData}
							/>
						</div>

					</div>
					{this.state.rawData ?
						(

							<div className="row justify-content-center" style={{ width: "100%" }}>
								<div className="col-lg-10 justify-content-center panel-wrapper" style={{ maxWidth: "90%", margin: "0 auto" }}>

									<PanelBar >
										<PanelBarItem title={<i style={{ fontSize: "12px" }}>{'Update Values'}</i>}>
											<div className="row justify-content-center">
												<div className="col-lg-1">
													<Button
														primary={true}
														id={object.index}
														style={{ margin: '1em' }}
														onClick={this.addAttributeValuePairForInsert.bind(this)}
													>Add</Button>
												</div>
											</div>
											<div className="row justify-content-center">
												<div className="col-lg-1">
													<Button
														primary={true}
														id={object.index}
														style={{ margin: '1em' }}
														onClick={this.moveLeftAttributeInsertValueGroup.bind(this)}
													>{'<'}</Button>
												</div>
												<div className="col-lg-1">
													<Button
														primary={true}
														id={object.index}
														style={{ margin: '1em' }}
														onClick={this.addAttributeInsertValueGroup.bind(this)}
													>{'+'}</Button>
												</div>
												<div className="col-lg-1">
													<Button
														primary={true}
														id={object.index}
														style={{ margin: '1em' }}
														onClick={this.deleteAttributeInsertValueGroup.bind(this)}
													>{'X'}</Button>
												</div>
												<div className="col-lg-1">
													<Button
														primary={true}
														id={object.index}
														style={{ margin: '1em' }}
														onClick={this.moveRightAttributeInsertValueGroup.bind(this)}
													>{'>'}</Button>
												</div>
											</div>
											<div className="row justify-content-center">
												<div className="col-lg-1">
													{this.state[`attributeGroupIndex_${object.index}`] != undefined &&
														this.state[`attributeGroupIndex_${object.index}`] + 1 + ' of ' + object.values.length}
												</div>

											</div>


											{this.state[`attributeGroupIndex_${object.index}`] != undefined ?
												object.values[this.state[`attributeGroupIndex_${object.index}`]].map((valueObject, index) => {
													return (

														<div className="row justify-content-center">
															<div className="col-lg-6">
																<DropDownList
																	data={object.attributes}
																	label="Column Name"
																	groupIndex={this.state[`attributeGroupIndex_${object.index}`]}
																	id={object.index}
																	attributeIndex={index}
																	style={{ width: '100%', margin: '1em' }}
																	onChange={this.setSelectedAttributeForInsert.bind(this)}
																	value={valueObject.attributeName}
																/>
															</div>
															<div className="col-lg-6">

																{this.props.fetchFromAnotherSourceForInsertFlag ?
																	(
																		<DropDownList
																			data={this.props.fetchFromAnotherSourceForInsert.attributes}
																			label="Column Name"
																			groupIndex={this.state[`attributeGroupIndex_${object.index}`]}
																			id={object.index}
																			attributeIndex={index}
																			style={{ width: '100%', margin: '1em' }}
																			onChange={this.addAttributeInsertValue.bind(this)}
																			value={valueObject.value}
																		/>
																	)
																	:
																	(<Input

																		label="Value"
																		groupIndex={this.state[`attributeGroupIndex_${object.index}`]}
																		id={object.index}
																		attributeIndex={index}
																		style={{ width: '100%', margin: '2em' }}
																		onChange={this.addAttributeInsertValue.bind(this)}
																		value={valueObject.value}
																	/>)}
															</div>
														</div>

													)
												}) : ''
											}

											{/*<div className="col-lg-6">
																									{this.state[`attributeGroupIndex_${object.index}`] != undefined &&
																										object.values[this.state[`attributeGroupIndex_${object.index}`]].map((value, index) => {
																											return (
																												<Input
																													groupIndex={this.state[`attributeGroupIndex_${object.index}`]}
																													id={object.index}
																													attributeIndex={index}
																													label={object.attributes[index]}
																													style={{ width: '100%', margin: '1em' }}
																													value={value}
																													onChange={this.addAttributeInsertValue.bind(this)}
																												/>
																											)
																										})
																									}
																								</div>*/}

										</PanelBarItem>
									</PanelBar>
								</div>
							</div>


						)



						:
						(
							<div>
								<div className="row justify-content-center">
									<div className="col-lg-10" style={{ margin: "1em" }}>
										<textarea

											class="form-control rounded-0"
											rows="2"
											id={object.index}
											value={'(' + object.attributes + ')'}

										>

										</textarea>
									</div>
								</div>
								<div className="row justify-content-center">
									<div className="col-lg-10" style={{ margin: "1em" }}>
										<textarea
											placeholder="values*"
											class="form-control rounded-0"
											rows="2"
											id={object.index}
											value={object.values}

										>

										</textarea>
									</div>

								</div>
							</div>
						)
					}

				</PanelBarItem>

			)
		})
		return (
			<div row="justify-content-center" style={{ marginTop: "1em", width: "100%" }}>
				<div className="row justify-content-center">
					<div className="col-lg-4">
						<Button
							style={{ margin: "1em" }}
							onClick={this.toggleFetchFromAnotherSource.bind(this)}
						>
							Fetch from another source
						</Button>
						<Switch
							style={{ margin: "1em" }}
							checked={this.props.fetchFromAnotherSourceForInsertFlag}
						/>
					</div>

				</div>
				<div className="row" style={{ marginTop: "1em", width: "100%" }}>
					<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

						<PanelBar >

							{this.props.fetchFromAnotherSourceForInsertFlag ?
								<PanelBarItem title={<i style={{ fontSize: "16px" }}>Fetch From Another Source</i>}>

									<div className="row justify-content-center">
										<div className="col-lg-1" style={{ margin: '1em' }}>
											<Button primary={true} onClick={this.generateMLVFetchFromAnotherSource.bind(this)}>Generate</Button>
										</div>
										<div className="col-lg-9" style={{ margin: '1em' }}>
											<textarea placeholder="MLV*" class="form-control rounded-0" rows="5" value={this.props.fetchFromAnotherSourceForInsert.mlv} onChange={this.setFetchFromSourceMLV.bind(this)}>

											</textarea>
										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-lg-10" tabIndex="0">
											<Input

												placeholder="Filter"
												style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
												onChange={this.editFilterForFetchFromAnotherSourceForInsert.bind(this)}
												value={this.props.fetchFromAnotherSourceForInsert.filter}
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
												onDoubleClick={this.addFilterForFetchFromAnotherSourceForInsert.bind(this)}
											>
												{this.props.fetchFromAnotherSourceForInsert.attributes.map((attributeName) => {
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
												onDoubleClick={this.addFilterForFetchFromAnotherSourceForInsert.bind(this)}
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
												onDoubleClick={this.addFilterForFetchFromAnotherSourceForInsert.bind(this)}
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
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Insert MLV</i>}>

								<div className="row justify-content-center">
									<div className="col-lg-1" style={{ margin: '1em' }}>
										<Button primary={true} onClick={this.addInsertMLV.bind(this)}>Add</Button>
									</div>
								</div>
								<div className="row justify-content-center" style={{ width: "100%" }}>
									<div className="col-lg-10 justify-content-center panel-wrapper" style={{ maxWidth: "90%", margin: "0 auto" }}>

										<PanelBar >
											{insertMLVArrayElement}
										</PanelBar>
									</div>
								</div>
							</PanelBarItem>
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Fetch MLV</i>}>

								<div className="row justify-content-center">
									<div className="col-lg-1" style={{ margin: '1em' }}>
										<Button
											primary={true}
											onClick={this.generateFetchMLVForInsert.bind(this)}
										>Generate</Button>
									</div>
									<div className="col-lg-9" style={{ margin: '1em' }}>
										<textarea
											placeholder="Fetch MLV*"
											class="form-control rounded-0"
											rows="5"
											value={this.props.fetchMLVForinsert.mlv}
											onChange={this.saveFetchMLVForInsert.bind(this)}
										>

										</textarea>
									</div>
								</div>
								<div className="row justify-content-center">
									<div className="col-lg-10" tabIndex="0">
										<Input

											placeholder="Filter"
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.editFilterForFetchMLVForInsert.bind(this)}
											value={this.props.fetchMLVForinsert.filter}
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
											onDoubleClick={this.addFilterForFetchMLVForInsert.bind(this)}
										>
											{this.props.fetchMLVForinsert.attributes.map((attributeName) => {
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
											onDoubleClick={this.addFilterForFetchMLVForInsert.bind(this)}
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
											onDoubleClick={this.addFilterForFetchMLVForInsert.bind(this)}
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
						{
							this.props.insertMLVArray.length < 2 &&
							<div className="row justify-content-center">
								<div className="col-lg-2">
									<Button
										style={{ margin: "1em" }}
										onClick={this.toggleRSInsert.bind(this)}
									>
										RS Insert
									</Button>
									<Switch
										style={{ margin: "1em" }}
										checked={this.props.rsInsertFlag}
									/>
								</div>
								<div className="col-lg-2">
									<Button
										style={{ margin: "1em" }}
										onClick={this.toggleBulkInsert.bind(this)}
									>
										Bulk Insert
									</Button>
									<Switch
										style={{ margin: "1em" }}
										checked={this.props.bulkInsertFlag}
									/>
								</div>
							</div>
						}
					</div>
				</div>
			</div>

		)
	}
}