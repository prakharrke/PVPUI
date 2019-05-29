import React, { Component } from 'react';
import { BrowserRouter, Route, Router, HashRouter, Redirect, Switch } from 'react-router-dom';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import Report from './Report2'
import WriteReports from './WriteReports'
import ReportContainer from './ReportContainer'
import Menu from '@material-ui/icons/Menu';
import { Button } from '@progress/kendo-react-buttons';

export default class ParentReportContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {

			showPanel: false,
		}
	}

	togglePanel(event) {
		event.preventDefault();
		this.setState({
			...this.state,
			showPanel: true
		})
	}

	hidePanel(event) {

		this.setState({
			...this.state,
			showPanel: false
		})

	}

	onSelect = (event) => {
		switch (event.target.props.route) {
			case '/mlvGenerator':
				//if (this.state.connInfoList.length > 0)
					this.props.history.push(event.target.props.route);
				//else
				//	alert('Please choose base connection first')
				return
				break;
			default:
				this.props.history.push(event.target.props.route);

		}

	}


	render() {

		return(
		<div className="container-fluid" style={{margin : '1em'}}>
		<div className="row">
			<div className="col-lg-2">
				<Button
					primary={true}
					onMouseOver={this.togglePanel.bind(this)}

				><Menu /></Button>
			</div>
		</div>

		<div className="row">

		{
			this.state.showPanel &&
			<div className="col-lg-2" onMouseLeave={this.hidePanel.bind(this)}>

				<PanelBar
					expandMode={'single'}
					onSelect={this.onSelect.bind(this)}

				>	<PanelBarItem title={'Deviation Graph Report'} route="/reports/" />
					<PanelBarItem title={'Detailed Read Report'} route="/reports/readreport" />
					<PanelBarItem title={'Detailed CRUD Report'} route="/reports/crudreport" />
				</PanelBar>

			</div>
		}

		<div className={`col-lg-${this.state.showPanel ? "10" : "12"}`}>
						<Switch>
						
						<Route path='/reports/readreport' component={Report} />
						<Route path='/reports/crudreport' component={WriteReports} />
						<Route path='/reports/' component={ReportContainer} />
						</Switch>
		</div>

		</div>
		</div>

		)
	}
}