import React, { Component } from 'react';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import * as Constants from '../../Constants.js';

export default class DeleteAllDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	addDeleteAllMLV(event) {
		event.preventDefault();
		this.props.addDeleteAllMLV();
	}
	generateDeleteAllMLV(event){
		this.props.generateDeleteAllMLV(event.target.id)
	}
	saveDeleteAllMLV(event){
		this.props.saveDeleteAllMLV( event.target.value, event.target.id)
	}
	deleteDeleteAllMLV(event){
		event.preventDefault();
		this.props.deleteDeleteAllMLV(event.target.id)
	}
	addFilterForDeleteAll(event){
		this.props.addFilterForDeleteAll(event.target.id, event.target.value)
	}
	editFilterForDeleteAll(event){
		this.props.editFilterForDeleteAll(event.target.props.id, event.target.value)
	}

	render() {
		var deleteAllMLVArrayElement = this.props.deleteAllMLVs.deleteAllMLVArray.map((object, index) => {

			return (
				<PanelBarItem title={<i style={{ fontSize: "12px" }}>{'Delete MLV ' + (index + 1)}</i>}>
				<div className="row justify-content-center">
					<div className="col-lg-1" style={{ margin: '1em' }}>
						<Button
							primary={true}
							id={object.index}
							onClick={this.generateDeleteAllMLV.bind(this)}
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
							onChange={this.saveDeleteAllMLV.bind(this)}
						>

						</textarea>
					</div>
					<div className="col-lg-1" style={{ margin: '1em' }}>
						<Button
							primary={true}
							id={object.index}
							onClick={this.deleteDeleteAllMLV.bind(this)}
						>Delete
						</Button>
					</div>
				</div>
						<div className="row justify-content-center">
						<div className="col-lg-10" tabIndex="0">
							<Input

								placeholder="Filter"
								style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
								onChange={this.editFilterForDeleteAll.bind(this)}
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
											onDoubleClick={this.addFilterForDeleteAll.bind(this)}
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
												onDoubleClick={this.addFilterForDeleteAll.bind(this)}
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
												onDoubleClick={this.addFilterForDeleteAll.bind(this)}
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
				<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

					<PanelBar >
						<PanelBarItem title={<i style={{ fontSize: "16px" }}>Delete MLV</i>}>
							<div className="row justify-content-center">
								<div className="col-lg-1" style={{ margin: '1em' }}>
									<Button
										primary={true}
										//id={object.index}
										onClick={this.addDeleteAllMLV.bind(this)}
									>Add
											</Button>
											
								</div>
							</div>
							<div className="row justify-content-center" style={{ width: "100%" }}>
								<div className="col-lg-10 justify-content-center panel-wrapper" style={{ maxWidth: "90%", margin: "0 auto" }}>

									<PanelBar >
										{deleteAllMLVArrayElement}
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