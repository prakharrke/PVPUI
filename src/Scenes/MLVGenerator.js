import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { MultiSelect, AutoComplete } from '@progress/kendo-react-dropdowns';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { filterBy } from '@progress/kendo-data-query';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import LoadingPanel from './Components/LoadingPanel'
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import axios from 'axios';
import { BrowserRouter, Route, Router, HashRouter, Redirect } from 'react-router-dom';
import * as helpers from '../MLVObject'
import * as Constants from '../Constants.js'
import * as helper from '../helper'

const delay = 50;

export default class MLVGenerator extends Component {

	constructor(props) {

		super(props);
		if (Object.keys(this.props.oldState).length != 0) {

			this.state = {
				...this.props.oldState
			}
		}
		else
			this.state = {
				filterOperator : 'contains',
				exactSearch : false,
				selectedConnectionID: -1,
				tempObject: '',
				selectedObjectList: [],
				loading: false,
				objectList: this.props.connInfoList[0].objectList,
				connInfoList: this.props.connInfoList,
				selectedObject: { objectName: 'Selected Sources', objectID: 0 },
				attributeListForSelectedObject: [],
				isLoading: false,
				customAttribute: "",
				parentObjectsForRelation: [],
				parentObject: {
					levelName: "Select Parent",
					id: 0,
					level: '',
					objectName: '',
					nativeRelations: [],
					objectID: ''
				},
				explicitRelation: {

					attribute: {
						attributeName: '',
						object: ''

					},
					parentAttribute: {
						level: '',
						object: '',
						attributeIndex: ''
					},
					operator: {
						operator: '',

					},
					expression: '',



				},
				parallelExecution: false,
				cache: {
					enabled: false,
					setting: "USE SITE SETTING"
				},
				gridView: {
					columns: [],
					gridViewData: []
				},
				showGridView: false

			}

	}
	componentDidMount() {
		//console.log('COMPONENT WILL MOUNT')
		//console.log(this.props)
	}


	// * METHOD TO MOUNT LOADING COMPONENT

	isLoading() {

		this.setState({

			isLoading: true,

		})
	}

	// * METHOD TO UNMOUNT LOADING COMPONENT

	isNotLoading() {

		this.setState({

			isLoading: false
		})
	}

	/* componentWillReceiveProps(props) {
	 	console.log('component will receive props')
		var oldConnInfoList = this.state.connInfoList;
		var isDifferent = false;
		oldConnInfoList.map(connInfo=>{
			var index = props.connInfoList.map(newConnInfo=>{return newConnInfo.connectionID}).indexOf(oldConnInfoList.connectionID)
			if(index != -1){
				if(props.connInfoList[index].pluginName === oldConnInfoList.pluginName){

				}else{
					isDifferent = true;
				}
			}else{
				isDifferent = true;
			}
		})

		if(isDifferent){
			this.setState({
				connInfoList : props.connInfoList,
				objectList : props.connInfoList[props.connInfoList.map(connInfo=>{return connInfo.connectionID}).indexOf(this.state.selectedConnectionID)].objectList
			})
		}
	}
*/

	componentWillUpdate() {
		/*console.log("CHECK")
		console.log(this.state.selectedConnectionID)
		console.log(this.props.connInfoList)
		alert(this.props.connInfoList[this.props.connInfoList.map(object=>{return object.connectionID}).indexOf(this.state.selectedConnectionID)].objectList)
		*/
		
		if (this.state.selectedObject.objectName === 'Selected Sources') {

			//console.log('already set')
			return
		}

		var indexOfSelectedObject = this.state.selectedObjectList.map((object) => { return object.objectID }).indexOf(this.state.selectedObject.objectID);
		//console.log('INDEX   SSSS')
		if (indexOfSelectedObject < 0) {
			//console.log('INDEX LESS THAN 0')
			this.setState({
				...this.state,
				selectedObject: { objectName: "Selected Sources", objectID: 0 },
				attributeListForSelectedObject: [],
			})
		}


	}

	componentDidUpdate() {
		//console.log('!!!!!!!!!!!!!!!!!!!')
		//console.log(this.state.selectedObjectList.map((object) => { return object.objectID }).indexOf(this.state.selectedObject.objectID))
		if (!(this.state.selectedObjectList.map((object) => { return object.objectID }).indexOf(this.state.selectedObject.objectID) > -1) && this.state.selectedObject.objectName != "Selected Sources") {
			//console.log('UPDATING')
			this.setState({
				selectedObject: { objectName: "Selected Sources", objectID: 0 },
				attributeListForSelectedObject: [],

			})
		}

		// * UPDATING PARENT OBJECT SAVED IN STATE SO THAT THE CURRENTLY SELECTED OBJECT CAN RENDER WITH NEWLY SET PARENT OBJECT OF ITS RELATION
		if (this.state.selectedObject.objectName !== "Selected Sources" && this.state[this.state.selectedObject.objectID].relation.parentObject === this.state.parentObject.objectID && this.state[this.state.selectedObject.objectID].relation.level !== this.state.parentObject.level) {

			//console.log(this.state[this.state.selectedObject])
			//console.log(this.state.parentObject)
			var newParentObject = {
				...this.state.parentObject,
				level: this.state[this.state.selectedObject.objectID].relation.level,
				levelName: this.state[this.state.selectedObject.objectID].relation.parentLevelName,
				id: this.state[this.state.selectedObject.objectID].relation.id,
				objectID: this.state[this.state.selectedObject.objectID].relation.parentObject
			}
			this.setState({
				...this.state,
				parentObject: newParentObject
			})
		}

		// * UPDATING OBJECTLIST FROM CONNINFO AFTER CHANGE IN BASE CONNECTION

		if (!this.state.objectList.every(object => { return this.state.connInfoList[this.state.connInfoList.map(connInfo => { return connInfo.connectionID }).indexOf(this.state.selectedConnectionID)].objectList.includes(object) })) {
			alert('in loop')
			this.setState({
				objectList: this.state.connInfoList[this.state.connInfoList.map(connInfo => { return connInfo.connectionID }).indexOf(this.state.selectedConnectionID)].objectList
			})
		}
	}
	addSelectedObjectTry(event) {

		var selectedObjectList = this.state.selectedObjectList;
		var indexOfNewObject = selectedObjectList.length;
		var newObjectID = indexOfNewObject + '_' + new Date().getTime();
		selectedObjectList.push({
			objectName: event.target.value,
			objectID: newObjectID
		})

		this.setState({
			selectedObjectList: selectedObjectList,
			tempObject: '',
			[newObjectID]: {
				objectID: newObjectID,
				objectName: event.target.value,
				level: indexOfNewObject,
				attributes: [],
				predicate: "",
				fetchSize: "",
				chunkSize: "",
				levelWeight: -1,
				delimiter: `*level${indexOfNewObject}*`,
				groupBy: {
					attributes: []
				},
				orderBy: {
					attributes: [],

				},
				relation: {

					parentLevelName: '',
					id: '',
					level: '',
					parentObject: '',
					type: '',
					native: '',
					isRecursionTrue: false,
					explicit: {
						attribute: {

						},
						parentAttribute: {
							level: '',
							attributeIndex: ''
						},
						operator: {
							operator: '',

						},
						expression: ''

					}


				},
				parentTo: [],

				hideLevel: false,
				connectionID: this.state.selectedConnectionID

			}
		})
	}

