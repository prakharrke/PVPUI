import React, { Component } from 'react';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
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
	addInsertMLV(event) {
		event.preventDefault();
		this.props.addInsertMLV()


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

	generateFetchMLVForInsert(event){

		this.props.generateFetchMLVForInsert();

	}



	render() {

		var insertMLVArrayElement = this.props.insertMLVArray.map(object => {


			return (
				<div>
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
					</div>
					<div className="row justify-content-center">
						<div className="col-lg-4">
							<DropDownList
								data={object.attributes}
								label="ID"
								id={object.index}
								style={{ width: '100%', margin: '1em' }}
								onChange={this.setInsertID.bind(this)}
								value={object.ID}
							/>

						</div>
						<div className="col-lg-4">
							<DropDownList
								data={object.attributes}
								label="PID"
								id={object.index}
								style={{ width: '100%', margin: '1em' }}
								onChange={this.setInsertPID.bind(this)}
								value={object.PID}
							/>
						</div>
						<div className="col-lg-4">
							<Input
								data={object.attributes}
								label="LEV"
								id={object.index}
								style={{ width: '100%', margin: '2em' }}
								onChange={this.setInsertLEV.bind(this)}
								value={object.LEV}
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

							<div>
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
								<div className="row justify-content-center">

									<div className="col-lg-6">
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
									</div>
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
				</div>
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
							checked={this.props.fetchFromAnotherSource}
						/>
					</div>

				</div>
				<div className="row" style={{ marginTop: "1em", width: "100%" }}>
					<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

						<PanelBar >

							{this.props.fetchFromAnotherSource ?
								<PanelBarItem title={<i style={{ fontSize: "16px" }}>Fetch From Another Source</i>}>

									<div className="row justify-content-center">
										<div className="col-lg-1" style={{ margin: '1em' }}>
											<Button primary={true} onClick={this.generateMLVFetchFromAnotherSource.bind(this)}>Generate</Button>
										</div>
										<div className="col-lg-9" style={{ margin: '1em' }}>
											<textarea placeholder="MLV*" class="form-control rounded-0" rows="5" value={this.props.fetchFromAnotherSourceMLV} onChange={this.setFetchFromSourceMLV.bind(this)}>

											</textarea>
										</div>
									</div>


								</PanelBarItem> : ''}
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Insert MLV</i>}>

								<div className="row justify-content-center">
									<div className="col-lg-1" style={{ margin: '1em' }}>
										<Button primary={true} onClick={this.addInsertMLV.bind(this)}>Add</Button>
									</div>
								</div>
								{insertMLVArrayElement}
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
										<textarea placeholder="Fetch MLV*" class="form-control rounded-0" rows="5" value={this.props.fetchMLVForinsert.mlv}>

										</textarea>
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