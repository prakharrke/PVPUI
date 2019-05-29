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
				filterable={false}
				data={this.state.data}
				expandField="expanded"
			>
				<Column field="baselineCellID" title="Baseline Cell ID"  width="300px"/>
				<Column field="baselineCellData" title="Baseline Cell Data" width="300px" />
				<Column field="newCellID" title="New Cell ID"  width="300px"/>
				<Column field="newCellData" title="New Cell Data" width="300px" />
				<Column field="errorDesc" title="Error Desc"/>
				
				


			</Grid>

			)
	}

}