	removeSelectedObject(event) {

		var newObjectList = event.target.value;
		var newState = { ...this.state };
		var currentSelectedObjectList = this.state.selectedObjectList;
		var newSelectedObjectList = currentSelectedObjectList;
		currentSelectedObjectList.map((object, index) => {
			if (!(newObjectList.map(innerObject => { return innerObject.objectID }).indexOf(object.objectID) > -1)) {

				var objectToBeDeleted = newState[object.objectID];
				// * CHECKING IF OBJECT TO BE DELETED IS A PARENT OR A CHILD IN A RELATION
				if (objectToBeDeleted.parentTo.length != 0 || objectToBeDeleted.relation.type != '') {

					alert('Source is in a relation. Can not delete')

				} else {
					newSelectedObjectList.splice(index, 1)
					newState.selectedObjectList = newSelectedObjectList;
					//newState[object.objectID] = undefined;


				}
			}
		})
		currentSelectedObjectList = newSelectedObjectList;
		if (newSelectedObjectList.length != 0) {

			newSelectedObjectList.map((object, level) => {
				// * UPDATING LEVEL AND DELIMITER OF EVERY OBJECT AFTER DELETION OF AN OBJECT
				newState[object.objectID].level = level;
				newState[object.objectID].delimiter = `*level${level}*`;
				// * UPDATING RELATION PARENT LEVEL, PARENT_TO FOR UPDATED OBJECT
				if (newState[object.objectID].relation.type != '') {
					var parentObject = newState[object.objectID].relation.parentObject
					//console.log(parentObject);
					newState[object.objectID].relation.level = newState[parentObject].level;
					newState[object.objectID].relation.parentLevelName = "level" + newState[parentObject].level;
					newState[object.objectID].relation.id = (newState[parentObject].level + 1);
				}
				//console.log(newState)

				// * UPDATING PARENT_TO ARRAY FOR EVERY OBJECT
				if (newState[object.objectID].parentTo.length > 0) {


					var oldParentTo = newState[object.objectID].parentTo;

					oldParentTo.map((child, index) => {

						child.level = newSelectedObjectList.map((innerObject) => { return innerObject.objectID }).indexOf(child.objectID)
					})
					newState[object.objectID].parentTo = oldParentTo;
				}

				// * UPDATING COLUMN_NAME AND ID FOR EVERY ATTRIBUTE FOR UPDATED OBJECT
				if (newState[object.objectID].attributes.length != 0) {

					newState[object.objectID].attributes.map((attribute, attIndex) => {

						attribute.columnName = `level_${newState[object.objectID].level}_${object.objectName}_${attribute.attributeName}_${attIndex}`;
						//attribute.ID = `level_${temp[objectName].level}_${objectName}_${event.target.value}_${attIndex}`
						newState[object.objectID].attributes[attIndex] = attribute;

						// * CHECK IF THIS ATTRIBUTE IS SAVED IN GROUP BY ATTRIBUTES, IF SO, UPDATE THAT COLUMN NAME
						newState[object.objectID].groupBy.attributes.map((groupByAttribute, index) => {

							if (attribute.ID === groupByAttribute.ID) {
								newState[object.objectID].groupBy.attributes[index].columnName = `level_${newState[object.objectID].level}_${object.objectName}_${attribute.attributeName}_${attIndex}`;

							}
						})

						// * CHECK IF THIS ATTRIBUTE IS SAVED IN ORDER BY ATTRIBUTES, IF SO, UPDATE THAT COLUMN NAME
						newState[object.objectID].orderBy.attributes.map((orderByAttribute, index) => {

							if (attribute.ID === orderByAttribute.ID) {
								newState[object.objectID].orderBy.attributes[index].columnName = `level_${newState[object.objectID].level}_${object.objectName}_${attribute.attributeName}_${attIndex}`;

							}
						})

					})
				}

				// * UPDATING EXPLICIT RELATION PARENT_OBJECT_LEVEL
				if (newState[object.objectID].relation.type === 'explicit') {

					var parentAttribute = newState[object.objectID].relation.explicit.parentAttribute;
					var parentObjectID = parentAttribute.objectID;
					var newLevel = 'level' + newSelectedObjectList.map((innerObject) => { return innerObject.objectID }).indexOf(parentObjectID)
					parentAttribute.level = newLevel
					//console.log('asdasdasd')
					//console.log(newLevel)
					newState[object.objectID].relation.explicit.parentAttribute = parentAttribute
				}

			})

			//console.log(newState)

		}

		this.setState({ ...newState })
	}


