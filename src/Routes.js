import React, { Component } from 'react';
import { BrowserRouter, Route, Router, HashRouter, Redirect, Switch } from 'react-router-dom';
import PVPUI from './Scenes/PVPUI';
import LoginForm from './Scenes/loginForm'
import ReportContainer from './Scenes/ReportContainer'

import DetailedReportContainer from './Scenes/DetailedReportContainer'
import ParseMLV from './Scenes/parseMLV'

const PrivateRoute = ({ component: Component, ...rest }) => {

	console.log(rest)

	return (
		<Route  {...rest} render={props => (

			rest.isAuthenticated ? (
				<Component {...props} />
			) : (
					<Redirect to={{
						pathname: "/login",

					}} />
				)
		)} />);
}

export default class Routes extends Component {


	constructor(props) {

		super(props);
		this.state = {
			isUserAuthenticated: false,
			connectionNames : []
		}
	}
	authenticateUser(){

			
			this.setState({
				isUserAuthenticated:true
			})
			
			
		
	}

	holdConnectionNamesArray(connectionNameArray){
		this.setState({
			connectionNames : connectionNameArray
		})
	}

	render() {

		return (

			<HashRouter basename="/PVPUI" >

				<Switch>
				<Route path="/parseMLV" component={ParseMLV}/>
				<Route  path='/reports/details' render = {props=>{return (<DetailedReportContainer connectionNames={this.state.connectionNames}/>)}} />
				<Route path='/reports' render = {props=>{return (<ReportContainer holdConnectionNamesArray={this.holdConnectionNamesArray.bind(this)}/>)}} />
				<Route  path='/login' render={props=>{return (<LoginForm authenticateUser={this.authenticateUser.bind(this)} isUserAuthenticated={this.state.isUserAuthenticated} />)}} />
				<PrivateRoute isAuthenticated={this.state.isUserAuthenticated} path='/' component = {PVPUI}/>
				</Switch>
			</HashRouter>

		)
	}
}