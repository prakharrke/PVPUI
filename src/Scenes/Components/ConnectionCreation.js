import React, { Component } from 'react';
import axios from 'axios';
import {DropDownList} from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import * as Constants from '../../Constants.js'
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

			this.props.isLoading();

		    axios.post('http://localhost:9090/PVPUI/GetPlugins',{p :'1'},{
      headers :{

        'Content-Type' : 'application/json',



      }


    }).then((response)=>{
			
			this.props.isNotLoading();
			var parsedJson = response.data;
			Constants.Constants.MLVFunctions = parsedJson.MLVFunctions;
			Constants.Constants.MLVWhereClauseFunctions = parsedJson.MLVWhereClauseFunctions;
			Constants.Constants.MLVOperators = parsedJson.MLVOperators;
    		var pluginList = new Array();
    		pluginList = parsedJson.pluginList.split(",")

    		this.setState({

    			pluginList : pluginList
    		})

    }).catch(e=>{
    	console.log(e)
    	alert("Something went wrong")
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
		if(selectedPlugin === '' || selectedPlugin === null || selectedPlugin === undefined){
			alert('Please select a plugin to connect to');
			return
		}
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

    }).catch((e)=>{
    	console.log(e);
    	alert(e);
    })
	}
	createModel(event){

		event.preventDefault();
		var selectedPlugin = this.state.selectedPlugin
		if(selectedPlugin === '' || selectedPlugin === null || selectedPlugin === undefined){
			alert('Please select a plugin to connect to');
			return
		}
		this.props.modelNotCreated();
		axios.post('http://localhost:9090/PVPUI/CreateModel',`selectedPlugin=${this.state.selectedPlugin}`,{
      headers :{
      }


    }).then((response)=>{

    	var parsedJson = JSON.parse(atob(response.data))
    	
    	var objectList = new Array();
    	objectList = parsedJson.objectList;
    	
    	this.props.setObjectList(objectList);
    	this.props.modelCreated();

    }).catch(e=>{
    	console.log(e)
    	alert(e)
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