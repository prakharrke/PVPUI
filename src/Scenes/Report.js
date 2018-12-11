import React, { Component } from 'react';
import axios from 'axios';
export default class Report extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentDate: new Date().getTime(),
			

		}
	}

	componentWillMount() {
		var fromDate = new Date(this.state.currentDate)
		fromDate.setHours(19)
		fromDate.setMinutes(0)
		fromDate.setSeconds(0)
		fromDate.setMilliseconds(0)
		var toDate=new Date(fromDate);
		var nextDate = toDate.getDate() + 1;
		toDate.setDate(nextDate);
		toDate.setHours(7)
		toDate.setMinutes(0)
		toDate.setSeconds(0)
		toDate.setMilliseconds(0)
		console.log(fromDate)
		console.log(toDate)
		axios.post('http://localhost:9090/PVPUI/FetchReport', `reportDetails=${JSON.stringify({ fromDate : fromDate.getTime(),toDate : toDate.getTime() })}`, {
			headers: {
			}


		}).then().catch()
	}

	render() {
	

		

		return (

			<h3>Reports</h3>
		)
	}
}