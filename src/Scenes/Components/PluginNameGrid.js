import React, { Component } from 'react';
import axios from 'axios';
import { groupBy, process } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import TestCaseNoGrid from './TestCaseNoGrid'
import ReadReportCell from './ReadReportCell'
import DownloadLogs from './DownloadLogs'
export default class PluginNameGrid extends Component {
	constructor(props){
		super(props);
		var dataItems = this.props.dataItem.items;
		var pluginNameList = [];
		var result = groupBy(dataItems, [{ field: "suiteName" }]);
		result.map(pluginObject=>{
			pluginNameList.push({
				suiteName : pluginObject.value,
				items : pluginObject.items,
				totalRead : pluginObject.items[0].readTotal,
				readFail : pluginObject.items[0].readFail,
				readPass : pluginObject.items[0].readPass,
				hostIP : pluginObject.items[0].hostIP,
				currentRunTime : pluginObject.items[0].currentRunTime
			})
		})

		this.state={
			pluginList : pluginNameList
		}
		

	}

	render(){

		return (

				<Grid
				style={{width:'100%'}}
				resizable={true}
				reorderable={true}
				filterable={false}
				data={this.state.pluginList}
				detail={TestCaseNoGrid}
				onExpandChange={this.expandChange.bind(this)}
				
				
				expandField="expanded"
			>
				<Column field="suiteName" title="Suite Name" />
				<Column field="totalRead" title="Total Count" />
				<Column field="readPass" title="Pass Count" />
				<Column field="readFail" title="Fail Count" cell={ReadReportCell}/>
				<Column field="hostIP" title="Host IP" />
				<Column field="currentRunTime" title="Current Run Time" />
				<Column  title="Download Logs" cell={DownloadLogs} />
			</Grid>
			)
	}

		expandChange = (event) => {
        event.dataItem.expanded = !event.dataItem.expanded;
        this.forceUpdate();
    }
}