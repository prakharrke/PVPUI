import React, { Component } from 'react';
import {
	Chart,
	ChartTitle,
	ChartTooltip,
	ChartSeries,
	ChartSeriesItem,
	ChartCategoryAxis,
	ChartCategoryAxisItem,
	ChartSeriesItemTooltip,
	Sparkline,
} from '@progress/kendo-react-charts';
export default class PLMSummaryReport extends Component {

	constructor(props) {
		super(props);

	}

	render() {

		var graphs = this.props.PLM.length === 0 ? '' : (
			this.props.PLM.map((dataObject) => {
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