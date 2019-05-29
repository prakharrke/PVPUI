import React, { Component } from 'react';

export default class WriteReportCell extends Component{

	render(){

		var field = this.props.field;
		console.log(this.props.dataItem[field])
		var style={
			backgroundColor : this.props.dataItem[field] > 0 ? "rgb(243, 23, 0, 0.32)" : "rgb(55, 180, 0,0.32)"
		}
		return(

			<td style={style}>
			{this.props.dataItem[field]}
			</td>
			)
	}
	
}