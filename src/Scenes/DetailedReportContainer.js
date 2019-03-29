import React, { Component } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import Report from './Report2'
import WriteReports from './WriteReports'

export default class DetailedReportContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			selected: 0
		}
	}

	handleSelect = (e) => {
		this.setState({ selected: e.selected })
	}


	render() {
		return(
		<div className="row">
			<div className="col-lg-12">
				<TabStrip selected={this.state.selected} onSelect={this.handleSelect.bind(this)}>
					<TabStripTab title="Read Reports">
						<Report connectionNames={this.props.connectionNames} />
					</TabStripTab>
					<TabStripTab title="CRUD Reports">
						<WriteReports connectionNames={this.props.connectionNames} />
					</TabStripTab>
				</TabStrip>
			</div>
		</div>
		)
	}
}