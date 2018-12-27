import React, { Component } from 'react';
import {
	Chart,
	ChartTitle,
	ChartSeries,
	ChartSeriesItem,
	ChartCategoryAxis,
	ChartCategoryAxisItem,
	Sparkline,
} from '@progress/kendo-react-charts';

export default class ALMSummaryReport extends Component { 

	constructor(props){
		super(props);

	}

	render(){

		var graphs = this.props.ALM.length === 0 ? '' : (
			this.props.ALM.map((dataObject) => {
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
	
		return(	
			
			<div className="row">
				{graphs}
			</div>
			
			)	
	}

}