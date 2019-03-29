import React, { Component } from 'react';
import {
	Chart,
	ChartTitle,
	ChartSeries,
	ChartTooltip,
	ChartSeriesItem,
	ChartSeriesItemTooltip,
	ChartCategoryAxis,
	ChartCategoryAxisItem,
	Sparkline,
} from '@progress/kendo-react-charts';
export default class OthersSummaryReport extends Component { 

	constructor(props){
		super(props);

	}

	render(){

		var graphs = this.props.others.length === 0 ? '' : (
			this.props.others.map((dataObject) => {
				//console.log(dataObject.categories)
				return (
					<div className="col-lg-2" style={{ margin: "1em" }}>
						<Chart >
							<ChartTitle text={dataObject.connectionName} />

							<ChartTooltip />
							<ChartSeries>
								<ChartSeriesItem type="line" data={dataObject.data}  >
									<ChartSeriesItemTooltip background="blue" />
								</ChartSeriesItem>
								<ChartSeriesItem type="line" data={dataObject.writeData} >
									<ChartSeriesItemTooltip background="blue" />
								</ChartSeriesItem>
								<ChartSeriesItem type="line" data={dataObject.activityData} >
									<ChartSeriesItemTooltip background="blue" />
								</ChartSeriesItem>

							</ChartSeries>
						</Chart>
					</div>

				)
			})
		)
		return(
			<div className="row">
				{graphs}
			</div>
			)
	}

}