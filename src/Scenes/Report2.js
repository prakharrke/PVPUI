import React, { Component } from 'react';
import axios from 'axios';
import { groupBy, process } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import PluginNameGrid from './Components/PluginNameGrid'
export default class Report extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentDate: new Date().getTime(),
			resultSet: [],
			dataResult: [],



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
		axios.post('http://localhost:9090/PVPUI/FetchReport', `reportDetails=${JSON.stringify({ fromDate: fromDate.getTime(), toDate: toDate.getTime() })}`, {
			headers: {
			}


		}).then(response => {
			const result = groupBy(response.data, [{ field: "connectionName" }]);
			var connectionData = []
			result.map(connectionObject=>{
				connectionData.push({
					connectionName : connectionObject.value,
					items: connectionObject.items,
					
				})
			})
			this.setState({
				resultSet: response.data,
				dataResult: connectionData
			})
			
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
				data={this.state.dataResult}
				detail={PluginNameGrid}
				expandField="expanded"
				onExpandChange={this.expandChange.bind(this)}
				
				
			>
				<Column field="connectionName" title="Connection Name" />

			</Grid>
		)
	}

	expandChange = (event) => {
        event.dataItem.expanded = !event.dataItem.expanded;
        this.forceUpdate();
    }



}