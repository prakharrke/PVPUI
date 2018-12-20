import React, { Component } from 'react';
import axios from 'axios';
import { groupBy, process } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import PluginNameGrid from './Components/PluginNameGrid'
import LoadingPanel from './Components/LoadingPanel'
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
export default class Report extends Component {

	constructor(props) {
		super(props);
		var currentDate = new Date();
		var minDate = currentDate.getDate() - 30;
		var minDateForCalender = new Date(currentDate);
		minDateForCalender.setDate(minDate);
		var maxDate = currentDate.getDate() + 1;
		var maxDateForCalender = new Date(currentDate);
		maxDateForCalender.setDate(maxDate);

		this.state = {
			currentDate: currentDate,
			resultSet: [],
			dataResult: [],
			isloading: false,
			minDate: minDateForCalender,
			maxDate: maxDateForCalender,
			reportDate: currentDate,
			connectionName : ''



		}
	}

	componentWillMount() {
		//this.fetchReportData(this.state.reportDate);
	}


	fetchReportData(reportDate) {
		if(this.state.connectionName === ''){
			alert('Please enter Connection Name');
			return
		}
		this.isLoading();
		var toDate = new Date(reportDate)
		toDate.setHours(7)
		toDate.setMinutes(0)
		toDate.setSeconds(0)
		toDate.setMilliseconds(0)
		var fromDate = new Date(toDate);
		var prevDate = fromDate.getDate() - 1;
		fromDate.setDate(prevDate);
		fromDate.setHours(19)
		fromDate.setMinutes(0)
		fromDate.setSeconds(0)
		fromDate.setMilliseconds(0)
		console.log(fromDate)
		console.log(toDate)
		axios.post('http://localhost:9090/PVPUI/FetchReport', `reportDetails=${JSON.stringify({ fromDate: fromDate.getTime(), toDate: toDate.getTime(), connectionName : this.state.connectionName })}`, {
			headers: {
			}


		}).then(response => {
			const result = groupBy(response.data, [{ field: "connectionName" }]);
			var connectionData = []
			result.map(connectionObject => {
				connectionData.push({
					connectionName: connectionObject.value,
					items: connectionObject.items,

				})
			})
			this.isNotLoading();
			this.setState({
				resultSet: response.data,
				dataResult: connectionData
			})

			//console.log(result)

		}).catch()

	}

	changeReportDate(event) {
		//this.fetchReportData(event.target.value);
		this.setState({
			reportDate: event.target.value
		})
	}

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

	setConnectionName(event){

		this.setState({
			connectionName : event.target.value
		})
	}

	fetchReport(){

		this.fetchReportData(this.state.reportDate)
	}

	render() {



		var loadingComponent = this.state.isLoading ? <LoadingPanel /> : ""


		return (
			<div>
				{loadingComponent}
				<div className="row justify-content-center" style={{ margin: '1em' }}>
					<div className="col-lg-2">
						<DatePicker
							width='10em'

							min={this.state.minDate}
							max={this.state.maxDate}
							value={this.state.reportDate}
							onChange={this.changeReportDate.bind(this)}
						/>
						<Input

							label="Connection Name"
							value={this.state.connectionName}
							style={{ width: "100%", textAlign: "center", marginTop: "1em", marginBottom: "1em" }}
							onChange={this.setConnectionName.bind(this)}

						/>
						<Button style={{margin : '1em'}}
						onClick = {this.fetchReport.bind(this)}
						>Fetch Report
						</Button>
					</div>
				</div>
				<Grid

					resizable={true}
					reorderable={true}
					filterable={true}
					sortable={true}
					data={this.state.dataResult}
					detail={PluginNameGrid}
					expandField="expanded"
					onExpandChange={this.expandChange.bind(this)}
					style={{ margin: '1em' }}

				>
					<Column field="connectionName" title="Connection Name" />

				</Grid>
			</div>
		)
	}

	expandChange = (event) => {
		event.dataItem.expanded = !event.dataItem.expanded;
		this.forceUpdate();
	}



}