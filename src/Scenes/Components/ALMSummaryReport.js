import React, { Component } from 'react';
import {
	Chart,
	ChartTitle,
	ChartSeries,
	ChartSeriesItem,
	ChartCategoryAxis,
	ChartCategoryAxisItem,
	Sparkline,
	ChartTooltip,
	ChartSeriesItemTooltip
} from '@progress/kendo-react-charts';

export default class ALMSummaryReport extends Component {

	constructor(props) {
		super(props);

	}

	render() {

		var graphs = this.props.ALM.length === 0 ? '' : (
			this.props.ALM.map((dataObject) => {
				//console.log(dataObject.categories)
				return (
					<div className="col-lg-2" style={{ margin: "1em" }}>
						<Chart >
							<ChartTitle text={dataObject.connectionName} />

							<ChartTooltip />
							<ChartSeries>
								{this.props.showReadLine &&
									<ChartSeriesItem type="line" data={dataObject.data}  color={'rgb(63, 81, 181)'} >
										<ChartSeriesItemTooltip background="blue" />
									</ChartSeriesItem>
								}
								{this.props.showCrudLine &&
									<ChartSeriesItem type="line" data={dataObject.writeData}  color={'rgb(33, 150, 243)'}>
										<ChartSeriesItemTooltip background="blue" />
									</ChartSeriesItem>
								}
								{this.props.showActivitiesLine && 
									<ChartSeriesItem type="line" data={dataObject.activityData} color={'rgb(67, 160, 71)'}>
										<ChartSeriesItemTooltip background="blue" />
									</ChartSeriesItem>
								}

							</ChartSeries>
						</Chart>
					</div>

				)
			})
		)

		return (

			<div className="row">
				{graphs}
			</div>

		)
	}

}