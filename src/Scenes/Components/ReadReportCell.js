import React, { Component } from 'react';

export default class ReadReportCell extends Component{

	render(){
		console.log(this.props)
		var readFail = this.props.dataItem.readFail;
		var style={
			backgroundColor : readFail > 0 ? "rgb(243, 23, 0, 0.32)" : "rgb(55, 180, 0,0.32)"
		};
	


		return(
				<td style={style}>
				{this.props.dataItem.readFail}
				</td>
			)
	}

}