import React, { Component } from 'react';
import axios from 'axios';
import { Button } from '@progress/kendo-react-buttons';
import * as Constants from '../../Constants'

export default class DownloadLogs extends Component {
	
	constructor(props) {
		super(props)
		console.log(this.props.dataItem)
	}

	downloadLogs(event){
		//alert(this.props.dataItem.hostIP + '\\' + this.props.dataItem.currentRunTime)
		var downloadPath = `\\\\${this.props.dataItem.hostIP.trim()}\\LOG_FOR_REPORT\\${this.props.dataItem.items[0].pluginName}\\${this.props.dataItem.currentRunTime.trim()}\\`
		alert(downloadPath)

		axios.post(Constants.url + 'DownloadLogs', `downloadLog=${encodeURIComponent(JSON.stringify({path : downloadPath, pluginName : this.props.dataItem.items[0].pluginName}))}`, {
			headers: {
			}


		}).then(response=>{
			alert("Logs Downloaded")
		}).catch(e=>{
			alert(e.message)
		})
	}

	render(){

		return (

			<td>
				<Button onClick={this.downloadLogs.bind(this)}>Download Logs</Button>
			</td>
			)
	}
}