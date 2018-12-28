import React, { Component } from 'react';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
export default class InsertDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchFromAnotherSource: false
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
	}


	setInsertID(event){
		this.props.setInsertID(event.target.props.id,event.target.value)
	}


	setInsertPID(event){
		this.props.setInsertPID(event.target.props.id,event.target.value)
	}


	setInsertLEV(event){
		this.props.setInsertLEV(event.target.props.id,event.target.value)
	}

	setInsertMLV(event){
		this.props.saveInsertMLV(event.target.value, event.target.id)
	}

	setInsertValues(event){
		this.props.setInsertValues(event.target.id, event.target.value)
	}



	render() {
		console.log(this.props.insertMLVArray)
		var insertMLVArrayElement = this.props.insertMLVArray.map(object => {
			var attributeColumns = new Array();
			if(object.mlv!=''){
				try {
				var temp = object.mlv.split('attributes=')[1].split(';')[0].split(',')
				attributeColumns = temp;
			} catch{
				alert('Error parsing MLV')
			}
		}
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
						data={attributeColumns}
						label="ID"
						id={object.index}
						style={{width : '100%',margin:'1em'}}
						onChange={this.setInsertID.bind(this)}
						value={object.ID}
						/>

					</div>
					<div className="col-lg-4">
						<DropDownList
						data={attributeColumns}
						label="PID"
						id={object.index}
						style={{width : '100%',margin:'1em'}}
						onChange={this.setInsertPID.bind(this)}
						value={object.PID}
						/>
					</div>
					<div className="col-lg-4">
						<DropDownList
						data={attributeColumns}
						label="LEV"
						id={object.index}
						style={{width : '100%',margin:'1em'}}
						onChange={this.setInsertLEV.bind(this)}
						value={object.LEV}
						/>
					</div>
				</div>

				<div className="row justify-content-center">
					<div className="col-lg-10" style={{margin:"1em"}}>
						<textarea
							placeholder="values*"
							class="form-control rounded-0"
							rows="2"
							id={object.index}
							value={object.values}
							onChange={this.setInsertValues.bind(this)}
						>

						</textarea>
					</div>
				</div>

				</div>
			)
		})
		return (
			<div row="justify-content-center" style={{ marginTop: "1em", width: "110em" }}>
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
						</PanelBar>


					</div>
				</div>
			</div>

		)
	}
}