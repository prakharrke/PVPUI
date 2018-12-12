import React, { Component } from 'react';
import axios from 'axios';
import { groupBy, process } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';


export default class TestCaseDataGrid extends Component{
	constructor(props){
		super(props);
		var dataItems = this.props.dataItem.items;
		console.log(dataItems)
		this.state={
			data : dataItems
		}
	}

	render(){
		return(
			
			<Grid
				style={{ width: '100%' }}
				resizable={true}
				reorderable={true}
				filterable={true}
				data={this.state.data}
				expandField="expanded"
			>
				<Column field="baselineCellID" title="Baseline Cell ID" />
				<Column field="baselineCellData" title="Baseline Cell Data" />
				<Column field="newCellID" title="New Cell ID" />
				<Column field="newCellData" title="New Cell Data" />
				<Column field="errorDesc" title="Error Desc" />
				
				


			</Grid>

			)
	}

}
