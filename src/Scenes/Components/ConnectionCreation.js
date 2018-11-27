import React, { Component } from 'react';
import axios from 'axios';
import {DropDownList} from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
export default class ConnectionCreation extends Component{

	constructor(props){

		super(props);

		this.state = {

			pluginList : [],
			selectedPlugin : ""
		}
		this.selectedPlugin = ""
	}

	componentWillMount(){

		//	this.props.isLoading();

		    axios.post('http://localhost:9090/PVPUI/GetPlugins',{p :'1'},{
      headers :{

        'Content-Type' : 'application/json',



      }


    }).then((response)=>{
			
			this.props.isNotLoading();
    		var pluginList = new Array();
    		pluginList = response.data.split(",")

    		this.setState({

    			pluginList : pluginList
    		})

    })

	}

	setPlugin = (event) => {

			this.setState({

				selectedPlugin : event.target.value

			})

	}

	connectionTest(event){
		event.preventDefault();
		var selectedPlugin = this.state.selectedPlugin;
		this.props.isLoading();
		  axios.post('http://localhost:9090/PVPUI/TestConnection',`selectedPlugin=${this.state.selectedPlugin}`,{
      headers :{
      }


    }).then((response)=>{
			this.props.isNotLoading();
    		if(response.data.status === 'true'){

    			alert('Connection Successful')
    		}else{

    			alert('Connection Test failed')
    		}

    })
	}
	createModel(event){

		event.preventDefault();
		var selectedPlugin = this.state.selectedPlugin

		axios.post('http://localhost:9090/PVPUI/CreateModel',`selectedPlugin=${this.state.selectedPlugin}`,{
      headers :{
      }


    }).then((response)=>{

    	var parsedJson = JSON.parse(atob(response.data))
    	console.log(parsedJson.objectList)

    })

	}




	render(){

		


		return(
			
			<form className="form-inline" style={{width : "100%"}}>
			<div className = "d-flex justify-content-start" style={{width : "50%"}}>
			<DropDownList data={this.state.pluginList} defaultValue="Select Plugin"  onChange = {this.setPlugin.bind(this)}style={{width : "100%"}}/>
			</div>
			<div className = "d-flex justify-content-end" style={{width : "50%"}}>
				<Button primary={true} onClick={this.connectionTest.bind(this)}>Test Connection</Button>
				<Button primary={false} onClick={this.createModel.bind(this)}>Create Model</Button>
			</div>
			</form>
			
			)
	}
}