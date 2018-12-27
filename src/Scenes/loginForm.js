import React, { Component } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
export default class LoginForm extends Component {
	constructor(props) {

		super(props);
		this.state = {
			username: '',
			password: ''
		}
	}

	login(event) {

		axios.post('http://localhost:9090/PVPUI/AuthenticateUser', `userDetails=${JSON.stringify({ username: this.state.username, password: this.state.password })}`, {
			headers: {
			}


		}).then(response => {
			if (response.data === true) {
				this.props.authenticateUser();
			}
			else {

				alert('Invalid username or password')
			}
		})
	}
	setUserName(event) {
		this.setState({
			username: event.target.value
		})
	}
	setPassword(event) {
		this.setState({
			password: event.target.value
		})
	}

	render() {

		var redirect = this.props.isUserAuthenticated ? <Redirect to={{ pathname: "/" }} /> : ''
		console.log(this.props)
		return (


			<div className="row justify-content-center align-items-center" style={{ height: "40em" }}>
				{redirect}
				<div className="col-lg-4 align-items-center">
					<div className="card">
						<div className="card-block">
							<form className="k-form">
								<fieldset>
									<legend>Login:</legend>
									<div className="mb-3">
										<Input
											name="username"
											style={{ width: "100%" }}
											label="username"
											pattern={"[A-Za-z]+"}
											minLength={2}
											required={true}
											onChange={this.setUserName.bind(this)}
										/>
									</div>
									<div className="mb-3">
										<Input
											name="password"
											type="password"
											style={{ width: '100%' }}
											label="Password"
											required={true}
											onChange={this.setPassword.bind(this)}
										/>
									</div>
								</fieldset>
								<input type="button" className="k-button k-primary" value="Login" onClick={this.login.bind(this)} />
							</form>
						</div>
					</div>
					<div className="row justify-content-center" style={{marginTop : '1em'}}>
						<h5>OR</h5>
						</div>
					<div className="row justify-content-center">
					<NavLink to={{
							pathname: `/reports`,

						}}>View Reports</NavLink>
						</div>
				</div>
			</div>
		);
	}

}