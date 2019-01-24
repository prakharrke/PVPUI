import React, { Component } from 'react';
import axios from 'axios';
import { groupBy, process } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import * as Constants from '../Constants'
export default class Report extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentDate: new Date().getTime(),
			resultSet: [],
			dataResult: [],
			dataState: {
				take: 500,
				group: [{ field: 'connectionName' },{ field: 'pluginName' },{ field: 'testCaseNo' }]
			}


		}
	}

	componentWillMount() {
		var fromDate = new Date(this.state.currentDate)
		fromDate.setHours(19)
		fromDate.setMinutes(0)
		fromDate.setSeconds(0)
		fromDate.setMilliseconds(0)
		var toDate = new Date(fromDate);
		var nextDate = toDate.getDate() + 1;
		toDate.setDate(nextDate);
		toDate.setHours(7)
		toDate.setMinutes(0)
		toDate.setSeconds(0)
		toDate.setMilliseconds(0)
		console.log(fromDate)
		console.log(toDate)
		axios.post(Constants.url + 'FetchReport', `reportDetails=${JSON.stringify({ fromDate: fromDate.getTime(), toDate: toDate.getTime() })}`, {
			headers: {
			}


		}).then(response => {
			var dataResult = process(response.data, this.state.dataState);
			this.setState({
				resultSet: response.data,
				dataResult: dataResult
			})
			const result = groupBy(response.data, [{ field: "connectionName" }]);
			//console.log(result)

		}).catch()
	}

	render() {




		return (

			<Grid

				resizable={true}
				reorderable={true}
				filterable={true}
				sortable={true}
				pageable={{ pageSizes: true }}
				groupable={true}
				data={this.state.dataResult}
				
				{...this.state.dataState}
				onDataStateChange={this.dataStateChange.bind(this)}
				onExpandChange={this.expandChange.bind(this)}
				
				expandField="expanded"
			>
				<Column field="connectionName" title="Connection Name" />
				<Column field="pluginName" title="Plugin Name" />
				<Column field="testCaseNo" title="Test Case No" />
				<Column field="excelName" title="Excel Name" />
				<Column field="testResult" title="Test Result" />
				<Column field="readTotal" title="Total Count" />
				<Column field="readFail" title="Fail Count" />
				<Column field="baselineCellID" title="Baseline Cell ID" />
				<Column field="baselineCellData" title="Baseline Cell Data" />
				<Column field="newCellID" title="New Cell ID" />
				<Column field="newCellData" title="New Cell Data" />
				<Column field="errorDesc" title="Error Desc" />

			</Grid>
		)
	}

	expandChange = (event) => {
		event.dataItem[event.target.props.expandField] = event.value;
		this.setState({
			result: Object.assign({}, this.state.result),
			dataState: this.state.dataState
		});
	}

	dataStateChange(event) {

		var newData = process(this.state.resultSet, event.data);
		this.setState({
			dataResult: newData,
			dataState: { ...event.data }
		})
	}

	cellRender(tdElement, cellProps) {

		
		if (cellProps.rowType === 'groupHeader') {
			
			if (cellProps.field === 'pluginName') {
				return (
					<td>
							pluginName			
					</td>
				);
			}
		}
		return tdElement;
	}



}