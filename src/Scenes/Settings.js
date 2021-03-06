import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import axios from 'axios';
import * as constants from '../Constants'
export default class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			logLevel: '',
			logCategory: ''
		}
	}
	componentWillMount() {

		axios.post(constants.url + 'GetLoggerPref', ``, {
			headers: {
			}


		}).then(response => {

			this.setState({
				...this.state,
				logLevel: response.data.level,
				logCategory: response.data.name
			})
		})

	}
	setLogLevel(event) {
		axios.post(constants.url + 'ChangeLoggerPref', `settings=${JSON.stringify({ logLevel: event.target.value, logCategory: this.state.logCategory })}`, {
			headers: {
			}


		}).then(response => {
			this.setState({
				...this.state,
				logLevel: response.data.level,
				logCategory: response.data.name
			})
		})

	}
	setLogCategory(event) {
		axios.post(constants.url + 'ChangeLoggerPref', `settings=${JSON.stringify({ logLevel: this.state.logLevel, logCategory: event.target.value })}`, {
			headers: {
			}


		}).then(response => {
			this.setState({
				...this.state,
				logLevel: response.data.level,
				logCategory: response.data.name
			})
		})

	}

	render() {


		return (

			<div className="container-fluid" style={{ marginTop: "2em" }}>

				<div className="row justify-content-center">

					<div className="col-lg-2">
						<DropDownList
							style={{ margin: "1em", width: "100%" }}
							data={['ERROR', 'DEBUG']}
							label="Log Level"
							onChange={this.setLogLevel.bind(this)}
							value={this.state.logLevel}
						/>
					</div>
					<div className="col-lg-2">
						<DropDownList
							style={{ margin: "1em", width: "100%" }}
							data={['jdbcCategory', 'PVPUI Logger']}
							label="Log Category"
							onChange={this.setLogCategory.bind(this)}
							value={this.state.logCategory}
						/>
					</div>

				</div>
			</div>

		)


	}
}