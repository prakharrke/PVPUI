import React, { Component } from 'react';
import axios from 'axios';
import { groupBy, process } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import TestCaseDataGrid from './TestCaseDataGrid'
import WriteTestCaseNoCell from './WriteTestCaseNoCell'
export default class TestCaseNoGrid extends Component {

	constructor(props) {
		super(props);

		var dataItems = this.props.dataItem.items;
		var testCaseNoList = [];
		var result = groupBy(dataItems, [{ field: "testCaseNo" }]);
		result.map(testCaseObject => {
			if (testCaseObject.items[0].testResult === 'FAIL')
				testCaseNoList.push({
					testCaseNo: testCaseObject.value,
					items: testCaseObject.items,
					testResult: testCaseObject.items[0].testResult,
					excelName: testCaseObject.items[0].excelName,
					resultSheetName: testCaseObject.items[0].resultSheet
				})

		})

		this.state = {
			testCaseNoList: testCaseNoList
		}
	}

	render() {
		return (
			<Grid

				resizable={true}
				reorderable={true}
				filterable={false}
				data={this.state.testCaseNoList}
				onExpandChange={this.expandChange.bind(this)}
				detail={TestCaseDataGrid}


				expandField="expanded"
			>
				<Column field="testCaseNo" title="Test Case No" cell={WriteTestCaseNoCell} />
				<Column field="testResult" title="Test Result" />
				<Column field="excelName" title="Baseline Name" />
				<Column field="resultSheetName" title="Result sheet Name" />



			</Grid>
		)
	}
	expandChange = (event) => {
		event.dataItem.expanded = !event.dataItem.expanded;
		this.forceUpdate();
	}
}