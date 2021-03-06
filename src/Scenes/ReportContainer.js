import React, { Component } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import axios from 'axios';
import { groupBy, process, aggregateBy } from '@progress/kendo-data-query';
import { Button } from '@progress/kendo-react-buttons';
import { Link, NavLink } from 'react-router-dom';
import PLMSummaryReport from './Components/PLMSummaryReport'
import ALMSummaryReport from './Components/ALMSummaryReport'
import DBSummaryReport from './Components/DBSummaryReport'
import OthersSummaryReport from './Components/OthersSummaryReport'
import ERPSummaryReport from './Components/ERPSummaryReport'
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import * as Constants from '../Constants';
import 'hammerjs';
import {
	Chart,
	ChartTitle,
	ChartSeries,
	ChartSeriesItem,
	ChartCategoryAxis,
	ChartCategoryAxisItem,
	Sparkline,
} from '@progress/kendo-react-charts';
export default class ReportContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentDate: new Date(),
			graphData: [],
			selected: 0,
			PLM: [],
			ALM: [],
			DB: [],
			ERP: [],
			others: [],
			showReadLine: true,
			showCrudLine: true,
			showActivitiesLine: true

		}

	}

	categories = [];

	componentWillMount() {
		//alert(new Date(1545317576622))
		var toDate = new Date(this.state.currentDate);
		toDate.setDate(this.state.currentDate.getDate() + 1);
		toDate.setHours(7)
		toDate.setMinutes(0)
		toDate.setSeconds(0)
		toDate.setMilliseconds(0)
		var fromDate = new Date(toDate);
		var prevDate = fromDate.getDate() - 7;
		fromDate.setDate(prevDate);
		fromDate.setHours(19)
		fromDate.setMinutes(0)
		fromDate.setSeconds(0)
		fromDate.setMilliseconds(0)
		var categoriesLocal = [];
		for (var i = 0; i <= 7; i++) {
			var tempDate = new Date(fromDate);
			var newDate = fromDate.getDate();
			tempDate.setDate(newDate + i);
			categoriesLocal.push(`${tempDate.getDate()}-${tempDate.getMonth() + 1}-${tempDate.getFullYear()}`)

		}

		this.categories = categoriesLocal;

		axios.post(Constants.url + 'FetchGraphReport', `reportDetails=${JSON.stringify({ fromDate: fromDate.getTime(), toDate: toDate.getTime() })}`, {
			headers: {
			}


		}).then((response) => {

			console.log(response.data)
			var graphReportData = response.data;
			var graphNewData = new Array();
			var categories = new Array();
			var finalGraphData = new Array();
			graphReportData.map(reportObject => {

				var timeStamp = new Date(reportObject.timeStamp);
				var runHour = timeStamp.getHours();
				var runDate = new Date();
				// *  CHANGED HERE FROM 19 TO 8 TO TEST
				if (runHour > 8) {
					runDate.setDate(timeStamp.getDate());
					runDate.setMonth(timeStamp.getMonth());
					runDate.setFullYear(timeStamp.getFullYear());
					runDate.setHours(0);
					runDate.setMinutes(0);
					runDate.setSeconds(0);
					reportObject.runDate = `${runDate.getDate()}-${runDate.getMonth() + 1}-${runDate.getFullYear()}`;
					graphNewData.push(reportObject)
				} if (runHour < 7) {

					runDate.setDate(timeStamp.getDate() - 1);
					runDate.setMonth(timeStamp.getMonth());
					runDate.setFullYear(timeStamp.getFullYear());
					runDate.setHours(0);
					runDate.setMinutes(0);
					runDate.setSeconds(0);
					reportObject.runDate = `${runDate.getDate()}-${runDate.getMonth() + 1}-${runDate.getFullYear()}`;
					graphNewData.push(reportObject)

				}

				//console.log(reportObject)

			})

			var groupedGraphData = groupBy(graphNewData, [{ field: "pluginName" }, { field: "runDate" }]);
			//console.log(groupedGraphData)
			var connectionNamesArray = new Array();
			groupedGraphData.map(object => {
				connectionNamesArray.push(object.value)
			})

			//this.props.holdConnectionNamesArray(connectionNamesArray);

			groupedGraphData.map(object => {
				var connectionName = object.value;

				object.items.map(runDateObject => {

					var runDate = runDateObject.value
					var sum = aggregateBy(runDateObject.items, [{ field: 'readFail', aggregate: 'sum' }, { field: 'readPass', aggregate: 'sum' }, { field: 'writeFail', aggregate: 'sum' }, { field: 'writePass', aggregate: 'sum' }, { field: 'activityFail', aggregate: 'sum' }, { field: 'activityPass', aggregate: 'sum' }])
					runDateObject.readFailCount = sum.readFail;
					runDateObject.readPassCount = sum.readPass;
					runDateObject.writeFailCount = sum.writePass;
					runDateObject.writePassCount = sum.writePass;
					runDateObject.activityPassCount = sum.activityPass;
				})
			})

			//console.log(groupedGraphData);

			// FILLING FINAL_GRAPH_DATA BASED ON THE GROUPED DATA 
			groupedGraphData.map((connectionObject, index) => {
				var temp = {};
				temp.connectionName = connectionObject.value;
				temp.data = [];
				temp.writeData = [];
				temp.activityData = [];
				temp.categories = [];

				this.categories.map(runDate => {

					var index = connectionObject.items.map((obj) => { return obj.value }).indexOf(runDate)
					if (index === -1) {

						temp.data.push(0)
						temp.writeData.push(0)
						temp.activityData.push(0)
					}
					else {

						temp.data.push(connectionObject.items[index].readPassCount.sum)
						temp.writeData.push(connectionObject.items[index].writePassCount.sum)
						temp.activityData.push(connectionObject.items[index].activityPassCount.sum)
					}
				})




				finalGraphData.push(temp)
				console.log('CHECK')
				console.log(finalGraphData)

			})
			var PLM = new Array();
			var ALM = new Array();
			var DB = new Array();
			var ERP = new Array();
			var others = new Array();
			console.log(finalGraphData)
			finalGraphData.map(object => {
				var pushed = false;
				if (!pushed) {
					Constants.ALM.map(type => {
						//console.log(object.connectionName.toLowerCase().includes(type.toLowerCase()))
						//console.log(object.connectionName.toLowerCase())
						console.log(type.toLowerCase())
						if (pushed == false && object.connectionName.toLowerCase().includes(type.toLowerCase()) && object.connectionName != '') {
							//console.log("pushed")
							pushed = true;
							ALM.push(object);
							return
						}
					})
				}
				if (!pushed) {
					Constants.PLM.map(type => {

						if (pushed == false && object.connectionName.toLowerCase().includes(type.toLowerCase()) && object.connectionName != '' && type != '') {
							pushed = true;
							PLM.push(object);
							return
						}
					})
				}
				if (!pushed) {
					Constants.DB.map(type => {

						if (pushed == false && object.connectionName.toLowerCase().includes(type.toLowerCase()) && object.connectionName != '' && type != '') {
							pushed = true;
							DB.push(object);
							return
						}
					})
				}
				if (!pushed) {
					Constants.ERP.map(type => {

						if (pushed == false && object.connectionName.toLowerCase().includes(type.toLowerCase()) && object.connectionName != '' && type != '') {
							pushed = true;
							ERP.push(object);
							return
						}
					})
				}
				if (!pushed) {

					others.push(object)

					pushed = true;
				}

			})

			this.setState({
				graphData: finalGraphData,
				PLM: PLM,
				ALM: ALM,
				DB: DB,
				ERP: ERP,
				others: others

			})
		}).catch(e => {
			console.log(e)
		})

	}

	handleSelect = (e) => {
		this.setState({ selected: e.selected })
	}

	toggleCrudLine(event) {

		this.setState({
			...this.state,
			showCrudLine: !this.state.showCrudLine
		})

	}

	toggleReadLine(event) {

		this.setState({
			...this.state,
			showReadLine: !this.state.showReadLine
		})

	}

	toggleActivitiesLine(event) {

		this.setState({
			...this.state,
			showActivitiesLine: !this.state.showActivitiesLine
		})
	}

	render() {
		/*var graphs = this.state.graphData.length === 0 ? '' : (
			this.state.graphData.map((dataObject) => {
				//console.log(dataObject.categories)
				return (
					<div className="col-lg-2" style={{ margin: "1em" }}>
						<Chart >
							<ChartTitle text={dataObject.connectionName} />

							<ChartSeries>
								<ChartSeriesItem type="line" data={dataObject.data} />

							</ChartSeries>
						</Chart>
					</div>

				)
			})
		)
		var sparkLine = this.state.graphData.length === 0 ? '' : (
			this.state.graphData.map((dataObject) => {
				console.log(dataObject.categories)
				return (

					<div className="col-lg-2" style={{ margin: "2em" }}>{dataObject.connectionName}

						<Sparkline data={dataObject.data} type="line" style={{ lineHeight: '5em', }} />
					</div>

				)
			})
		)*/
		return (
			<div>
				<div className="row d-flex justify-content-center" style={{ marginTop: '1em' }}>
					<div className="col-lg-4">
						<Switch
							style={{ margin: "1em" }}
							checked={this.state.showReadLine}
							onChange={this.toggleReadLine.bind(this)}
						/><code style={{ margin: "1em", color: 'rgb(63, 81, 181)' }} >READ</code>
						<Switch
							style={{ margin: "1em" }}
							checked={this.state.showCrudLine}
							onChange={this.toggleCrudLine.bind(this)}
						/><code style={{ margin: "1em", color: 'rgb(33, 150, 243)' }}>CRUD</code>
						<Switch
							style={{ margin: "1em" }}
							checked={this.state.showActivitiesLine}
							onChange={this.toggleActivitiesLine.bind(this)}
						/><code style={{ margin: "1em", color: 'rgb(67, 160, 71)' }}>ACTIVITIES</code>
					</div>
					
				</div>
				{/*<div className="row">
									<div className="col-lg-3" style={{margin : '2em'}}>
										
										<h6 style={{color : 'rgb(67, 160, 71)'}}>Activities</h6>
										<h6 style={{color : 'rgb(33, 150, 243)'}}>CRUD</h6>
										<h6 style={{color : 'rgb(63, 81, 181)'}}>Read</h6>
									</div>
								</div>*/}
				<div className="row">
					<div className="col-lg-12">
						<TabStrip selected={this.state.selected} onSelect={this.handleSelect.bind(this)}>
							<TabStripTab title="PLM">
								<PLMSummaryReport
									PLM={this.state.PLM}
									showReadLine={this.state.showReadLine}
									showCrudLine={this.state.showCrudLine}
									showActivitiesLine={this.state.showActivitiesLine}
								/>
							</TabStripTab>
							<TabStripTab title="ALM">
								<ALMSummaryReport
									ALM={this.state.ALM}
									showReadLine={this.state.showReadLine}
									showCrudLine={this.state.showCrudLine}
									showActivitiesLine={this.state.showActivitiesLine}
								/>
							</TabStripTab>
							<TabStripTab title="DB">
								<DBSummaryReport DB={this.state.DB}
									showReadLine={this.state.showReadLine}
									showCrudLine={this.state.showCrudLine}
									showActivitiesLine={this.state.showActivitiesLine}
								/>
							</TabStripTab>
							<TabStripTab title="ERP">
								<ERPSummaryReport ERP={this.state.ERP}
									showReadLine={this.state.showReadLine}
									showCrudLine={this.state.showCrudLine}
									showActivitiesLine={this.state.showActivitiesLine}
								/>
							</TabStripTab>
							<TabStripTab title="Others">
								<OthersSummaryReport others={this.state.others}
									showReadLine={this.state.showReadLine}
									showCrudLine={this.state.showCrudLine}
									showActivitiesLine={this.state.showActivitiesLine}
								/>
							</TabStripTab>



						</TabStrip>
					</div>

				</div>
			</div>
		)
	}

}