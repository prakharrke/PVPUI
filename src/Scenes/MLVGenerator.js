import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { MultiSelect, AutoComplete } from '@progress/kendo-react-dropdowns';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { filterBy } from '@progress/kendo-data-query';
import LoadingPanel from './Components/LoadingPanel'
import axios from 'axios';
import * as helpers from '../MLVObject'
const delay = 50;

export default class MLVGenerator extends Component {

	constructor(props) {

		super(props);

		this.state = {

			selectedObjectList: [],
			loading: false,
			objectList: this.props.objectList,
			selectedObject: 'Selected Sources',
			attributeListForSelectedObject: [],
			isLoading: false

		}

	}

	// * METHOD TO MOUNT LOADING COMPONENT

	isLoading() {

		this.setState({
			isLoading: true
		})
	}

	// * METHOD TO UNMOUNT LOADING COMPONENT

	isNotLoading() {

		this.setState({
			isLoading: false
		})
	}

	static componentWillReceiveProps(props) {
		console.log("componentWillReceiveProps")
		if (!(this.state.objectList === props.objectList)) {

			this.setState({
				objectList: props.objectList
			})

		}
	}

	componentDidUpdate() {


		if (!(this.state.selectedObjectList.includes(this.state.selectedObject)) && this.state.selectedObject != "Selected Sources") {

			this.setState({
				selectedObject: "Selected Sources"
			})
		}

		var totalAttributesElement = document.getElementById("totalAttributes");
		var selectedAttributesElement = document.getElementById("selectedAttributes");



	}


	addSelectedObject(event) {
		helpers.updateObjectList(event.target.value)
		this.setState({

			selectedObjectList: [...event.target.value]
		})
	}

	totalObjectListFilter(event) {

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.setState({
				objectList: filterBy(this.props.objectList.slice(), event.filter),
				loading: false
			});
		}, delay);

		this.setState({
			loading: true
		});
	}

	//* METHOD TO SELECT AN OBJECT FROM SELECTED_OBJECT_LIST

	selectedObject(event) {


		this.setState({
			selectedObject: event.target.value
		})
		this.isLoading();

		axios.post('http://localhost:9090/PVPUI/GetAttributesForSelectedObject', `objectName=${event.target.value}`, {
			headers: {
			}


		}).then((response) => {


			var attributeList = new Array();
			attributeList = response.data.attributeList
			this.isNotLoading();
			this.setState({


				attributeListForSelectedObject: attributeList
			})



		})


	}


	render() {
		var opt = ['Fireeeeeeeeeeeeeeeeeeeeeeefffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeeeeeeeeest', 'Seeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeecond', 'Th3333333333333333333333333333333ird']
		var options = opt.map((attribute) => {

			return (
				<option value="attribute">{attribute}</option>

			)
		})

		var loadingComponent = this.state.isLoading ? <LoadingPanel /> : ""

		console.log(this.state.attributeListForSelectedObject)

		return (
			<div className="container-fluid" style={{ marginTop: "2em" }}>
				{loadingComponent}
				<div className=" row justify-content-center">
					<form className="form-inline" style={{ width: "50%" }}>

						<MultiSelect
							placeholder="Select Sources"
							data={[1, 2, 3, 4, 5, 6]}
							onChange={this.addSelectedObject.bind(this)}
							value={this.state.selectedObjectList}
							filterable={true}
							onFilterChange={this.totalObjectListFilter.bind(this)}
							loading={this.state.loading}
						/>
						<br />
						<DropDownList

							data={this.state.selectedObjectList}
							onChange={this.selectedObject.bind(this)}
							style={{ width: '100%', marginTop: "1em" }}
							value={this.state.selectedObject}

						/>

					</form>
				</div>
				<div className="row" style={{ marginTop: "2em" }}>
					<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "75%", margin: "0 auto" }}>

						<PanelBar >
							<PanelBarItem title="Select Attributes" >

								<div className="row" >

									<div className="col-lg-6 form-group" >
										<select className="form-control" size={6} id="totalAttributes" style={{overflowX: "scroll"}}>
											{options}
										</select>
										<br/>
										<AutoComplete data={opt}  style={{width: "100%"}}/>
										
									</div>
									<div className="col-lg-6 form-group">
										<select className="form-control" size={6} id="selectedAttributes">

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