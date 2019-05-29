import React, { Component } from 'react';
import axios from 'axios';
import * as Constants from '../../Constants'

export default class ReadTestCaseNoCell extends Component {

	constructor(props){

		super(props);
		this.state = {
			prevFailed : true
		}
	}
	componentWillMount() {

		var fromDate = new Date(this.props.dataItem.items[0].fromDate)
		fromDate.setDate(fromDate.getDate() -1)
		fromDate = fromDate.getTime();
		var toDate = new Date(this.props.dataItem.items[0].toDate);
		toDate.setDate(toDate.getDate() -1);
		toDate = toDate.getTime();
		var testCaseData = {
			pluginName : this.props.dataItem.items[0].pluginName,
			suiteName : this.props.dataItem.items[0].suiteName,
			testCaseNo : this.props.dataItem.testCaseNo.split('-')[1].trim(),
			fromDate : fromDate,
			toDate : toDate,
			resultSheetName : this.props.dataItem.resultSheetName,
			operationType : 'Read',
			excelName : this.props.dataItem.items[0].excelName
		}
		console.log(testCaseData)
		axios.post(Constants.url + 'CheckFailedTestCase', `testCaseDetails=${JSON.stringify(testCaseData)}`, {
			headers: {
			}


		}).then(response=>{
			console.log(response.data)
			if(response.data){
				console.log('Setting')
				this.setState({

					prevFailed : true
				})

			}
			if(!response.data)
			{	console.log('is false')
				this.setState({
					prevFailed : false
				})
			}
		})
	}
	render() {

		console.log(this.state)

		var style = {
			backgroundColor : this.state.prevFailed ? '' : 'rgb(243, 23, 0, 0.32)'
		}

		return (
			<td style={style}>
				{this.props.dataItem[this.props.field]}
			</td>
		)
	}
}