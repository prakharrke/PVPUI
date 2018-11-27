import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
export default class MLVGenerator extends Component {

	constructor(props) {

		super(props);

		this.state={

			value:[]
		}

	}

	onChange(event){

		this.setState({

			value : [...event.target.value]
		})
	}

	render() {
		var sports = [ "Baseball", "Basketball", "Cricket", "Field Hockey", "Football", "Table Tennis", "Tennis", "Volleyball" ];
		return (
				<div className="d-flex flex-row justify-content-center">
					<form className="form-inline" style={{width : "50%"}}>
					 <MultiSelect
                       placeholder = "Select Sources"
                       data={sports}
                       onChange={this.onChange.bind(this)}
                       value={this.state.value}
                       filterable={true}
                    />
					</form>
				</div>
		)
	}

}