import React, { Component } from 'react';
import axios from 'axios';
import { groupBy, process } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import TestCaseNoGrid from './TestCaseNoGrid'
import WriteReportCell from './WriteReportCell'
import DownloadLogs from './DownloadLogs'

export default class PluginNameWrite extends Component {
	constructor(props){
		super(props);
		var dataItems = this.props.dataItem.items;
		var pluginNameList = [];
		var result = groupBy(dataItems, [{ field: "suiteName" }]);
		console.log(result)
		
		result.map(pluginObject=>{
			
			pluginNameList.push({
				suiteName : pluginObject.value,
				items : pluginObject.items,
				insertRBRTotal : pluginObject.items[0].insertRBRTotal,
				insertRBRFail : pluginObject.items[0].insertRBRFail,
				insertRBRPass : pluginObject.items[0].insertRBRPass,

				insertRSTotal : pluginObject.items[0].insertRSTotal,
				insertRSPass : pluginObject.items[0].insertRSPass,
				insertRSFail : pluginObject.items[0].insertRSFail,

				insertBulkTotal : pluginObject.items[0].insertBulkTotal,
				insertBulkPass : pluginObject.items[0].insertBulkPass,
				insertBulkFail : pluginObject.items[0].insertBulkFail,

				updateTotal : pluginObject.items[0].updateTotal,
				updatePass : pluginObject.items[0].updatePass,
				updateFail : pluginObject.items[0].updateFail,

				updateBulkTotal : pluginObject.items[0].updateBulkTotal,
				updateBulkPass : pluginObject.items[0].updateBulkPass,
				updateBulkFail : pluginObject.items[0].updateBulkFail,

				deleteTotal : pluginObject.items[0].deleteTotal,
				deletePass : pluginObject.items[0].deletePass,
				deleteFail : pluginObject.items[0].deleteFail,

				deleteBulkTotal : pluginObject.items[0].deleteBulkTotal,
				deleteBulkPass : pluginObject.items[0].deleteBulkPass,
				deleteBulkFail : pluginObject.items[0].deleteBulkFail,
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
				<Column width="300px" field="suiteName" title="Suite Name" />
				<Column  width="250px" field="insertRBRTotal" title="Insert RBR Total" />
				<Column  width="250px" field="insertRBRPass" title="Insert RBR Pass" />
				<Column width="250px" field="insertRBRFail" title="Insert RBR Fail" cell={WriteReportCell}/>

				<Column width="250px" field="insertRSTotal" title="Insert RS Total" />
				<Column width="250px" field="insertRSPass" title="Insert RS Pass" />
				<Column width="250px" field="insertRSFail" title="Insert RS Fail" cell={WriteReportCell}/>

				<Column width="250px" field="insertBulkTotal" title="Insert Bulk Total" />
				<Column width="250px" field="insertBulkPass" title="Insert Bulk Pass" />
				<Column width="250px" field="insertBulkFail" title="Insert Bulk Fail" cell={WriteReportCell}  />

				<Column width="250px" field="updateTotal" title="Update Total" />
				<Column width="250px" field="updatePass" title="Update Pass" />
				<Column width="250px" field="updateFail" title="Update Fail"  cell={WriteReportCell} />

				<Column width="250px" field="updateBulkTotal" title="Update Bulk Total" />
				<Column width="250px" field="updateBulkPass" title="Update Bulk Pass" />
				<Column width="250px" field="updateBulkFail" title="Update Bulk Fail" cell={WriteReportCell} />

				<Column width="250px" field="deleteTotal" title="Delete Total" />
				<Column width="250px" field="deletePass" title="Delete Pass" />
				<Column width="250px" field="deleteFail" title="Delete Fail" cell={WriteReportCell} />

				<Column width="250px" field="deleteBulkTotal" title="Delete Bulk Total" />
				<Column width="250px" field="deleteBulkPass" title="Delete Bulk Pass" />
				<Column width="250px" field="deleteBulkFail" title="Delete Bulk Fail" cell={WriteReportCell} />
				<Column width="250px" field="hostIP" title="Host IP" />
				<Column width="250px" field="currentRunTime" title="Current Run Time" />
				<Column width="250px"  title="Download Logs" cell={DownloadLogs} />
				

			</Grid>
			)
	}

		expandChange = (event) => {
        event.dataItem.expanded = !event.dataItem.expanded;
        this.forceUpdate();
    }
}