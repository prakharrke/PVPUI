import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { MultiSelect, AutoComplete } from '@progress/kendo-react-dropdowns';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { filterBy } from '@progress/kendo-data-query';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import LoadingPanel from './Components/LoadingPanel'
import axios from 'axios';
import * as helpers from '../MLVObject'
import * as Constants from '../Constants.js'
import * as helper from '../helper'

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
			isLoading: false,
			customAttribute: ""

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
				selectedObject: "Selected Sources",
				attributeListForSelectedObject: [],

			})
		}







	}


	addSelectedObject(event) {
		//helpers.updateObjectList(event.target.value)
		var tempStateObjectList = this.state.selectedObjectList;
		var updatedObjectList = new Array();
		updatedObjectList = tempStateObjectList;
		var newObjectList = event.target.value;
		if (newObjectList.length > tempStateObjectList.length) {

			newObjectList.map((objectName, index) => {

				if (!(tempStateObjectList.includes(objectName))) {

					updatedObjectList.push(objectName)
					this.setState({

						selectedObjectList: updatedObjectList,
						[objectName]: {
							objectName: objectName,
							level: index,
							attributes: [],
							predicate: "",
							fetchSize: "",
							chunkSize: "",
							levelWeight: "",
							delimiter: `*level${index}*`,
							groupBy: {
								attributes: []
							},
							orderBy: {
								attributes: [],

							}

						}
					})
				}

				console.log(tempStateObjectList)
			})
		}
		if (tempStateObjectList.length > newObjectList.length) {
			var temp = {
				...this.state
			}
			tempStateObjectList.map((objectName, index) => {
				// * SAVE STATE IN TEMP OBJECT, REMOVE THE SOURCE KEY TO BE DELETED, SAVE THE TEMP OBJECT TO STATE
				console.log(objectName)

				if (!(newObjectList.includes(objectName))) {


					updatedObjectList.splice(index, 1);
					console.log('Hre')
					temp.selectedObjectList = updatedObjectList;
					delete temp[objectName];
					/*this.setState({

						...temp
					})*/
				}

				/*this.setState({

					...temp
				})*/


			})

			if (updatedObjectList.length != 0) {
				alert(updatedObjectList)
				updatedObjectList.map((objectName, level) => {

					temp[objectName].level = level;
					temp[objectName].delimiter = `*level${level}*`
					if (temp[objectName].attributes.length != 0) {

						temp[objectName].attributes.map((attribute, attIndex) => {

							attribute.columnName = `level_${temp[objectName].level}_${objectName}_${event.target.value}_${attIndex}`;
							attribute.ID = `level_${temp[objectName].level}_${objectName}_${event.target.value}_${attIndex}`
							temp[objectName].attributes[attIndex] = attribute;

						})
					}



				})

				this.setState({

					...temp
				})
			}

		}


		this.setState({

			selectedObjectList: [...event.target.value],

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

	// * METHOD TO ADD SELECTED ATTRIBUTE TO SELCTED_ATTRIBUTE_LIST FOR CURRENT SELECTED OBJECT

	addSelectedAttribute(event) {

		if (event.target.value === "") {

			return
		}
		var selectedObject = this.state.selectedObject;
		var attributes = new Array();
		attributes = this.state[selectedObject].attributes;
		var attributesLength = attributes.length
		attributes.push({
			columnName: helper.generateColumnName(`level_${this.state[selectedObject].level}_${selectedObject}_${event.target.value}_${attributesLength}`),
			attributeName: event.target.value,
			ID: helper.generateColumnName(`level_${this.state[selectedObject].level}_${selectedObject}_${event.target.value}_${attributesLength}`)
		})
		this.setState({
			customAttribute: "",
			[this.state.selectedObject]: {

				...this.state[selectedObject],
				attributes: attributes
			}

		})



	}



	// * CHANGE COLUMN NAME FOR ATTRIBUTES
	changeColumnName(event) {

		var temp = new Array();
		temp = this.state[this.state.selectedObject].attributes
		temp.map((attribute) => {

			if (attribute.ID === event.target.name) {

				attribute.columnName = helper.generateColumnName(event.target.value)

			}
		})

		this.setState({

			[this.state.selectedObject]: {

				...this.state[this.state.selectedObject],
				attributes: temp
			}
		})


	}

	addSelectedAttributeFromAutoComplete(event) {
		if (event.key == 'Enter' && (this.state[this.state.selectedObject] != null || this.state[this.state.selectedObject] != undefined) && event.target.value != "") {
			var selectedObject = this.state.selectedObject;
			var attributes = new Array();
			attributes = this.state[selectedObject].attributes;
			var attributesLength = attributes.length
			attributes.push({
				columnName: helper.generateColumnName(`level_${this.state[selectedObject].level}_${selectedObject}_${event.target.value}_${attributesLength}`),
				attributeName: event.target.value,
				ID: helper.generateColumnName(`level_${this.state[selectedObject].level}_${selectedObject}_${event.target.value}_${attributesLength}`)
			})
			this.setState({
				[this.state.selectedObject]: {

					...this.state[selectedObject],
					attributes: attributes
				},
				customAttribute: ""
			})
		}
	}

	// * ADD CUSTOM ATTRIBUTE 
	addCustomAttribute(event) {

		this.setState({

			customAttribute: (this.state.customAttribute + " " + event.target.value)
		})
	}

	// * EDIT CUSTOM ATTRIBUTE

	editCustomAttribute(event) {
		if (this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] != undefined && this.state.selectedObject != "Selected Sources") {
			this.setState({

				customAttribute: event.target.value
			})
		}
	}

	// * METHOD TO REMOVE SELECTED ATTRIBUTE 

	removeSelectedAttribute(event) {

		var temp = this.state[this.state.selectedObject].attributes;
		temp.map((attribute, index) => {

			if (event.target.getAttribute('name') === attribute.ID) {

				temp.splice(index, 1);
			}
		})

		this.setState({
			[this.state.selectedObject]: {

				...this.state[this.state.selectedObject],
				attributes: temp
			}
		})

	}



	// * ADD PREDICATE FOR CURRENT OBJECT

	addPredicate(event) {
		if (this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] != undefined) {
			this.setState({
				[this.state.selectedObject]: {

					...this.state[this.state.selectedObject],
					predicate: this.state[this.state.selectedObject].predicate + " " + event.target.value
				}
			})
		}
	}

	// * EDIT PREDICATE VALUE FROM INPUT COMPONENT

	editPredicate(event) {
		if (this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] != undefined && this.state.selectedObject != "Selected Sources") {
			this.setState({
				[this.state.selectedObject]: {
					...this.state[this.state.selectedObject],
					predicate: event.target.value
				}
			})
		}
	}


	// * METHOD TO ADD FETCH SIZE 
	addFetchSize(event) {
		var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

		if (this.state.selectedObject != "Selected Sources") {
			if (numbers.includes(event.target.value[event.target.value.length - 1]) || event.target.value === '') {

				this.setState({

					[this.state.selectedObject]: {
						...this.state[this.state.selectedObject],
						fetchSize: event.target.value
					}
				})
			}
		}
	}

	addChunkSize(event) {
		var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

		if (this.state.selectedObject != "Selected Sources") {

			if (numbers.includes(event.target.value[event.target.value.length - 1]) || event.target.value === '') {

				this.setState({

					[this.state.selectedObject]: {
						...this.state[this.state.selectedObject],
						chunkSize: event.target.value
					}
				})
			}
		}
	}

	addLevelWeight(event) {
		var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'];
		if (this.state.selectedObject != "Selected Sources") {
			if (numbers.includes(event.target.value[event.target.value.length - 1]) || event.target.value === '') {

				if (event.target.value[event.target.value.length - 1] === '-') {

					if (this.state[this.state.selectedObject].levelWeight.length === 0) {
						this.setState({

							[this.state.selectedObject]: {
								...this.state[this.state.selectedObject],
								levelWeight: event.target.value
							}
						})

					}


				}
				else {

					this.setState({

						[this.state.selectedObject]: {
							...this.state[this.state.selectedObject],
							levelWeight: event.target.value
						}
					})
				}
			}
		}
	}

	// * METHOD TO ADD GROUP BY ATTRIBUTE
	addGroupByAttribute(event) {
		console.log(event.target.getAttribute('name'))
		if (event.target.value === "") {

			return
		}
		var selectedObject = this.state.selectedObject;
		var attributes = new Array();
		attributes = this.state[selectedObject].groupBy.attributes;

		var attributesLength = attributes.length;

		for (var i = 0; i < attributes.length; i++) {

			if (event.target.getAttribute('name') === attributes[i].ID) {

				return
			}
		}
		attributes.push({

			attributeName: event.target.value,
			ID: event.target.getAttribute('name'),
			columnName: event.target.getAttribute('name')
		})




		this.setState({

			[this.selectedObject]: {
				...this.state[this.selectedObject],
				groupBy: {

					attributes: attributes
				}
			}
		})


	}


	// * REMOVE GROUP BY ATTRIBUTE 

	removeGroupByAttribute(event) {

		var temp = this.state[this.state.selectedObject].groupBy.attributes;

		temp.map((attribute, index) => {

			if (event.target.getAttribute('name') === attribute.ID) {
				temp.splice(index, 1)
			}
		})

		this.setState({
			[this.state.selectedObject]: {

				...this.state[this.state.selectedObject],
				groupBy: {
					...this.state[this.state.selectedObject].groupBy,
					attributes: temp

				}
			}
		})
	}

	// * METHOD TO ADD ORDER BY ATTRIBUTE 

	addOrderByAttribute(event) {

		console.log(event.target.getAttribute('name'))
		if (event.target.value === "") {

			return
		}
		var selectedObject = this.state.selectedObject;
		var attributes = new Array();
		attributes = this.state[selectedObject].orderBy.attributes;

		var attributesLength = attributes.length;

		for (var i = 0; i < attributes.length; i++) {

			if (event.target.getAttribute('name') === attributes[i].ID) {

				return
			}
		}
		attributes.push({

			attributeName: event.target.value,
			ID: event.target.getAttribute('name'),
			columnName: event.target.getAttribute('name'),
			order: {
				asc: true,
				desc: false
			}
		})


		this.setState({

			[this.selectedObject]: {
				...this.state[this.selectedObject],
				orderBy: {

					attributes: attributes
				}
			}
		})
	}
	// * METHOD TO REMOVE ORDER BY ATTRIBUTE

	removeOrderByAttribute(event) {

		var temp = this.state[this.state.selectedObject].orderBy.attributes;

		temp.map((attribute, index) => {

			if (event.target.getAttribute('name') === attribute.ID) {
				temp.splice(index, 1)
			}
		})

		this.setState({
			[this.state.selectedObject]: {

				...this.state[this.state.selectedObject],
				orderBy: {
					...this.state[this.state.selectedObject].orderBy,
					attributes: temp

				}
			}
		})

	}


	// * METHOD TO SELECT ORDER FOR ORDER BY

	toggleOrderForOrderBy(event) {



		if (event.target.getAttribute("component") === "asc") {
			if(event.target.checked){
				alert("Return")
				return
			}
			alert("asc")

			var orderByAttributes = this.state[this.state.selectedObject].orderBy.attributes;
			orderByAttributes.map((attribute, index) => {

				if (attribute.ID === event.target.getAttribute("name")) {

					attribute.order.asc = true
					attribute.order.desc = false
					orderByAttributes[index] = attribute;

					this.setState({

						[this.state.selectedObject]: {
							...this.state[this.state.selectedObject],
							orderBy: {
								attributes: orderByAttributes
							}
						}
					})
				}

			})
		}
		if (event.target.getAttribute("component") === "desc") {


			var orderByAttributes = this.state[this.state.selectedObject].orderBy.attributes;
			orderByAttributes.map((attribute, index) => {

				if (attribute.ID === event.target.getAttribute("name")) {

					attribute.order.asc = false
					attribute.order.desc = true
					orderByAttributes[index] = attribute;

					this.setState({

						[this.state.selectedObject]: {
							...this.state[this.state.selectedObject],
							orderBy: {
								attributes: orderByAttributes
							}
						}
					})
				}

			})
		}
	}

	render() {



		// * ADDING ALL THE ATTRIBUTES FOR SELECTED OBJECT 
		var totalAttributesElement = (this.state.selectedObject === "Selected Sources") ? "" :
			this.state.attributeListForSelectedObject.map((attribute) => {

				return (

					<option key={attribute} value={attribute}>{attribute}</option>
				)
			})

		// * ADDING TEXT INPUT FOR COLUMNS OF ATTRIBUTES< MAPPING THEM WITH SELECTED ATTRIBUTE OBJECT ARRAY OF SELECTED SOURCE
		if (this.state.selectedObject != "Selected Sources") {
			var attributesColumnsElement = "";
			var selectedAttributeListElement = "";
			if (this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] != undefined) {
				attributesColumnsElement = (this.state[this.state.selectedObject].attributes.length === 0 || this.state.selectedObject === "Selected Sources") ? "" :
					this.state[this.state.selectedObject].attributes.map((attribute, index) => {

						var objectName = this.state.selectedObject;

						return (

							<Input
								value={attribute.columnName}
								name={attribute.ID}
								style={{ width: "100%", height: "1.5em", marginTop: '4px', padding: '4px', textAlign: "center" }}
								onChange={this.changeColumnName.bind(this)}
							/>
						)
					})

			}

			if (this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] != undefined) {

				selectedAttributeListElement = (this.state[this.state.selectedObject].attributes.length === 0 || this.state.selectedObject === "Selected Sources") ? "" :
					this.state[this.state.selectedObject].attributes.map((attribute) => {

						return (

							<option
								key={attribute.ID}
								id={attribute.ID}
								name={attribute.ID}
								onDoubleClick={this.removeSelectedAttribute.bind(this)}
								value={attribute.attributeName}>{attribute.attributeName}

							</option>
						)
					})
			}

			// * UPDATING SIZE FOR SELECTED ATTRIBUTES ELEMENT

			var selectedAttributeElementSize = 0

			if (this.state[this.state.selectedObject] === null || this.state[this.state.selectedObject] === undefined) {
				selectedAttributeElementSize = 3;
			} else {
				if (this.state[this.state.selectedObject].attributes.length === 0) {

					selectedAttributeElementSize = 1;
				} else {
					//alert(this.state[this.state.selectedObject].attributes.length)
					selectedAttributeElementSize = this.state[this.state.selectedObject].attributes.length + 3
				}
			}

		}


		var loadingComponent = this.state.isLoading ? <LoadingPanel /> : ""





		return (
			<div className="container-fluid" style={{ marginTop: "2em" }}>
				{loadingComponent}
				<div className=" row justify-content-center">
					<form className="form-inline" style={{ width: "50%" }}>

						<MultiSelect
							placeholder="Select Sources"
							data={this.state.objectList}
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
					<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

						<PanelBar >
							<PanelBarItem title={<b>Select Attributes</b>}>

								<div className="row" >

									<div className="col-lg-6 form-group" >
										<select
											multiple
											className="form-control"
											size={10}
											onDoubleClick={this.addSelectedAttribute.bind(this)}
											id="totalAttributes"
											style={{ overflowX: "scroll" }}
										>
											{totalAttributesElement}
										</select>
										<br />
										<div tabIndex="0" onKeyDown={this.addSelectedAttributeFromAutoComplete.bind(this)}>
											<AutoComplete data={this.state.attributeListForSelectedObject} onKeyDown={this.addSelectedAttributeFromAutoComplete.bind(this)} style={{ width: "100%" }} placeholder="Search Attribute" />
										</div>
									</div>
									<div className="col-lg-2" style={{ padding: '0px' }}>
										<form className="k-form" style={{ width: "100%", marginTop: "0px", padding: '0px' }}>
											{attributesColumnsElement}
										</form>
									</div>

									<div className="col-lg-4 form-group">
										<select
											className="form-control"
											multiple
											id="selectedAttributes"
											style={{ overflowX: "scroll", overflowY: "hidden" }}
											size={selectedAttributeElementSize}
										>
											{selectedAttributeListElement}
										</select>
									</div>

								</div>
								<PanelBarItem title={<b>Add custom Attrbutes</b>}>
									<div className="row">
										<div className="col-lg-11" tabIndex="0" onKeyDown={this.addSelectedAttributeFromAutoComplete.bind(this)}>
											<Input
												value={this.state.customAttribute}
												placeholder="Custom Attribute"
												style={{ width: "100%", textAlign: "center" }}
												onChange={this.editCustomAttribute.bind(this)}

											/>
										</div>
									</div>
									<div className="row">

										<div className="col-lg-5">
											<select
												multiple
												className="form-control"
												size={10}
												onDoubleClick={this.addCustomAttribute.bind(this)}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
											>
												{totalAttributesElement}
											</select>
										</div>
										<div className="col-lg-2">
											<select
												multiple
												className="form-control"
												size={10}
												onDoubleClick={this.addCustomAttribute.bind(this)}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
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
												onDoubleClick={this.addCustomAttribute.bind(this)}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
											>
												{
													Constants.Constants.MLVFunctions.map((func) => {

														return (

															<option value={func}>{func}</option>
														)
													})
												}
											</select>

										</div>
									</div>


								</PanelBarItem>
							</PanelBarItem>
							<PanelBarItem title={<b>Details</b>}>
								<div className="row">
									<div className="col-lg-6">
										<Input

											label="Fetch Size"
											value={this.state[this.state.selectedObject] === null || this.state[this.state.selectedObject] === undefined ? "" : this.state[this.state.selectedObject].fetchSize}
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.addFetchSize.bind(this)}

										/>
										<Input

											label="Chunk Size"
											value={this.state[this.state.selectedObject] === null || this.state[this.state.selectedObject] === undefined ? "" : this.state[this.state.selectedObject].chunkSize}
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.addChunkSize.bind(this)}

										/>
									</div>
									<div className="col-lg-6">
										<Input

											label="Level Weight"
											value={this.state[this.state.selectedObject] === null || this.state[this.state.selectedObject] === undefined ? "" : this.state[this.state.selectedObject].levelWeight}
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.addLevelWeight.bind(this)}

										/>
										<Input

											label="Delimiter"
											value={this.state[this.state.selectedObject] === null || this.state[this.state.selectedObject] === undefined ? "" : this.state[this.state.selectedObject].delimiter}
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}


										/>
									</div>
								</div>

								<PanelBarItem title={<b>Add Predicate</b>}>
									<div className="row">
										<div className="col-lg-11" tabIndex="0">
											<Input
												value={this.state[this.state.selectedObject] == null || this.state[this.state.selectedObject] == undefined ? "" : this.state[this.state.selectedObject].predicate}
												placeholder="Predicate"
												style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
												onChange={this.editPredicate.bind(this)}

											/>
										</div>
									</div>
									<div className="row">

										<div className="col-lg-5">
											<select
												multiple
												className="form-control"
												size={10}
												onDoubleClick={this.addPredicate.bind(this)}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
											>
												{totalAttributesElement}
											</select>
										</div>
										<div className="col-lg-2">
											<select
												multiple
												className="form-control"
												size={10}
												onDoubleClick={this.addPredicate.bind(this)}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
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
												onDoubleClick={this.addPredicate.bind(this)}
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
								<PanelBarItem title={<b>Group By</b>}>

									<div className="row">
										<div className="col-lg-6">
											<select
												multiple
												className="form-control"
												size={10}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
											>
												{

													(this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] && this.state.selectedObject != "Selected Sources") ?

														this.state[this.state.selectedObject].attributes.map((attribute) => {

															for (var i = 0; i < this.state[this.state.selectedObject].groupBy.attributes.length; i++) {

																if (attribute.columnName === this.state[this.state.selectedObject].groupBy.attributes[i].columnName) {


																} else {



																}
															}

															return (


																<option
																	key={attribute.ID}
																	id={attribute.ID}
																	name={attribute.ID}
																	onDoubleClick={this.addGroupByAttribute.bind(this)}
																	value={attribute.attributeName}>{attribute.columnName}

																</option>

															)
														}) : ""


												}


											</select>
										</div>
										<div className="col-lg-6">

											<select
												multiple
												className="form-control"
												size={10}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
											>

												{

													(this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] && this.state.selectedObject != "Selected Sources") ?

														this.state[this.state.selectedObject].groupBy.attributes.map((attribute) => {

															return (


																<option
																	key={attribute.ID}
																	id={attribute.ID}
																	name={attribute.ID}
																	onDoubleClick={this.removeGroupByAttribute.bind(this)}
																	value={attribute.attributeName}>{attribute.columnName}

																</option>

															)
														}) : ""


												}

											</select>
										</div>
									</div>
								</PanelBarItem>
								<PanelBarItem title={<b>Order By</b>}>
									<div className="row">
										<div className="col-lg-6">
											<select
												multiple
												className="form-control"
												size={10}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
											>
												{

													(this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] && this.state.selectedObject != "Selected Sources") ?

														this.state[this.state.selectedObject].attributes.map((attribute) => {


															return (


																<option
																	key={attribute.ID}
																	id={attribute.ID}
																	name={attribute.ID}
																	onDoubleClick={this.addOrderByAttribute.bind(this)}
																	value={attribute.attributeName}>{attribute.columnName}

																</option>

															)
														}) : ""


												}


											</select>
										</div>
										<div className="col-lg-5">
											<select
												multiple
												className="form-control"
												size={10}
												id="totalAttributes"
												style={{ overflowX: "scroll" }}
											>

												{

													(this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] && this.state.selectedObject != "Selected Sources") ?

														this.state[this.state.selectedObject].orderBy.attributes.map((attribute) => {

															return (


																<option
																	key={attribute.ID}
																	id={attribute.ID}
																	name={attribute.ID}
																	onDoubleClick={this.removeOrderByAttribute.bind(this)}
																	value={attribute.attributeName}>{attribute.columnName}

																</option>

															)
														}) : ""


												}

											</select>
										</div>
										<div className="col-lg-1 justify-content-start" >
											{

												(this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] && this.state.selectedObject != "Selected Sources") ?

													this.state[this.state.selectedObject].orderBy.attributes.map((attribute) => {
														console.log(attribute)
														return (

															<div className=" row justify-content-start">
																<form>
																	<label style={{ float: "left", marginTop: "0.25em", marginBottom: "0px" }}>
																		<input
																			type="radio"
																			key={attribute.ID}
																			id={attribute.ID}
																			name={attribute.ID}
																			checked={attribute.order.asc}
																			onClick={this.toggleOrderForOrderBy.bind(this)}
																			component="asc"

																		/>ASC
																	</label>

																	<label style={{ float: "right", margin: "0.25em", marginBottom: "0px" }}>
																		<input
																			type="radio"
																			key={attribute.ID}
																			id={attribute.ID}
																			name={attribute.ID}
																			onClick={this.toggleOrderForOrderBy.bind(this)}
																			component="desc"
																			checked={attribute.order.desc}

																		/>DESC
																	</label>
																</form>
															</div>


														)
													}) : ""


											}
										</div>
									</div>
								</PanelBarItem>
							</PanelBarItem>
						</PanelBar>

					</div>
				</div>
			</div>
		)
	}

}