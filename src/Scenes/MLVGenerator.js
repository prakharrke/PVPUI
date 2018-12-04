import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { MultiSelect, AutoComplete } from '@progress/kendo-react-dropdowns';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { filterBy } from '@progress/kendo-data-query';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import LoadingPanel from './Components/LoadingPanel'
import { Button } from '@progress/kendo-react-buttons';
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
			customAttribute: "",
			parentObjectsForRelation: [],
			parentObject: {
				levelName: "Select Parent",
				id: 0,
				level: '',
				objectName: '',
				nativeRelations: []
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
			}

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

		// * UPDATING PARENT OBJECT SAVED IN STATE SO THAT THE CURRENTLY SELECTED OBJECT CAN RENDER WITH NEWLY SET PARENT OBJECT OF ITS RELATION
		if (this.state.selectedObject !== "Selected Sources" && this.state[this.state.selectedObject].relation.parentObject === this.state.parentObject.objectName && this.state[this.state.selectedObject].relation.level !== this.state.parentObject.level) {

			console.log(this.state[this.state.selectedObject])
			console.log(this.state.parentObject)
			var newParentObject = {
				...this.state.parentObject,
				level: this.state[this.state.selectedObject].relation.level,
				levelName: this.state[this.state.selectedObject].relation.parentLevelName,
				id: this.state[this.state.selectedObject].relation.id
			}
			this.setState({
				...this.state,
				parentObject: newParentObject
			})
		}


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
					var objectToBeDeleted = temp[objectName];
					if (objectToBeDeleted.parentTo.length !== 0 || objectToBeDeleted.relation.type !== '') {

						alert('Object is in a relation. Cannot delete')

					} else {
						updatedObjectList.splice(index, 1);
						console.log('Hre')
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
						console.log(parentObject);
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
		/*
		* UPDATING PARENT LEVEL TAG'S VALUE TO SELECTED RELATION PARENT LEVEL IF IT IS SET, OTHERWISE TO DEFAULT VALUE
		* SETTING EXPLICIT RELATION GLOBAL STATE TO EMPTY
		*/


		if (this.state[event.target.value].relation.type === '') {

			this.setState({

				...this.state,
				parentObject: {
					levelName: "Parent level",
					id: 0,
					level: '',
					objectName: ''


				},
				selectedObject: event.target.value,
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
						attributeIndex: ''
					},
					operator: {
						operator: '',
						id: ''
					}
				}
			})
		} else {
			// * FIRST SETTING NATIVE RELATIONS FOR LEVEL SAVED AS PARENT IN THE SELECTED OBJECT
			this.getNativeObjectsBetweenObjects(this.state[event.target.value].relation.parentObject)

			this.setState({

				...this.state,
				selectedObject: event.target.value,
				parentObject: {
					levelName: this.state[event.target.value].relation.parentLevelName,
					level: this.state[event.target.value].relation.level,
					id: this.state[event.target.value].relation.id,
					objectName: this.state[event.target.value].relation.parentObject
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
		var groupByAttributes = this.state[this.state.selectedObject].groupBy.attributes;
		var orderByAttributes = this.state[this.state.selectedObject].orderBy.attributes;

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

			[this.state.selectedObject]: {

				...this.state[this.state.selectedObject],
				attributes: temp,
				groupBy: {
					...this.state[this.state.selectedObject].groupBy,
					attributes: groupByAttributes
				},
				orderBy: {
					...this.state[this.state.selectedObject].orderBy,
					attributes: orderByAttributes
				}
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
				console.log(attribute.ID)
				// * CHECK IF THIS ATTRIBUTE HAS EXPLICIT RELATION WITH ANOTHER OBJECT, BOTH ARE PARENT AND CHILD
				if (this.state[this.state.selectedObject].relation.type === 'explicit' && this.state[this.state.selectedObject].relation.explicit.attribute.key === attribute.ID) {
					alert('This attribute is involved in explicit relation.')
					return;
				}

				// * CHECK IF ANY OBJECT WITH EXPLICIT RELATION HAS THIS OBJECT AS PARENT
				var isAttributeParent = false;
				var isGroupByAttribute = false;
				var isOrderByAttribute = false;
				this.state.selectedObjectList.map((objectName) => {

					if (this.state[objectName].relation.type === 'explicit') {

						if (this.state[objectName].relation.explicit.parentAttribute.key === attribute.ID) {

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

				this.state[this.state.selectedObject].groupBy.attributes.map((groupByAttribute) => {
					if (groupByAttribute.ID === attribute.ID) {
						isGroupByAttribute = true;
					}
				})

				if (isGroupByAttribute) {
					alert('Attribute has group by constraint on it. Cannot delete')
					return;
				}

				// * CHECK IF ATTRIBUTE IS PART OF ORDER BY
				this.state[this.state.selectedObject].orderBy.attributes.map((orderByAttribute) => {
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

			if (event.target.getAttribute('id') === attribute.ID) {
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
			if (event.target.checked) {
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

	// * METHOD TO SET PARENT OBJECT FOR RELATIONSHIP
	setRelationShipParent(event) {
		if (this.state[this.state.selectedObject].relation.type != '') {

			alert('Please remove current relation first')
			return
		}
		console.log(event.target.value)
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
		var childObject = this.state.selectedObject;
		axios.post('http://localhost:9090/PVPUI/NativeRelationsBetweenObjects', JSON.stringify({ childObject: childObject, parentObject: parentObject }), {
			headers: {
			}


		}).then((response) => {

			this.setState({
				...this.state,
				nativeRelations: response.data.nativeRelationsBetweenObjects
			})

		})
	}

	// * METHOD TO ADD NATIVE RELATION FOR SELECTED OBJECT
	addNativeRelation(event) {

		// * CHECK OF EXPLICIT RELATION IS ALREADY PRESENT
		if (this.state[this.state.selectedObject].relation.type === 'explicit') {

			alert('Explicit Relation is already present. Cannot apply relation')
			return
		}

		// * DELETING THE CURRENT NATIVE RELATION

		if (event.target.value.length === 0) {

			var parentObject = this.state[this.state.selectedObject].relation.parentObject;
			var parentTo = new Array();
			parentTo = this.state[parentObject].parentTo;
			var indexToSplice = 0
			parentTo.map((attribute, index) => {

				if (attribute.objectName === this.state[this.state.selectedObject.objectName] && attribute.level === this.state[this.state.selectedObject].level) {
					indexToSplice = index
				}
			})

			parentTo.splice(indexToSplice, 1);
			this.setState({

				[this.state.selectedObject]: {
					...this.state[this.state.selectedObject],
					relation: {
						...this.state[this.state.selectedObject].relation,
						parentLevelName: '',
						id: '',
						level: '',
						parentObject: '',
						type: '',
						native: '',

					}
				},
				[parentObject]: {
					...this.state[parentObject],
					parentTo: parentTo
				}
			})

			return
		}


		var parentObject = this.state.parentObject;
		var parentTo = new Array();
		var presentInParentTo = false;
		parentTo = this.state[parentObject.objectName].parentTo;

		parentTo.map((object) => {

			if (object.objectName === this.state[this.state.selectedObject].objectName && object.level === this.state[this.state.selectedObject].level) {

				presentInParentTo = true;
			}
		})
		if (!presentInParentTo) {
			parentTo.push({
				objectName: this.state[this.state.selectedObject].objectName,
				level: this.state[this.state.selectedObject].level
			})
		}

		// * NATIVE RELATION CAN HAVE ONLY ONE VALUE. BUT WE HAVE USED AN ARRAY BECAUSE WE HAVE USED MULTISELECT, WHICH REQUIRES AN ARRAY AS DATA. THIS ARRAY WOULD HOLD ONLY ONE VALUE
		var selectedNativeRelation = new Array();
		selectedNativeRelation.push(event.target.value[event.target.value.length - 1])
		this.setState({
			[this.state.selectedObject]: {
				...this.state[this.state.selectedObject],
				relation: {
					parentLevelName: parentObject.levelName,
					id: parentObject.id,
					level: parentObject.level,
					parentObject: parentObject.objectName,
					type: "native",
					native: selectedNativeRelation
				}
			},
			[parentObject.objectName]: {
				...this.state[parentObject.objectName],
				parentTo: parentTo
			}
		})

	}

	// * METHOD TO ADD CHILD ATTRIBUTE FOR EXPLICIT RELATION 
	addChildAttributeForExplicitRelation(event) {
		if (this.state[this.state.selectedObject].relation.type !== '') {
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
				expression: this.state.explicitRelation.expression + attributeName
			}
		})
	}

	// * METHOD TO ADD OPERATOR FOR EXPLICIT RELATION
	addOperatorForExplicitRelation(event) {

		if (this.state[this.state.selectedObject].relation.type !== '') {
			alert('A relation already exists on this object')
			return
		}
		console.log(event.target.value)
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

		if (this.state[this.state.selectedObject].relation.type !== '') {
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
		if (this.state[this.state.selectedObject].relation.type !== '') {

			alert('A relation already exists on this object')
			return
		}

		if (this.state.explicitRelation.attribute.attributeName === '' || this.state.explicitRelation.parentAttribute.level === '' || this.state.explicitRelation.operator.operator === '') {
			alert('Incomplete Relation')
			return
		}
		var parentTo = this.state[this.state.parentObject.objectName].parentTo;
		parentTo.push({
			objectName: this.state[this.state.selectedObject].objectName,
			level: this.state[this.state.selectedObject].level
		})
		this.setState({
			...this.state,
			[this.state.selectedObject]: {
				...this.state[this.state.selectedObject],
				relation: {
					...this.state[this.state.selectedObject].relation,
					parentLevelName: this.state.parentObject.levelName,
					id: this.state.parentObject.id,
					level: this.state.parentObject.level,
					parentObject: this.state.parentObject.objectName,
					type: "explicit",
					explicit: {
						...this.state.explicitRelation
					}
				}
			},
			[this.state.parentObject.objectName]: {
				...this.state[this.state.parentObject.objectName],
				parentTo: parentTo
			}
		})
		alert('Explicit Relation saved')
	}

	// * REMOVE EXPLICIT RELATION 
	removeExplictRelation(event) {

		if (this.state[this.state.selectedObject].relation.type !== 'explicit') {
			alert('Explicit relation is not added for this object')
			return
		}
		var parentTo = this.state[this.state.parentObject.objectName].parentTo;
		var indexToSplice = 0
		parentTo.map((attribute, index) => {

			if (attribute.objectName === this.state[this.state.selectedObject.objectName] && attribute.level === this.state[this.state.selectedObject].level) {
				indexToSplice = index
			}
		})

		parentTo.splice(indexToSplice, 1);
		this.setState({
			[this.state.selectedObject]: {
				...this.state[this.state.selectedObject],
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
			[this.state.parentObject.objectName]: {
				...this.state[this.state.parentObject.objectName],
				parentTo: parentTo
			}
		})

	}
	createMLV(event) {
		event.preventDefault();
		axios.post('http://localhost:9090/PVPUI/GenerateMLV', `state=${btoa(JSON.stringify(this.state))}`, {
			headers: {
			}


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
		if (this.state.selectedObject !== "Selected Sources") {
			this.setState({
				[this.state.selectedObject]: {
					...this.state[this.state.selectedObject],
					hideLevel: !this.state[this.state.selectedObject].hideLevel
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


	render() {
		console.log(this.state)

		if (this.state.selectedObject != "Selected Sources") console.log(this.state[this.state.selectedObject])

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

		// * COMPUTING PARENT OBJECTS FOR REALTION
		if (this.state.selectedObject !== "Select Sources") {
			var objectList = new Array();
			objectList = this.state.selectedObjectList;
			var indexOfSelectedObject = objectList.indexOf(this.state.selectedObject)
			var parentObjectsForRelation = new Array();
			console.log(indexOfSelectedObject);
			for (var i = 0; i < indexOfSelectedObject; i++) {

				parentObjectsForRelation.push({
					objectName: objectList[i],
					id: i + 1,
					level: i,
					levelName: "level" + i
				})
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
												this.state.selectedObject != "Selected Sources" &&
												this.state[this.state.selectedObject].hideLevel
											}
										/>
									</div>
								</div>
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

								<PanelBarItem title={<i style={{ fontSize: "14px" }}>Add Predicate</i>}>
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
												{(this.state.selectedObject !== "Selected Sources") &&
													this.state.attributeListForSelectedObject.map((attribute) => {

														return (

															<option key={attribute} value={this.state[this.state.selectedObject].objectName + '.' + attribute}>{this.state[this.state.selectedObject].objectName + '.' + attribute}</option>
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

													(this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] && this.state.selectedObject != "Selected Sources") ?

														this.state[this.state.selectedObject].groupBy.attributes.map((attribute) => {

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

													(this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] && this.state.selectedObject != "Selected Sources") ?

														this.state[this.state.selectedObject].attributes.map((attribute) => {


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

													(this.state[this.state.selectedObject] != null && this.state[this.state.selectedObject] && this.state.selectedObject != "Selected Sources") ?

														this.state[this.state.selectedObject].orderBy.attributes.map((attribute) => {

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
							{this.state.selectedObjectList.indexOf(this.state.selectedObject) <= 0 ? "" :

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
											<div className="col-lg-6 justify-content-center">
												<MultiSelect
													placeholder={"Native Relations"}
													data={this.state.nativeRelations}
													style={{ margin: "1em", width: '100%' }}
													onChange={this.addNativeRelation.bind(this)}
													value={this.state[this.state.selectedObject].relation.native}
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
														this.state[this.state.selectedObject].relation.type !== 'explicit' ?
															(this.state.explicitRelation.attribute.object + '.' + this.state.explicitRelation.attribute.attributeName + this.state.explicitRelation.operator.operator + this.state.explicitRelation.parentAttribute.level + '.' + this.state.explicitRelation.parentAttribute.attributeIndex) : (
																this.state[this.state.selectedObject].relation.explicit.attribute.object + '.' + this.state[this.state.selectedObject].relation.explicit.attribute.attributeName + this.state[this.state.selectedObject].relation.explicit.operator.operator + this.state[this.state.selectedObject].relation.explicit.parentAttribute.level + '.' + this.state[this.state.selectedObject].relation.explicit.parentAttribute.attributeIndex)
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
													data={this.state[this.state.selectedObject] != "Select Sources" ?
														this.state[this.state.selectedObject].attributes.map((attribute, index) => {
															return (

																{
																	key: attribute.ID,
																	id: index,
																	attributeName: attribute.attributeName,
																	object: this.state[this.state.selectedObject].objectName,

																}

															)
														}) : []}
													textField="attributeName"
													dataItemKey="id"
													style={{ width: "100%" }}
													label="Select Attribute"
													onChange={this.addChildAttributeForExplicitRelation.bind(this)}
													value={
														this.state[this.state.selectedObject].relation.type !== 'explicit' ? (
															this.state.explicitRelation.attribute
														) : (
																this.state[this.state.selectedObject].relation.explicit.attribute
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
														this.state[this.state.selectedObject].relation.type !== 'explicit' ? (
															this.state.explicitRelation.operator
														) : (
																this.state[this.state.selectedObject].relation.explicit.operator
															)
													}
												/>
											</div>
											<div className="col-lg-5">

												<DropDownList
													data={this.state.parentObject.id !== 0 ?
														this.state[this.state.parentObject.objectName].attributes.map((attribute, index) => {
															return (

																{
																	// key property can be used to compare the attribute while deleting attributes
																	key: attribute.ID,
																	id: index,
																	attributeName: attribute.attributeName,

																	object: this.state[this.state.selectedObject].objectName,
																	attributeIndex: (index + 1),
																	level: 'level' + this.state.selectedObjectList.indexOf(this.state.parentObject.objectName)
																}

															)
														}) : []}
													textField="attributeName"
													dataItemKey="id"
													style={{ width: "100%" }}
													label="Select Attribute"
													onChange={this.addParentAttributeForExplicitRelation.bind(this)}
													value={
														this.state[this.state.selectedObject].relation.type !== 'explicit' ? (
															this.state.explicitRelation.parentAttribute
														) : (
																this.state[this.state.selectedObject].relation.explicit.parentAttribute
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
						<div className="row">
							<div className="col-lg-6">
								<Button onClick={this.createMLV.bind(this)}>
									Generate MLV
								</Button>
							</div>
						</div>

					</div>
				</div>
			</div>
		)
	}

}