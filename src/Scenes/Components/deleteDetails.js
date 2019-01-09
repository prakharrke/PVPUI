import React, { Component } from 'react';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import * as Constants from '../../Constants.js';

export default class DeleteDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	toggleFetchFromAnotherSourceForDelete(event) {
		event.preventDefault();
		this.props.toggleFetchFromAnotherSourceForDelete();
	}
	generateMLVFetchFromAnotherSourceForDelete(event) {
		event.preventDefault();
		this.props.generateMLVFetchFromAnotherSourceForDelete('fetchFromAnotherSourceForDelete')
	}
	setFetchFromSourceMLVForDelete(event) {
		this.props.saveMLVForFetchFromAnotherSourceForDelete(event.target.value)
	}

	addFilterForFetchFromAnotherSourceForDelete(event) {
		//console.log(event.target.value)
		this.props.addFilterForFetchFromAnotherSourceForDelete(event.target.value)
	}
	editFilterForFetchFromAnotherSourceForDelete(event) {
		this.props.editFilterForFetchFromAnotherSourceForDelete(event.target.value)
	}
	addDeleteMLV(event) {
		event.preventDefault();
		this.props.addDeleteMLV();
	}
	generateDeleteMLV(event) {
		this.props.generateDeleteMLV(event.target.id)
	}
	saveDeleteMLV(event) {
		this.props.saveDeleteMLV(event.target.value, event.target.id)
	}
	deleteDeleteMLV(event) {
		event.preventDefault();
		this.props.deleteDeleteMLV(event.target.id)
	}
	addFilterForDelete(event) {
		this.props.addFilterForDelete(event.target.id, event.target.value)
	}
	editFilterForDelete(event) {
		this.props.editFilterForDelete(event.target.props.id, event.target.value)
	}
	generateFetchMLVForDelete(event) {
		event.preventDefault();
		this.props.generateFetchMLVForDelete('fetchMLVForDelete')
	}
	saveFetchMLVForDelete(event) {
		this.props.saveFetchMLVForDelete(event.target.value)
	}
	editFilterForFetchMLVForDelete(event) {
		this.props.editFilterForFetchMLVForDelete(event.target.value)
	}
	addFilterForFetchMLVForDelete(event) {
		this.props.addFilterForFetchMLVForDelete(event.target.value)
	}
	copyInsertMLVToDeleteFetch(event) {
		event.preventDefault();
		this.props.copyInsertMLVToDeleteFetch();
	}
	copyInsertMLVToDelete(event){
		event.preventDefault();
		this.props.copyInsertMLVToDelete(event.target.id)
	}

	render() {
		var deleteMLVArrayElement = this.props.deleteMLVs.deleteMLVArray.map((object, index) => {

			return (
				<PanelBarItem title={<i style={{ fontSize: "12px" }}>{'Delete MLV ' + (index + 1)}</i>}>
					{
						this.props.insertMLVLength == 1 ? (
							<div className="row justify-content-center">
								<div className="col-lg-2">
									<Button
										primary={true}
										style={{ margin: '1em' }}
										id={object.index}
										onClick={this.copyInsertMLVToDelete.bind(this)}
									>Copy from insert</Button>
								</div>
							</div>

						) : ""
					}
					<div className="row justify-content-center">
						<div className="col-lg-1" style={{ margin: '1em' }}>
							<Button
								primary={true}
								id={object.index}
								onClick={this.generateDeleteMLV.bind(this)}
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
								onChange={this.saveDeleteMLV.bind(this)}
							>

							</textarea>
						</div>
						<div className="col-lg-1" style={{ margin: '1em' }}>
							<Button
								primary={true}
								id={object.index}
								onClick={this.deleteDeleteMLV.bind(this)}
							>Delete
						</Button>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-lg-10" tabIndex="0">
							<Input

								placeholder="Filter"
								style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
								onChange={this.editFilterForDelete.bind(this)}
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
											onDoubleClick={this.addFilterForDelete.bind(this)}
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
												onDoubleClick={this.addFilterForDelete.bind(this)}
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
												onDoubleClick={this.addFilterForDelete.bind(this)}
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

			<div className="row justify-content-center">
				<div className="col-lg-12">
					<div className="row justify-content-center">
						<div className="col-lg-4">
							<Button
								style={{ margin: "1em" }}
								onClick={this.toggleFetchFromAnotherSourceForDelete.bind(this)}
							>
								Fetch from another source
						</Button>
							<Switch
								style={{ margin: "1em" }}
								checked={this.props.fetchFromAnotherSourceForDeleteFlag}
							/>
						</div>

					</div>
					<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

						<PanelBar >
							{this.props.fetchFromAnotherSourceForDeleteFlag ?
								<PanelBarItem title={<i style={{ fontSize: "16px" }}>Fetch From Another Source (For Bulk Delete)</i>}>

									<div className="row justify-content-center">
										<div className="col-lg-1" style={{ margin: '1em' }}>
											<Button
												primary={true}
												onClick={this.generateMLVFetchFromAnotherSourceForDelete.bind(this)}
											>Generate
										</Button>
										</div>
										<div className="col-lg-9" style={{ margin: '1em' }}>
											<textarea
												placeholder="MLV*"
												class="form-control rounded-0"
												rows="5"
												value={this.props.fetchFromAnotherSourceForDelete.mlv}
												onChange={this.setFetchFromSourceMLVForDelete.bind(this)}
											>

											</textarea>
										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-lg-10" tabIndex="0">
											<Input

												placeholder="Filter"
												style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
												onChange={this.editFilterForFetchFromAnotherSourceForDelete.bind(this)}
												value={this.props.fetchFromAnotherSourceForDelete.filter}
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
												onDoubleClick={this.addFilterForFetchFromAnotherSourceForDelete.bind(this)}
											>
												{this.props.fetchFromAnotherSourceForDelete.attributes.map((attributeName) => {
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
												onDoubleClick={this.addFilterForFetchFromAnotherSourceForDelete.bind(this)}
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
												onDoubleClick={this.addFilterForFetchFromAnotherSourceForDelete.bind(this)}
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
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Delete MLV</i>}>
								<div className="row justify-content-center">
									<div className="col-lg-1" style={{ margin: '1em' }}>
										<Button
											primary={true}
											//id={object.index}
											onClick={this.addDeleteMLV.bind(this)}
										>Add
											</Button>

									</div>
								</div>
								<div className="row justify-content-center" style={{ width: "100%" }}>
									<div className="col-lg-10 justify-content-center panel-wrapper" style={{ maxWidth: "90%", margin: "0 auto" }}>

										<PanelBar >
											{deleteMLVArrayElement}
										</PanelBar>
									</div>
								</div>
							</PanelBarItem>
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Fetch MLV</i>}>

								{
									this.props.insertMLVLength == 1 ? (
										<div className="row justify-content-center">
											<div className="col-lg-2">
												<Button
													primary={true}
													style={{ margin: '1em' }}
													onClick={this.copyInsertMLVToDeleteFetch.bind(this)}
												>Copy from insert</Button>
											</div>
										</div>

									) : ""
								}
								<div className="row justify-content-center">
									<div className="col-lg-1" style={{ margin: '1em' }}>
										<Button
											primary={true}
											onClick={this.generateFetchMLVForDelete.bind(this)}
										>Generate
										</Button>
									</div>
									<div className="col-lg-9" style={{ margin: '1em' }}>
										<textarea
											placeholder="MLV*"
											class="form-control rounded-0"
											rows="5"
											value={this.props.fetchMLVForDelete.mlv}
											onChange={this.saveFetchMLVForDelete.bind(this)}
										>

										</textarea>
									</div>
								</div>
								<div className="row justify-content-center">
									<div className="col-lg-10" tabIndex="0">
										<Input

											placeholder="Filter"
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.editFilterForFetchMLVForDelete.bind(this)}
											value={this.props.fetchMLVForDelete.filter}
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
											onDoubleClick={this.addFilterForFetchMLVForDelete.bind(this)}
										>
											{this.props.fetchMLVForDelete.attributes.map((attributeName) => {
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
											onDoubleClick={this.addFilterForFetchMLVForDelete.bind(this)}
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
											onDoubleClick={this.addFilterForFetchMLVForDelete.bind(this)}
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