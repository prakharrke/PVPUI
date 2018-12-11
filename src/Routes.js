import React, { Component } from 'react';
import { BrowserRouter, Route, Router, HashRouter, Redirect, Switch } from 'react-router-dom';
import PVPUI from './Scenes/PVPUI';
import LoginForm from './Scenes/loginForm'
import Report from './Scenes/Report'
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
			isUserAuthenticated: false
		}
	}
	authenticateUser(){

			
			this.setState({
				isUserAuthenticated:true
			})
			
			
		
	}

	render() {

		return (

			<BrowserRouter>

				<Switch>
				<Route exact  path='/reports' component = {Report} />
				<Route exact  path='/login' render={props=>{return (<LoginForm authenticateUser={this.authenticateUser.bind(this)} isUserAuthenticated={this.state.isUserAuthenticated} />)}} />
				<PrivateRoute isAuthenticated={this.state.isUserAuthenticated} path='/' component = {PVPUI}/>
				</Switch>
			</BrowserRouter>

		)
	}
}