	addSelectedObject(event) {
		//helpers.updateObjectList(event.target.value)
		var tempStateObjectList = this.state.selectedObjectList;
		var updatedObjectList = new Array();
		updatedObjectList = tempStateObjectList;
		var newObjectList = event.target.value;
		var isObjectDeleted = false;
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
							levelWeight: -1,
							delimiter: `*level${index}*`,
							groupBy: {
								attributes: []
							},
							orderBy: {
								attributes: [],

							},
							relation: {

								parentLevelName: '',
								id: '',
								level: '',
								parentObject: '',
								type: '',
								native: '',
								explicit: {
									attribute: {

									},
									parentAttribute: {
										level: '',
										attributeIndex: ''
									},
									operator: {
										operator: '',

									},
									expression: ''

								}


							},
							parentTo: [],

							hideLevel: false,

						}
					})
				}

				//console.log(tempStateObjectList)
			})
		}
		if (tempStateObjectList.length > newObjectList.length) {
			var temp = {
				...this.state
			}
			tempStateObjectList.map((objectName, index) => {
				// * SAVE STATE IN TEMP OBJECT, REMOVE THE SOURCE KEY TO BE DELETED, SAVE THE TEMP OBJECT TO STATE
				//console.log(objectName)

				if (!(newObjectList.includes(objectName))) {
					var objectToBeDeleted = temp[objectName];
					if (objectToBeDeleted.parentTo.length !== 0 || objectToBeDeleted.relation.type !== '') {

						alert('Object is in a relation. Cannot delete')

					} else {
						updatedObjectList.splice(index, 1);
						//console.log('Hre')
						temp.selectedObjectList = updatedObjectList;
						delete temp[objectName];
					}
				}






			})

			if (updatedObjectList.length != 0) {
				alert(updatedObjectList)
				updatedObjectList.map((objectName, level) => {
					// * UPDATING LEVEL AND DELIMTER FOR EVERY OBJECT 
					temp[objectName].level = level;
					temp[objectName].delimiter = `*level${level}*`
					// * UPDATING RELATION PARENT LEVEL, PARENT_TO FOR UPDATED OBJECT
					if (temp[objectName].relation.type != '') {
						var parentObject = temp[objectName].relation.parentObject
						//console.log(parentObject);
						temp[objectName].relation.level = temp[parentObject].level;
						temp[objectName].relation.parentLevelName = "level" + temp[parentObject].level;
						temp[objectName].relation.id = (temp[parentObject].level + 1);
					}
					// * UPDATING PARENT_TO ARRAY OF EVERY OBJECT, IF CHILDREN OBJECTS ARE PRESENT, THEIR CORRECT LEVELS SHOULD BE UPDATED AFTER AN OBJECT IS DELETED
					if (temp[objectName].parentTo.length > 0) {

						var parentTo = temp[objectName].parentTo;
						parentTo.map((object, index) => {
							parentTo[index].level = updatedObjectList.indexOf(object.objectName)
						})
						temp[objectName].parentTo = parentTo
					}

					// * UPDATING COLUMN_NAME AND ID FOR EVERY ATTRIBUTE FOR UPDATED OBJECT
					if (temp[objectName].attributes.length != 0) {

						temp[objectName].attributes.map((attribute, attIndex) => {

							attribute.columnName = `level_${temp[objectName].level}_${objectName}_${attribute.attributeName}_${attIndex}`;
							//attribute.ID = `level_${temp[objectName].level}_${objectName}_${event.target.value}_${attIndex}`
							temp[objectName].attributes[attIndex] = attribute;

							// * CHECK IF THIS ATTRIBUTE IS SAVED IN GROUP BY ATTRIBUTES, IF SO, UPDATE THAT COLUMN NAME
							temp[objectName].groupBy.attributes.map((groupByAttribute, index) => {

								if (attribute.ID === groupByAttribute.ID) {
									temp[objectName].groupBy.attributes[index].columnName = `level_${temp[objectName].level}_${objectName}_${attribute.attributeName}_${attIndex}`;

								}
							})

							// * CHECK IF THIS ATTRIBUTE IS SAVED IN GROUP BY ATTRIBUTES, IF SO, UPDATE THAT COLUMN NAME
							temp[objectName].orderBy.attributes.map((orderByAttribute, index) => {

								if (attribute.ID === orderByAttribute.ID) {
									temp[objectName].orderBy.attributes[index].columnName = `level_${temp[objectName].level}_${objectName}_${attribute.attributeName}_${attIndex}`;

								}
							})

						})
					}



				})


			}
			this.setState({

				...temp
			})


			// * CHANGING DEFAULT VALUE OF PARENT LEVEL STATE
			// ***********************REMOVING THIS PIECE OF CODE PARENT LEVEL STATE WILL CHANGE ONLY WHEN SELECTED OBJECT CHANGES OR A RELATIONSHIP IS DELETED
			/*this.setState({
				...this.state,
				parentObject: {
					levelName: "Parent level",
					id: 0,
					level: '',
					objectName: ''
				}
			})*/
		}



	}

	setExactSearch(){
		if(this.state.exactSearch){
			this.setState({
				...this.state,
				exactSearch : false,
				filterOperator : 'contains',
				objectList : this.state.connInfoList[this.state.connInfoList.map(connInfo => { return connInfo.connectionID }).indexOf(this.state.selectedConnectionID)].objectList.slice()
			})

			//this.totalObjectListFilter(event)

		}else{
			this.setState({
				...this.state,
				exactSearch : true,
				filterOperator : 'eq',
				objectList : this.state.connInfoList[this.state.connInfoList.map(connInfo => { return connInfo.connectionID }).indexOf(this.state.selectedConnectionID)].objectList.slice()
			})
		}
	}

	totalObjectListFilter(event) {

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {

			this.setState({
				objectList: filterBy(this.state.connInfoList[this.state.connInfoList.map(connInfo => { return connInfo.connectionID }).indexOf(this.state.selectedConnectionID)].objectList.slice(),{logic : "and", filters : [{operator : this.state.filterOperator, value :event.filter.value}]}),
				loading: false
			});
		}, delay);

		this.setState({
			loading: true
		});
	}

	//* METHOD TO SELECT AN OBJECT FROM SELECTED_OBJECT_LIST

	selectedObject(event) {
		/*
		* UPDATING PARENT LEVEL TAG'S VALUE TO SELECTED RELATION PARENT LEVEL IF IT IS SET, OTHERWISE TO DEFAULT VALUE
		* SETTING EXPLICIT RELATION GLOBAL STATE TO EMPTY
		*/


		if (this.state[event.target.value.objectID].relation.type === '') {

			this.setState({

				...this.state,
				parentObject: {
					levelName: "Parent level",
					id: 0,
					level: '',
					objectName: ''


				},
				selectedObject: { objectName: event.target.value.objectName, objectID: event.target.value.objectID },
				nativeRelations: [],
				explicitRelation: {
					attribute: {
						attributeName: '',
						object: '',
						expression: ''

					},
					parentAttribute: {
						level: '',
						attributeName: '',
						attributeIndex: '',
						objectID: ''
					},
					operator: {
						operator: '',
						id: ''
					}
				}
			})
		} else {
			// * FIRST SETTING NATIVE RELATIONS FOR LEVEL SAVED AS PARENT IN THE SELECTED OBJECT
			this.getNativeObjectsBetweenObjects(this.state[event.target.value.objectID].relation.parentObject)

			this.setState({

				...this.state,
				selectedObject: { objectName: event.target.value.objectName, objectID: event.target.value.objectID },
				parentObject: {
					levelName: this.state[event.target.value.objectID].relation.parentLevelName,
					level: this.state[event.target.value.objectID].relation.level,
					id: this.state[event.target.value.objectID].relation.id,
					objectName: this.state[event.target.value.objectID].relation.parentObject,
					objectID: this.state[event.target.value.objectID].objectID
				},
				explicitRelation: {
					attribute: {
						attributeName: '',
						object: '',

					},
					parentAttribute: {
						level: '',
						attributeName: '',
						attributeIndex: ''
					},
					operator: {
						operator: '',
						id: ''
					}
				}
			})
		}





		this.isLoading();

		axios.post('http://localhost:9090/PVPUI/GetAttributesForSelectedObject', `objectName=${event.target.value.objectName}`, {
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
		attributes = this.state[selectedObject.objectID].attributes;
		var attributesLength = attributes.length
		attributes.push({
			columnName: helper.generateColumnName(`level_${this.state[selectedObject.objectID].level}_${selectedObject.objectName}_${event.target.value}_${attributesLength}`),
			attributeName: event.target.value,
			ID: helper.generateColumnName(`level_${this.state[selectedObject.objectID].level}_${selectedObject.objectName}_${event.target.value}_${attributesLength}`)
		})
		this.setState({
			customAttribute: "",
			[this.state.selectedObject.objectID]: {

				...this.state[selectedObject.objectID],
				attributes: attributes
			}

		})
	}



	// * CHANGE COLUMN NAME FOR ATTRIBUTES
	changeColumnName(event) {

		var temp = new Array();
		temp = this.state[this.state.selectedObject.objectID].attributes
		var groupByAttributes = this.state[this.state.selectedObject.objectID].groupBy.attributes;
		var orderByAttributes = this.state[this.state.selectedObject.objectID].orderBy.attributes;

		temp.map((attribute) => {

			if (attribute.ID === event.target.name) {

				attribute.columnName = helper.generateColumnName(event.target.value)
				groupByAttributes.map((groupByAttribute, index) => {

					if (groupByAttribute.ID === attribute.ID) {
						console.log(groupByAttribute.ID)
						console.log(attribute.ID)
						groupByAttributes[index].columnName = helper.generateColumnName(event.target.value)
					}
				})
				orderByAttributes.map((orderByAttribute, index) => {
					if (orderByAttribute.ID === attribute.ID) {
						orderByAttributes[index].columnName = helper.generateColumnName(event.target.value)
					}
				})

			}



		})




		this.setState({

			[this.state.selectedObject.objectID]: {

				...this.state[this.state.selectedObject.objectID],
				attributes: temp,
				groupBy: {
					...this.state[this.state.selectedObject.objectID].groupBy,
					attributes: groupByAttributes
				},
				orderBy: {
					...this.state[this.state.selectedObject.objectID].orderBy,
					attributes: orderByAttributes
				}
			}
		})


	}

	addSelectedAttributeFromAutoComplete(event) {
		if (!this.state.attributeListForSelectedObject.includes(event.target.value)) {

			return
		}
		if (event.key == 'Enter' && (this.state[this.state.selectedObject.objectID] != null || this.state[this.state.selectedObject.objectID] != undefined) && event.target.value != "") {
			var selectedObject = this.state.selectedObject;
			var attributes = new Array();
			attributes = this.state[selectedObject.objectID].attributes;
			var attributesLength = attributes.length
			attributes.push({
				columnName: helper.generateColumnName(`level_${this.state[selectedObject.objectID].level}_${selectedObject.objectName}_${event.target.value}_${attributesLength}`),
				attributeName: event.target.value,
				ID: helper.generateColumnName(`level_${this.state[selectedObject.objectID].level}_${selectedObject.objectName}_${event.target.value}_${attributesLength}`)
			})
			this.setState({
				[this.state.selectedObject.objectID]: {

					...this.state[selectedObject.objectID],
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
		if (this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] != undefined && this.state.selectedObject.objectName != "Selected Sources") {
			this.setState({

				customAttribute: event.target.value
			})
		}
	}

	// * METHOD TO REMOVE SELECTED ATTRIBUTE 

	removeSelectedAttribute(event) {

		var temp = this.state[this.state.selectedObject.objectID].attributes;
		temp.map((attribute, index) => {



			if (event.target.getAttribute('name') === attribute.ID) {
				console.log(attribute.ID)
				// * CHECK IF THIS ATTRIBUTE HAS EXPLICIT RELATION WITH ANOTHER OBJECT, BOTH ARE PARENT AND CHILD
				if (this.state[this.state.selectedObject.objectID].relation.type === 'explicit' && this.state[this.state.selectedObject.objectID].relation.explicit.attribute.key === attribute.ID) {
					alert('This attribute is involved in explicit relation.')
					return;
				}

				// * CHECK IF ANY OBJECT WITH EXPLICIT RELATION HAS THIS OBJECT AS PARENT
				var isAttributeParent = false;
				var isGroupByAttribute = false;
				var isOrderByAttribute = false;
				this.state.selectedObjectList.map((object) => {

					if (this.state[object.objectID].relation.type === 'explicit') {

						if (this.state[object.objectID].relation.explicit.parentAttribute.key === attribute.ID) {

							alert('This attribute is involved in explicit relation. Cannot delete')
							isAttributeParent = true;
							return;
						}
					}
				})
				if (isAttributeParent) {
					return;
				}

				// * CHECK IF ATTRIBUTE IS A PART OF GROUP BY

				this.state[this.state.selectedObject.objectID].groupBy.attributes.map((groupByAttribute) => {
					if (groupByAttribute.ID === attribute.ID) {
						isGroupByAttribute = true;
					}
				})

				if (isGroupByAttribute) {
					alert('Attribute has group by constraint on it. Cannot delete')
					return;
				}

				// * CHECK IF ATTRIBUTE IS PART OF ORDER BY
				this.state[this.state.selectedObject.objectID].orderBy.attributes.map((orderByAttribute) => {
					if (orderByAttribute.ID === attribute.ID) {
						isOrderByAttribute = true;
					}
				})
				if (isOrderByAttribute) {
					alert('Attribute has order by constraint on it. Cannot delete')
					return;
				}


				temp.splice(index, 1);
			}
		})

		this.setState({
			[this.state.selectedObject.objectID]: {

				...this.state[this.state.selectedObject.objectID],
				attributes: temp
			}
		})

	}



	// * ADD PREDICATE FOR CURRENT OBJECT

	addPredicate(event) {
		if (this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] != undefined) {
			this.setState({
				[this.state.selectedObject.objectID]: {

					...this.state[this.state.selectedObject.objectID],
					predicate: this.state[this.state.selectedObject.objectID].predicate + " " + event.target.value
				}
			})
		}
	}

	// * EDIT PREDICATE VALUE FROM INPUT COMPONENT

	editPredicate(event) {
		if (this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] != undefined && this.state.selectedObject.objectName != "Selected Sources") {
			this.setState({
				[this.state.selectedObject.objectID]: {
					...this.state[this.state.selectedObject.objectID],
					predicate: event.target.value
				}
			})
		}
	}


	// * METHOD TO ADD FETCH SIZE 
	addFetchSize(event) {
		var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

		if (this.state.selectedObject.objectName != "Selected Sources") {
			if (numbers.includes(event.target.value[event.target.value.length - 1]) || event.target.value === '') {

				this.setState({

					[this.state.selectedObject.objectID]: {
						...this.state[this.state.selectedObject.objectID],
						fetchSize: event.target.value
					}
				})
			}
		}
	}

	addChunkSize(event) {
		var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

		if (this.state.selectedObject.objectName != "Selected Sources") {

			if (numbers.includes(event.target.value[event.target.value.length - 1]) || event.target.value === '') {

				this.setState({

					[this.state.selectedObject.objectID]: {
						...this.state[this.state.selectedObject.objectID],
						chunkSize: event.target.value
					}
				})
			}
		}
	}

	addLevelWeight(event) {
		var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'];
		if (this.state.selectedObject.objectName != "Selected Sources") {
			if (numbers.includes(event.target.value[event.target.value.length - 1]) || event.target.value === '') {

				if (event.target.value[event.target.value.length - 1] === '-') {

					if (this.state[this.state.selectedObject.objectID].levelWeight.length === 0) {
						this.setState({

							[this.state.selectedObject.objectID]: {
								...this.state[this.state.selectedObject.objectID],
								levelWeight: event.target.value
							}
						})

					}


				}
				else {

					this.setState({

						[this.state.selectedObject.objectID]: {
							...this.state[this.state.selectedObject.objectID],
							levelWeight: event.target.value
						}
					})
				}
			}
		}
	}

	// * METHOD TO ADD GROUP BY ATTRIBUTE
	addGroupByAttribute(event) {
		//console.log(event.target.getAttribute('name'))
		if (event.target.value === "") {

			return
		}
		var selectedObject = this.state.selectedObject;
		var attributes = new Array();
		attributes = this.state[selectedObject.objectID].groupBy.attributes;

		var attributesLength = attributes.length;

		for (var i = 0; i < attributes.length; i++) {

			if (event.target.getAttribute('id') === attributes[i].ID) {

				return
			}
		}
		attributes.push({

			attributeName: event.target.value,
			ID: event.target.getAttribute('id'),
			columnName: event.target.getAttribute('name')
		})




		this.setState({

			[this.selectedObject.objectID]: {
				...this.state[this.selectedObject.objectID],
				groupBy: {

					attributes: attributes
				}
			}
		})


	}


	// * REMOVE GROUP BY ATTRIBUTE 

	removeGroupByAttribute(event) {

		var temp = this.state[this.state.selectedObject.objectID].groupBy.attributes;

		temp.map((attribute, index) => {

			if (event.target.getAttribute('id') === attribute.ID) {
				temp.splice(index, 1)
			}
		})

		this.setState({
			[this.state.selectedObject.objectID]: {

				...this.state[this.state.selectedObject.objectID],
				groupBy: {
					...this.state[this.state.selectedObject.objectID].groupBy,
					attributes: temp

				}
			}
		})
	}

	// * METHOD TO ADD ORDER BY ATTRIBUTE 

	addOrderByAttribute(event) {

		//console.log(event.target.getAttribute('name'))
		if (event.target.value === "") {

			return
		}
		var selectedObject = this.state.selectedObject;
		var attributes = new Array();
		attributes = this.state[selectedObject.objectID].orderBy.attributes;

		var attributesLength = attributes.length;

		for (var i = 0; i < attributes.length; i++) {

			if (event.target.getAttribute('id') === attributes[i].ID) {

				return
			}
		}
		attributes.push({

			attributeName: event.target.value,
			ID: event.target.getAttribute('id'),
			columnName: event.target.getAttribute('name'),
			order: {
				asc: true,
				desc: false
			}
		})


		this.setState({

			[this.selectedObject.objectID]: {
				...this.state[this.selectedObject.objectID],
				orderBy: {

					attributes: attributes
				}
			}
		})
	}
	// * METHOD TO REMOVE ORDER BY ATTRIBUTE

	removeOrderByAttribute(event) {

		var temp = this.state[this.state.selectedObject.objectID].orderBy.attributes;

		temp.map((attribute, index) => {

			if (event.target.getAttribute('id') === attribute.ID) {
				temp.splice(index, 1)
			}
		})

		this.setState({
			[this.state.selectedObject.objectID]: {

				...this.state[this.state.selectedObject.objectID],
				orderBy: {
					...this.state[this.state.selectedObject.objectID].orderBy,
					attributes: temp

				}
			}
		})

	}


	// * METHOD TO SELECT ORDER FOR ORDER BY

	toggleOrderForOrderBy(event) {



		if (event.target.getAttribute("component") === "asc") {
			if (event.target.checked) {
				alert("Return")
				return
			}
			alert("asc")

			var orderByAttributes = this.state[this.state.selectedObject.objectID].orderBy.attributes;
			orderByAttributes.map((attribute, index) => {

				if (attribute.ID === event.target.getAttribute("name")) {

					attribute.order.asc = true
					attribute.order.desc = false
					orderByAttributes[index] = attribute;

					this.setState({

						[this.state.selectedObject.objectID]: {
							...this.state[this.state.selectedObject.objectID],
							orderBy: {
								attributes: orderByAttributes
							}
						}
					})
				}

			})
		}
		if (event.target.getAttribute("component") === "desc") {


			var orderByAttributes = this.state[this.state.selectedObject.objectID].orderBy.attributes;
			orderByAttributes.map((attribute, index) => {

				if (attribute.ID === event.target.getAttribute("name")) {

					attribute.order.asc = false
					attribute.order.desc = true
					orderByAttributes[index] = attribute;

					this.setState({

						[this.state.selectedObject.objectID]: {
							...this.state[this.state.selectedObject.objectID],
							orderBy: {
								attributes: orderByAttributes
							}
						}
					})
				}

			})
		}
	}

	// * METHOD TO SET PARENT OBJECT FOR RELATIONSHIP
	setRelationShipParent(event) {
		if (this.state[this.state.selectedObject.objectID].relation.type != '') {

			alert('Please remove current relation first')
			return
		}
		//console.log(event.target.value)
		this.setState({
			...this.state,
			parentObject: {
				...event.target.value
			}
		})

		// * POST REQUEST TO GET NATIVE RELATIONS BETWEEN PARENT AND CHILD OBJECTS

		var parentObject = event.target.value.objectName;
		this.getNativeObjectsBetweenObjects(parentObject)


	}
	// * METHOD TO SEND POST REQUIEST TO GET NATIVE RELATIONS FOR OBJECTS
	getNativeObjectsBetweenObjects(parentObject) {
		var childObject = this.state.selectedObject.objectName;
		axios.post('http://localhost:9090/PVPUI/NativeRelationsBetweenObjects', `objects=${JSON.stringify({ childObject: childObject, parentObject: parentObject })}`, {
			headers: {
			}


		}).then((response) => {
			var parsedJson = JSON.parse(atob(response.data));
			//var parsedJson = JSON.parse(response.data)



			this.setState({
				...this.state,
				nativeRelations: parsedJson.nativeRelationsBetweenObjects
			})

		}).catch(e => {
			console.log(e)
		})
	}

	// * METHOD TO SET RECURSION FLAG
	toggleIsRecursionTrue(event) {

		this.setState({
			...this.state,
			[this.state.selectedObject.objectID]: {
				...this.state[this.state.selectedObject.objectID],
				relation: {

					...this.state[this.state.selectedObject.objectID].relation,
					isRecursionTrue: !this.state[this.state.selectedObject.objectID].relation.isRecursionTrue
				}
			}
		})
	}

	// * METHOD TO ADD NATIVE RELATION FOR SELECTED OBJECT
	addNativeRelation(event) {
		// * CHECK TO SEE IF USER DELETES THE RELATIONSHIP

		// * CHECK OF EXPLICIT RELATION IS ALREADY PRESENT
		if (this.state[this.state.selectedObject.objectID].relation.type === 'explicit') {

			alert('Explicit Relation is already present. Cannot apply relation')
			return
		}

		// * DELETING THE CURRENT NATIVE RELATION
		//console.log(this.state);
		if (event.target.value.length === 0) {

			var parentObject = this.state[this.state.selectedObject.objectID].relation.parentObject;
			var parentTo = new Array();
			parentTo = this.state[parentObject].parentTo;
			var indexToSplice = 0
			parentTo.map((attribute, index) => {

				if (attribute.objectName === this.state[this.state.selectedObject.objectID].objectName && attribute.level === this.state[this.state.selectedObject.objectID].level) {
					indexToSplice = index
				}
			})

			parentTo.splice(indexToSplice, 1);
			this.setState({

				[this.state.selectedObject.objectID]: {
					...this.state[this.state.selectedObject.objectID],
					relation: {
						...this.state[this.state.selectedObject.objectID].relation,
						parentLevelName: '',
						id: '',
						level: '',
						parentObject: '',
						type: '',
						native: '',
						isRecursionTrue: false

					}
				},
				[parentObject.objectID]: {
					...this.state[parentObject.objectID],
					parentTo: parentTo
				}
			})

			return
		}


		var parentObject = this.state.parentObject;
		var parentTo = new Array();
		var presentInParentTo = false;
		parentTo = this.state[parentObject.objectID].parentTo;

		parentTo.map((object) => {

			if (object.objectName === this.state[this.state.selectedObject.objectID].objectName && object.level === this.state[this.state.selectedObject.objectID].level) {

				presentInParentTo = true;
			}
		})
		if (!presentInParentTo) {
			parentTo.push({
				objectName: this.state[this.state.selectedObject.objectID].objectName,
				level: this.state[this.state.selectedObject.objectID].level,
				objectID: this.state[this.state.selectedObject.objectID].objectID
			})
		}

		// * NATIVE RELATION CAN HAVE ONLY ONE VALUE. BUT WE HAVE USED AN ARRAY BECAUSE WE HAVE USED MULTISELECT, WHICH REQUIRES AN ARRAY AS DATA. THIS ARRAY WOULD HOLD ONLY ONE VALUE
		var selectedNativeRelation = new Array();
		selectedNativeRelation.push(event.target.value[event.target.value.length - 1])
		this.setState({
			[this.state.selectedObject.objectID]: {
				...this.state[this.state.selectedObject.objectID],
				relation: {
					parentLevelName: parentObject.levelName,
					id: parentObject.id,
					level: parentObject.level,
					parentObject: parentObject.objectID,
					type: "native",
					native: selectedNativeRelation
				}
			},
			[parentObject.objectID]: {
				...this.state[parentObject.objectID],
				parentTo: parentTo
			}
		})

	}

	// * METHOD TO ADD CHILD ATTRIBUTE FOR EXPLICIT RELATION 
	addChildAttributeForExplicitRelation(event) {
		//console.log(event.target.value)
		//console.log(event.target)
		if (this.state[this.state.selectedObject.objectID].relation.type !== '') {
			alert('A relation already exists on this object')
			return
		}
		// * SAVING PARENT OBJECT TO RELATION DETAILS OF SELECTED OBJECT



		var attributeName = event.target.value.object + '.' + event.target.value.attributeName
		this.setState({
			...this.state,
			explicitRelation: {
				...this.state.explicitRelation,
				attribute: {
					...event.target.value
				},
				expression: this.state.explicitRelation.expression !== undefined ? this.state.explicitRelation.expression + attributeName : attributeName
			}
		})
	}

	// * METHOD TO ADD OPERATOR FOR EXPLICIT RELATION
	addOperatorForExplicitRelation(event) {

		if (this.state[this.state.selectedObject.objectID].relation.type !== '') {
			alert('A relation already exists on this object')
			return
		}
		//console.log(event.target.value)
		this.setState({
			...this.state,
			explicitRelation: {
				...this.state.explicitRelation,
				operator: {
					...event.target.value
				},
				expression: this.state.explicitRelation.expression + event.target.value.operator
			}
		})

	}

	addParentAttributeForExplicitRelation(event) {

		if (this.state[this.state.selectedObject.objectID].relation.type !== '') {
			alert('A relation already exists on this object')
			return
		}
		var attributeName = 'level' + event.target.value.level + '.' + event.target.value.attributeIndex
		this.setState({
			...this.state,
			explicitRelation: {
				...this.state.explicitRelation,
				parentAttribute: {
					...event.target.value
				},
				expression: this.state.explicitRelation.expression + attributeName
			}
		})
	}

	// * METHOD TO SAVE EXPLICIT RELATION

	saveExplicitRelation(event) {
		if (this.state[this.state.selectedObject.objectID].relation.type !== '') {

			alert('A relation already exists on this object')
			return
		}

		if (this.state.explicitRelation.attribute.attributeName === '' || this.state.explicitRelation.parentAttribute.level === '' || this.state.explicitRelation.operator.operator === '') {
			alert('Incomplete Relation')
			return
		}
		var parentTo = this.state[this.state.parentObject.objectID].parentTo;
		parentTo.push({
			objectName: this.state[this.state.selectedObject.objectID].objectName,
			level: this.state[this.state.selectedObject.objectID].level,
			objectID: this.state[this.state.selectedObject.objectID].objectID
		})
		this.setState({
			...this.state,
			[this.state.selectedObject.objectID]: {
				...this.state[this.state.selectedObject.objectID],
				relation: {
					...this.state[this.state.selectedObject.objectID].relation,
					parentLevelName: this.state.parentObject.levelName,
					id: this.state.parentObject.id,
					level: this.state.parentObject.level,
					parentObject: this.state.parentObject.objectID,
					type: "explicit",
					explicit: {
						...this.state.explicitRelation
					}
				}
			},
			[this.state.parentObject.objectID]: {
				...this.state[this.state.parentObject.objectID],
				parentTo: parentTo
			}
		})
		alert('Explicit Relation saved')
	}

	// * REMOVE EXPLICIT RELATION 
	removeExplictRelation(event) {

		if (this.state[this.state.selectedObject.objectID].relation.type !== 'explicit') {
			alert('Explicit relation is not added for this object')
			return
		}
		var parentTo = this.state[this.state.parentObject.objectID].parentTo;
		var indexToSplice = 0
		parentTo.map((attribute, index) => {

			if (attribute.objectName === this.state[this.state.selectedObject.objectID].objectName && attribute.level === this.state[this.state.selectedObject.objectID].level) {
				indexToSplice = index
			}
		})

		parentTo.splice(indexToSplice, 1);
		this.setState({
			[this.state.selectedObject.objectID]: {
				...this.state[this.state.selectedObject.objectID],
				relation: {
					parentLevelName: '',
					id: '',
					level: '',
					parentObject: '',
					type: '',
					explicit: {
						attribute: {

						},
						parentAttribute: {
							level: '',
							attributeIndex: ''
						},
						operator: {
							operator: '',

						},
						expression: ''

					}
				}
			},
			explicitRelation: {

				attribute: {
					attributeName: '',
					object: ''

				},
				parentAttribute: {
					level: '',
					object: '',
					attributeIndex: ''
				},
				operator: {
					operator: '',

				},
				expression: ''
			},
			[this.state.parentObject.objectID]: {
				...this.state[this.state.parentObject.objectID],
				parentTo: parentTo
			}
		})

	}
	parseMLVLevelWise(mlv) {
		//console.log()


		return mlv.replace(new RegExp('Level', 'g'), '\n\r Level')
	}

	saveMLVToParent(event) {
		if (this.props.parent === 'fetchFromAnotherSource') {
			this.props.saveMLVForFetchFromAnotherSource(this.state.mlv)
		}
		if (this.props.parent === 'insertMLV') {
			this.props.saveInsertMLV(this.state.mlv)
		}
		if (this.props.parent === 'fetchMLVForInsert') {
			this.props.saveFetchMLVForInsert(this.state.mlv, this.props.connInfoList[0].pluginName)
		}
		if(this.props.parent === 'fetchFromAnotherSourceForUpdate'){
			this.props.saveMLVForFetchFromAnotherSourceForUpdate(this.state.mlv)
		}
		if(this.props.parent === 'updateMLV'){
			this.props.saveUpdateMLV(this.state.mlv)
		}
		if(this.props.parent == 'fetchMLVForUpdate'){
			this.props.saveFetchMLVForUpdate(this.state.mlv, this.props.connInfoList[0].pluginName)
		}
		if(this.props.parent === 'deleteMLV'){
			this.props.saveDeleteMLV(this.state.mlv)
		}
		if(this.props.parent === 'fetchMLVForDelete'){
			this.props.saveFetchMLVForDelete(this.state.mlv,  this.props.connInfoList[0].pluginName)
		}
		if(this.props.parent === 'deleteAllMLV'){
			this.props.saveDeleteAllMLV(this.state.mlv)
		}
		if(this.props.parent === 'fetchFromAnotherSourceForDelete'){
			this.props.saveMLVForFetchFromAnotherSourceForDelete(this.state.mlv)
		}
	}
	createMLV(event) {
		event.preventDefault();
		this.isLoading();
		var stateJson = JSON.stringify(this.state);
		var requestData = {}
		this.state.selectedObjectList.map(object => {

			requestData[object.objectID] = this.state[object.objectID];

		})
		requestData['selectedObjectList'] = this.state.selectedObjectList;
		requestData['parallelExecution'] = this.state.parallelExecution;
		requestData['cache'] = this.state.cache;
		axios.post('http://localhost:9090/PVPUI/GenerateMLV', 'selectedObjectList=' + btoa(JSON.stringify(requestData)), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}


		}).then(response => {

			this.setState({
				...this.state,
				isLoading: false,
				mlv: this.parseMLVLevelWise(response.data)
			})
			if (this.props.parent == undefined)
				this.props.addMLV(response.data)
		})


	}

	// * METHOD TO TOGGLE PARALLEL EXECUTION
	enableParallelExecution(event) {
		event.preventDefault();
		this.setState({
			...this.state,
			parallelExecution: !this.state.parallelExecution

		})

	}

	// * METHOD TO HIDE, UNHIDE LEVEL
	hideLevel(event) {
		event.preventDefault();
		if (this.state.selectedObject.objectName !== "Selected Sources") {
			this.setState({
				[this.state.selectedObject.objectID]: {
					...this.state[this.state.selectedObject.objectID],
					hideLevel: !this.state[this.state.selectedObject.objectID].hideLevel
				}
			})
		}
	}

	// * METHOD TO ENABLE, DISABLE CACHE

	enableCache(event) {


		this.setState({

			...this.state,
			cache: {
				...this.state.cache,
				enabled: !this.state.cache.enabled
			}

		})


	}

	// * METHOD TO SET CACHE SETTING
	setCacheSetting(event) {
		if (this.state.cache.enabled) {
			this.setState({

				...this.state,
				cache: {
					...this.state.cache,
					setting: event.target.value
				}

			})
		}

	}

	// * METHOD TO SELECT SOURCE CONNECTION FOR MULTICONNECTION MLV
	selectSourceConnection(event) {

		// * CHECK IF THE SELECTED_OBJECT_LIST IS EMPTY, IF SO, ONLY BASE OBJECT CAN BE USED TO SELECT LEVEL 0

		if (this.state.selectedObjectList.length === 0) {

			if (event.target.value.connectionID != -1) {
				alert('Level 0 can only have source from base connection')
				return
			}
		}
		// * LOAD MODEL WITH CONNECTION_ID AS PROVIDED
		axios.post('http://localhost:9090/PVPUI/LoadModel', 'details=' + JSON.stringify({ connectionID: event.target.value.connectionID, pluginName: event.target.value.pluginName }), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}


		}).then(response => {
			var parsedJson = JSON.parse(atob(response.data))

			this.setState({
				objectList: parsedJson.objectList,
				selectedConnectionID: parsedJson.connectionID,

			})
		})
	}
	// * COMPONENT WILL UNMOUNT METHOD, TO TRANSFER ITS STATE TO PARENT COMPONENT (PVPUI COMPONENT)

	componentWillUnmount() {
		if (this.props.parent == undefined)

			this.props.loadMLVGeneratorState(this.state);
	}


	render() {
		console.log('STATE')
		console.log(this.state)

		if (this.state.selectedObject.objectName != "Selected Sources") //console.log(this.state[this.state.selectedObject])

			// * ADDING ALL THE ATTRIBUTES FOR SELECTED OBJECT 
			var totalAttributesElement = (this.state.selectedObject.objectName === "Selected Sources") ? "" :
				this.state.attributeListForSelectedObject.map((attribute) => {

					return (

						<option key={attribute} value={attribute}>{attribute}</option>
					)
				})

		// * ADDING TEXT INPUT FOR COLUMNS OF ATTRIBUTES< MAPPING THEM WITH SELECTED ATTRIBUTE OBJECT ARRAY OF SELECTED SOURCE
		if (this.state.selectedObject.objectName != "Selected Sources") {
			var attributesColumnsElement = "";
			var selectedAttributeListElement = "";
			if (this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] != undefined) {
				attributesColumnsElement = (this.state[this.state.selectedObject.objectID].attributes.length === 0 || this.state.selectedObject.objectName === "Selected Sources") ? "" :
					this.state[this.state.selectedObject.objectID].attributes.map((attribute, index) => {

						var objectName = this.state.selectedObject.objectName;

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

			if (this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] != undefined) {

				selectedAttributeListElement = (this.state[this.state.selectedObject.objectID].attributes.length === 0 || this.state.selectedObject.objectName === "Selected Sources") ? "" :
					this.state[this.state.selectedObject.objectID].attributes.map((attribute) => {

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

			if (this.state[this.state.selectedObject.objectID] === null || this.state[this.state.selectedObject.objectID] === undefined) {
				selectedAttributeElementSize = 3;
			} else {
				if (this.state[this.state.selectedObject.objectID].attributes.length === 0) {

					selectedAttributeElementSize = 1;
				} else {
					//alert(this.state[this.state.selectedObject].attributes.length)
					selectedAttributeElementSize = this.state[this.state.selectedObject.objectID].attributes.length + 3
				}
			}

		}

		// * COMPUTING PARENT OBJECTS FOR REALTION
		if (this.state.selectedObject.objectName !== "Select Sources") {
			var objectList = new Array();
			objectList = this.state.selectedObjectList;
			var indexOfSelectedObject = objectList.map(function(object) { return object.objectID; }).indexOf(this.state.selectedObject.objectID);
			var parentObjectsForRelation = new Array();
			//console.log(indexOfSelectedObject);
			for (var i = 0; i < indexOfSelectedObject; i++) {

				parentObjectsForRelation.push({
					objectName: objectList[i].objectName,
					id: i + 1,
					level: i,
					levelName: "level" + i,
					objectID: objectList[i].objectID
				})
			}
		}



		var loadingComponent = this.state.isLoading ? <LoadingPanel /> : ""
		var redirect = this.state.redirect ? (<Redirect to={{
			pathname: `/${this.state.location.pathname}`,

		}} />) : ''




		return (
			<div className="container-fluid" style={{ marginTop: "2em", marginBottom: '5em' }}>
				{loadingComponent}
				<div className=" row justify-content-center">
					<form className="form-inline" style={{ width: "50%" }}>
						{
							this.state.connInfoList.length > 1 &&
							(
								<DropDownList

									data={this.state.connInfoList}
									onChange={this.selectSourceConnection.bind(this)}
									style={{ width: '100%', marginTop: "1em" }}
									label='Select Source Connection'
									textField='pluginName'
									dataItemKey='connectionID'

								/>
							)
						}
						<Switch
								style={{ margin: "1em" }}
								checked={this.state.exactSearch}
								onChange={this.setExactSearch.bind(this)}
							/> Exact Search
						<DropDownList

							data={this.state.objectList}
							onChange={this.addSelectedObjectTry.bind(this)}
							style={{ width: '100%', marginTop: "1em" }}
							value={this.state.tempObject}
							label='Select Sources'
							filterable={true}
							onFilterChange={this.totalObjectListFilter.bind(this)}
						/>

						<MultiSelect
							placeholder="Selected Sources"
							value={this.state.selectedObjectList}
							onChange={this.removeSelectedObject.bind(this)}
							textField='objectName'
							dataItemKey='objectID'
							loading={this.state.loading}
							onChange={this.removeSelectedObject.bind(this)}
							style={{ width: '100%', marginTop: "1em" }}
						/>

						<br />
						<DropDownList

							data={this.state.selectedObjectList}
							onChange={this.selectedObject.bind(this)}
							style={{ width: '100%', marginTop: "1em" }}
							value={this.state.selectedObject}
							textField='objectName'
							dataItemKey='objectID'

						/>

					</form>
				</div>
				<div className="row" style={{ marginTop: "2em" }}>
					<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

						<PanelBar >
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Select Attributes</i>}>

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
								<PanelBarItem title={<i style={{ fintSize: "14px" }}>Add custom Attrbutes</i>}>
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
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Details</i>}>
								<div className="row justify-content-center">
									<div className="col-lg-2 justify-content-center">
										<Button
											style={{ margin: "1em" }}
											onClick={this.hideLevel.bind(this)}>
											Hide Level
											</Button>
										<Switch
											style={{ margin: "1em" }}
											checked={
												this.state.selectedObject.objectName != "Selected Sources" ?
													this.state[this.state.selectedObject.objectID].hideLevel : false
											}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-6">
										<Input

											label="Fetch Size"
											value={this.state[this.state.selectedObject.objectID] === null || this.state[this.state.selectedObject.objectID] === undefined ? "" : this.state[this.state.selectedObject.objectID].fetchSize}
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.addFetchSize.bind(this)}

										/>
										<Input

											label="Chunk Size"
											value={this.state[this.state.selectedObject.objectID] === null || this.state[this.state.selectedObject.objectID] === undefined ? "" : this.state[this.state.selectedObject.objectID].chunkSize}
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.addChunkSize.bind(this)}

										/>
									</div>
									<div className="col-lg-6">
										<Input

											label="Level Weight"
											value={this.state[this.state.selectedObject.objectID] === null || this.state[this.state.selectedObject.objectID] === undefined ? "" : this.state[this.state.selectedObject.objectID].levelWeight}
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
											onChange={this.addLevelWeight.bind(this)}

										/>
										<Input

											label="Delimiter"
											value={this.state[this.state.selectedObject.objectID] === null || this.state[this.state.selectedObject.objectID] === undefined ? "" : this.state[this.state.selectedObject.objectID].delimiter}
											style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}


										/>
									</div>
								</div>

								<PanelBarItem title={<i style={{ fontSize: "14px" }}>Add Predicate</i>}>
									<div className="row">
										<div className="col-lg-11" tabIndex="0">
											<Input
												value={this.state[this.state.selectedObject.objectID] == null || this.state[this.state.selectedObject.objectID] == undefined ? "" : this.state[this.state.selectedObject.objectID].predicate}
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
												{(this.state.selectedObject.objectName !== "Selected Sources") &&
													this.state.attributeListForSelectedObject.map((attribute) => {

														return (

															<option key={attribute} value={this.state[this.state.selectedObject.objectID].objectName + '.' + attribute}>{this.state[this.state.selectedObject.objectID].objectName + '.' + attribute}</option>
														)
													})
												}
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
								<PanelBarItem title={<i style={{ fontSize: "14px" }}>Group By</i>}>

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

													(this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] && this.state.selectedObject.objectName != "Selected Sources") ?

														this.state[this.state.selectedObject.objectID].attributes.map((attribute) => {

															for (var i = 0; i < this.state[this.state.selectedObject.objectID].groupBy.attributes.length; i++) {

																if (attribute.columnName === this.state[this.state.selectedObject.objectID].groupBy.attributes[i].columnName) {


																} else {



																}
															}

															return (


																<option
																	key={attribute.ID}
																	id={attribute.ID}
																	name={attribute.columnName}
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

													(this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] && this.state.selectedObject.objectName != "Selected Sources") ?

														this.state[this.state.selectedObject.objectID].groupBy.attributes.map((attribute) => {

															return (


																<option
																	key={attribute.ID}
																	id={attribute.ID}
																	name={attribute.columnName}
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
								<PanelBarItem title={<i style={{ fontSize: "14px" }}>Order By</i>}>
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

													(this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] && this.state.selectedObject.objectName != "Selected Sources") ?

														this.state[this.state.selectedObject.objectID].attributes.map((attribute) => {


															return (


																<option
																	key={attribute.ID}
																	id={attribute.ID}
																	name={attribute.columnName}
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

													(this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] && this.state.selectedObject.objectName != "Selected Sources") ?

														this.state[this.state.selectedObject.objectID].orderBy.attributes.map((attribute) => {

															return (


																<option
																	key={attribute.ID}
																	id={attribute.ID}
																	name={attribute.columnName}
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

												(this.state[this.state.selectedObject.objectID] != null && this.state[this.state.selectedObject.objectID] && this.state.selectedObject.objectName != "Selected Sources") ?

													this.state[this.state.selectedObject.objectID].orderBy.attributes.map((attribute) => {
														//console.log(attribute)
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
							{this.state.selectedObjectList.map(function(object) { return object.objectID; }).indexOf(this.state.selectedObject.objectID) <= 0 ? "" :

								<PanelBarItem title={<i style={{ fontSize: "16px" }}>Add Relation</i>}>

									<div className="row justify-content-center align-items-start">
										<DropDownList
											defaultValue={{ levelName: "Parent Level", id: 0 }}
											data={parentObjectsForRelation}
											textField='levelName'
											dataItemKey="id"
											style={{ margin: "0.5em" }}
											onChange={this.setRelationShipParent.bind(this)}
											value={this.state.parentObject}

										/>
									</div>
									<PanelBarItem title={<i style={{ fontSize: "14px" }}>Native Relations</i>}>
										<div className="row justify-content-center">
											<div className="col-lg-2">
												<Button
													style={{ margin: "1em" }}
													onClick={this.toggleIsRecursionTrue.bind(this)}>
													Recursion
											</Button>
												<Switch
													style={{ margin: "1em" }}
													checked={
														this.state.selectedObject.objectName != "Selected Sources" ?
															this.state[this.state.selectedObject.objectID].relation.isRecursionTrue : false
													}
												/>
											</div>


											<div className="col-lg-4 justify-content-center">
												<MultiSelect
													placeholder={"Native Relations"}
													data={this.state.nativeRelations}
													style={{ margin: "1em", width: '100%' }}
													onChange={this.addNativeRelation.bind(this)}
													value={this.state[this.state.selectedObject.objectID].relation.native}
												/>
											</div>
										</div>
									</PanelBarItem>
									<PanelBarItem title={<i style={{ fontSize: "14px" }}>Explicit Relations</i>}>

										<div className="row justify-content-center">
											<div className="col-lg-10 justify-content-center">
												<Input
													placeholder="Explicit Relation"
													style={{ width: "100%", textAlign: "center", margin: "1em" }}
													value={
														this.state[this.state.selectedObject.objectID].relation.type !== 'explicit' ?
															(this.state.explicitRelation.attribute.object + '.' + this.state.explicitRelation.attribute.attributeName + this.state.explicitRelation.operator.operator + this.state.explicitRelation.parentAttribute.level + '.' + this.state.explicitRelation.parentAttribute.attributeIndex) : (
																this.state[this.state.selectedObject.objectID].relation.explicit.attribute.object + '.' + this.state[this.state.selectedObject.objectID].relation.explicit.attribute.attributeName + this.state[this.state.selectedObject.objectID].relation.explicit.operator.operator + this.state[this.state.selectedObject.objectID].relation.explicit.parentAttribute.level + '.' + this.state[this.state.selectedObject.objectID].relation.explicit.parentAttribute.attributeIndex)
													}
												/>
											</div>
											<div classNam="col-lg-2">
												<Button
													style={{ margin: "1em" }}
													onClick={this.saveExplicitRelation.bind(this)}
												>
													Add
												</Button>
												<Button
													style={{ margin: "1em" }}
													onClick={this.removeExplictRelation.bind(this)}
												>
													Remove
												</Button>
											</div>
										</div>
										<div className="row">
											<div className="col-lg-5">

												<DropDownList
													data={this.state.selectedObject.objectName != "Select Sources" ?
														this.state[this.state.selectedObject.objectID].attributes.map((attribute, index) => {
															return (

																{
																	key: attribute.ID,
																	id: index,
																	attributeName: attribute.attributeName,
																	object: this.state[this.state.selectedObject.objectID].objectName,
																	objectID: this.state[this.state.selectedObject.objectID].objectID

																}

															)
														}) : []}
													textField="attributeName"
													dataItemKey="id"
													style={{ width: "100%" }}
													label="Select Attribute"
													onChange={this.addChildAttributeForExplicitRelation.bind(this)}
													value={
														this.state[this.state.selectedObject.objectID].relation.type !== 'explicit' ? (
															this.state.explicitRelation.attribute
														) : (
																this.state[this.state.selectedObject.objectID].relation.explicit.attribute
															)
													}

												/>
											</div>
											<div className="col-lg-2">

												<DropDownList
													data={
														Constants.Constants.MLVOperators.map((operator, index) => {
															return (

																{

																	id: index,
																	operator: operator,


																}

															)
														})}
													dataItemKey="id"
													textField="operator"
													style={{ width: "100%" }}
													label="Select Operator"
													onChange={this.addOperatorForExplicitRelation.bind(this)}
													value={
														this.state[this.state.selectedObject.objectID].relation.type !== 'explicit' ? (
															this.state.explicitRelation.operator
														) : (
																this.state[this.state.selectedObject.objectID].relation.explicit.operator
															)
													}
												/>
											</div>
											<div className="col-lg-5">

												<DropDownList
													data={this.state.parentObject.id !== 0 ?
														this.state[this.state.parentObject.objectID].attributes.map((attribute, index) => {
															return (

																{
																	// key property can be used to compare the attribute while deleting attributes
																	key: attribute.ID,
																	id: index,
																	attributeName: attribute.attributeName,

																	object: this.state[this.state.parentObject.objectID].objectName,
																	objectID: this.state[this.state.parentObject.objectID].objectID,
																	attributeIndex: (index + 1),
																	level: 'level' + this.state.selectedObjectList.map((object) => { return object.objectID }).indexOf(this.state.parentObject.objectID)
																}

															)
														}) : []}
													textField="attributeName"
													dataItemKey="id"
													style={{ width: "100%" }}
													label="Select Attribute"
													onChange={this.addParentAttributeForExplicitRelation.bind(this)}
													value={
														this.state[this.state.selectedObject.objectID].relation.type !== 'explicit' ? (
															this.state.explicitRelation.parentAttribute
														) : (
																this.state[this.state.selectedObject.objectID].relation.explicit.parentAttribute
															)
													}
												/>
											</div>
										</div>




									</PanelBarItem>

								</PanelBarItem>
							}
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Global Properties</i>}>

								<div className="row">
									<div className="col-lg-6">
										<Button
											style={{ margin: "1em" }}
											onClick={this.enableParallelExecution.bind(this)}>
											Parallel Execution
											</Button>
										<Switch
											style={{ margin: "1em" }}
											checked={

												this.state.parallelExecution
											}
										/>
										<Button
											style={{ margin: "1em" }}
											onClick={this.enableCache.bind(this)}>
											Cache Enabled
											</Button>
										<Switch
											style={{ margin: "1em" }}
											checked={

												this.state.cache.enabled
											}
										/>
										<DropDownList
											data={Constants.CacheTypes}
											style={{ marginLeft: "1em" }}
											value={

												this.state.cache.setting
											}
											onChange={this.setCacheSetting.bind(this)}
										/>

									</div>
								</div>
							</PanelBarItem>
						</PanelBar>
						<div className="row" style={{ marginTop: '1em' }}>
							<div className="col-lg-6">

								<Button onClick={this.createMLV.bind(this)}>
									Generate MLV
								</Button>
							</div>
							<div className="col-lg-6">
								<Button onClick={this.showGridView.bind(this)}>
									Grid View
								</Button>
							</div>
						</div>
						<div className="row" style={{ marginTop: '1em' }}>
							<div className="col-lg-12">

								<textarea
									label="MLV"
									class="form-control rounded-0"
									id="exampleFormControlTextarea1"
									rows="5" value={this.state.mlv}
									onChange={this.parseMLV.bind(this)}
								>
								</textarea>
							</div>
						</div>
						{this.props.parent != undefined &&
							<div className="row" style={{ marginTop: '1em' }}>
								<div className="col-lg-6">
									<Button onClick={this.saveMLVToParent.bind(this)}>
										Save
								</Button>
								</div>
							</div>
						}

					</div>
					{
						this.state.showGridView &&
						<div className="fixed-bottom" style={{ width: "100%", height: '50%', marginBottom: '15em' }}>
							<div className="row justify-content-right">
								<div className='col-lg-2'></div>
								<div className='col-lg-2'></div>
								<div className='col-lg-2'></div>
								<div className='col-lg-2'></div>
								<div className='col-lg-1'></div>
								<div className='col-lg-1'>
									<Button
										primary={true}
										style={{ margin: "1em" }}
										onClick={this.closeGridView.bind(this)}
									>
										Close
						</Button>
								</div>
							</div>

							<div style={{ overflowX: "scroll" }}>
								<Grid
									style={{ height: "40em", overflowX: "scroll" }}
									data={this.state.gridView.gridViewData}
									resizable={true}

								>
									<Column
										field="Source"
										title="Source"
										width="250px"
									/>
									<Column
										field="Level"
										title="Level"
										width="250px"
									/>
									<Column
										field="relation"
										title="Relation"
										width="250px"
									/>
									{
										this.state.gridView.columns.map(column => {
											return (
												<Column
													field={column}
													title={column}
													width="250px"
												/>
											)
										})
									}
								</Grid>
							</div>
						</div>
					}
				</div>
			</div>
		)
	}


	sourceRegex = new RegExp(/(?<=src\s*?=)(.*?)(?=;)/);
	attributeNamesRegex = new RegExp(/(?<=attvalues\s*?=)(.*?)(?=;)/);
	delimiterRegex = new RegExp(/(?<=DELIMITER\s*?=)(.*?)(?=;)/);
	mlvLevelNameRegex = new RegExp(/(?<=MLVLEVELNAME\s*?=)(.*?)(?=;)/);
	relationRegex = new RegExp(/(?<=Relation\s*?{)(.*?)(?=})/);
	relationNameRegex = new RegExp(/(?<=relname\s*?=)(.*?)(?=;)/);
	isRecursionTrueRegex = new RegExp(/(?<=CONTAINS_PARENT_ITEM\s*?=)(.*?)(?=;)/);
	relationshipRegex = new RegExp(/(?<=relationship\s*?=)(.*?)(?=;)/);
	relationTypeRegex = new RegExp(/(?<=relationtype\s*?=)(.*?)(?=;)/);
	predicateRegex = new RegExp(/(?<=predicate\s*?=)(.*?)(?=;)/);
	attributeSplitReges = new RegExp();
	parseMLV(event) {
		var mlv = event.target.value.replace('Level', "Level".fontcolor("red"));


		if (event.target.value != '') {
			var mlvState = {};
			var selectedObjectList = new Array();
			var mlvDetailsString = event.target.value.split('Level')[0].trim();
			var attributeNames = mlvDetailsString.split('attributes')[1].trim().split('=')[1].trim().split(';')[0].split(',')
			var attributeIndex = 0;
			var levelStringsArray = event.target.value.split('Level')
			levelStringsArray.splice(0, 1)
			//var index = this.findClosingBracket(levelStringsArray[0].trim(),levelStringsArray[0].trim().indexOf('{'))
			levelStringsArray.map(level => {
				// * THIS IS ENTIRE LEVEL STRING. FETCH INDEX OF LAST CLOSING CURLY BRACE AND GET SUBSTRING FROM THE OPENING AND CLOSING CURLY BRACES FOR LEVEL DETAILS
				var levelString = level.substring(
					level.indexOf('{') + 1, this.findClosingBracket(level, level.indexOf('{'))
				)

				//console.log(levelString)
				// * FETCH SOURCE_NAME FROM THE LEVEL STRING
				var source = levelString.match(this.sourceRegex)[0].trim();
				// * ADDING SOURCE TO SELECTED_OBJECT_LIST
				var indexOfSource = selectedObjectList.length;
				var objectID = indexOfSource + '_' + new Date().getTime();
				selectedObjectList.push({
					objectName: source,
					objectID: objectID
				})
				// * ADDIND SOURCE OBJECT TO STATE 
				mlvState = {
					...mlvState,
					[objectID]: {
						objectID: objectID,
						objectName: source,
						level: indexOfSource,
						levelExpresion: '',
						attributes: [],
						predicate: "",
						fetchSize: "",
						chunkSize: "",
						levelWeight: -1,
						delimiter: '',
						groupBy: {
							attributes: []
						},
						orderBy: {
							attributes: [],

						},
						relation: {

							parentLevelName: '',
							id: '',
							level: '',
							parentObject: '',
							type: '',
							native: '',
							isRecursionTrue: false,
							explicit: {
								attribute: {

								},
								parentAttribute: {
									level: '',
									attributeIndex: ''
								},
								operator: {
									operator: '',

								},
								expression: ''

							}


						},
						parentTo: [],

						hideLevel: false,
						connectionID: this.state.selectedConnectionID

					}
				}
				// * GET ATTRIBUTE_NAMES FROM attvalues expression
				var attvaluesArray = levelString.match(this.attributeNamesRegex)[0].split(',');
				var attributeValuesArray = new Array();
				attvaluesArray.map((attvalue, index) => {
					if (attvalue.trim() != "null") {
						if (attvalue.includes('.') && attvalue.split('.')[0].trim() === source) {
							console.log(attvalue.split('.')[0].trim())
							console.log(source)
							var attributeName = attvalue.split('.')[1].trim()
						}
						else
							var attributeName = attvalue;
						var temp = {
							attributeName: attributeName,
							columnName: attributeNames[index],
							ID: attributeName + '_' + new Date().getTime()
						}
						attributeValuesArray.push(temp);
						attributeIndex++;
					}
				})
				console.log(attributeValuesArray)


				var delimiter = levelString.match(this.delimiterRegex)[0].trim();

				var mlvLevelName = levelString.match(this.mlvLevelNameRegex)[0].trim();
				var predicate = '';
				if (levelString.search('predicate') > -1) {
					predicate = levelString.match(this.predicateRegex)[0].trim();
				}

				// * CHECK IF RELATION IS PRESENT
				if (levelString.search('Relation') > -1) {
					var relationString = levelString.match(this.relationRegex)[0];
					var relationName = relationString.match(this.relationNameRegex)[0].trim();
					var parentLevel = relationName.split('.')[0].trim();
					var parentIndex = parseInt(parentLevel[parentLevel.length - 1]);
					var parentObjectID = selectedObjectList[parentIndex].objectID;
					var isRecursionTrue = relationString.match(this.isRecursionTrueRegex)[0].trim();
					var relationship = relationString.match(this.relationshipRegex)[0].trim();
					console.log(relationString.match(this.relationTypeRegex));
					var relationType = relationString.match(this.relationTypeRegex)[0].trim();
					var relation = {

						parentLevelName: parentLevel,
						id: parentIndex + 1,
						level: parentLevel,
						parentObject: parentObjectID,
						type: relationType,
						native: [relationship], // PUTTING NATIVE RELATION NAME IN ARRAY BECAUSE WE HAVE USED A MULTISELECT LIST TO DISPLAY
						isRecursionTrue: false,
						explicit: {
							attribute: {

							},
							parentAttribute: {
								level: '',
								attributeIndex: ''
							},
							operator: {
								operator: '',

							},
							expression: ''

						}


					}

					// * MODIFYING PARENT_TO ARRAY OF THE PARENT AND ADDING CHILD OBJECT IN IT
					var parentTo = mlvState[parentObjectID].parentTo;
					parentTo.push({
						objectName: source,
						objectID: objectID,
						level: indexOfSource
					})

					mlvState = {
						...mlvState,
						[objectID]: {
							...mlvState[objectID],
							relation: {
								...relation
							}
						},
						[parentObjectID]: {
							...mlvState[parentObjectID],
							parentTo: parentTo
						}
					}
				}

				// SETTING ATTRIBUTES FOR THE OBJECT IN STATE OBJECT
				mlvState = {
					...mlvState,
					[objectID]: {
						...mlvState[objectID],
						attributes: attributeValuesArray,
						delimiter: delimiter,
						predicate: predicate

					}
				}




			})
			mlvState = {
				...mlvState,
				selectedObjectList: selectedObjectList
			}
			//console.log(mlvState)
			this.setState({
				...this.state,
				...mlvState
			})
		}


	}


	findClosingBracket(str, pos) {
		var rExp = /\{|\}/g;
		rExp.lastIndex = pos + 1;
		var deep = 1;
		while ((pos = rExp.exec(str))) {
			if (!(deep += str[pos.index] === "{" ? 1 : -1)) { return pos.index }
		}
	}

	// METHOD TO SHOW GRID SUMMARY FOR MLV
	showGridView(event) {
		event.preventDefault();
		var selectedObjectList = this.state.selectedObjectList;
		var columnsArray = new Array();
		var gridViewData = new Array();
		// * GET ALL THE COLUMN NAMES FROM ALL THE SELECTED OBJECTS
		selectedObjectList.map(selectedObject => {
			var temp = {}
			temp['Source'] = this.state[selectedObject.objectID].objectName;
			temp['Level'] = 'level ' + this.state[selectedObject.objectID].level;
			if (this.state[selectedObject.objectID].relation.type != '') {
				switch (this.state[selectedObject.objectID].relation.type) {
					case 'NATIVE':
						temp['relation'] = this.state[selectedObject.objectID].relation.native[0]
						break;

					case 'explicit':
						temp['relation'] = this.state[selectedObject.objectID].relation.explicit.expression
						break;
				}
			}


			var attributeList = this.state[selectedObject.objectID].attributes;
			attributeList.map(attribute => {
				columnsArray.push(attribute.columnName)
				temp[attribute.columnName] = attribute.attributeName
			})
			gridViewData.push(temp)
		})

		this.setState({
			...this.state,
			gridView: {
				columns: columnsArray,
				gridViewData: gridViewData
			},
			showGridView: true
		})

		/* COMPONENTS FOR GRID_VIEW_DATA
			*OBJECT NAME
			*LEVEL
			*RELATION
			*[ATTRIBUTES]
		*/


	}

	closeGridView(event) {
		event.preventDefault();
		this.setState({
			...this.state,
			showGridView: false
		})
	}

}