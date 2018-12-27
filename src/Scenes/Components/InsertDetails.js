import React, { Component } from 'react';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
export default class InsertDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchFromAnotherSource : false
		}
	}
	toggleFetchFromAnotherSource(event){
		event.preventDefault();
		this.setState({
			fetchFromAnotherSource : !this.state.fetchFromAnotherSource
		})
	}
	render() {
		return (
				<div row="justify-content-center" style={{ marginTop: "1em", width : "110em" }}>
				<div className="row justify-content-center">
					<div className="col-lg-4">
						<Button
							style={{ margin: "1em" }}
							onClick={this.toggleFetchFromAnotherSource.bind(this)}
						>
							Fetch from another source
						</Button>
						<Switch
							style={{ margin: "1em" }}
							checked={this.state.fetchFromAnotherSource}
						/>
					</div>

				</div>
				<div className="row" style={{ marginTop: "1em", width : "100%" }}>
					<div className="col-lg-12 justify-content-center panel-wrapper" style={{ maxWidth: "100%", margin: "0 auto" }}>

						<PanelBar >
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Fetch From Another Source</i>}>
							
							
							</PanelBarItem>
							<PanelBarItem title={<i style={{ fontSize: "16px" }}>Insert MLV</i>}></PanelBarItem>
						</PanelBar>


						</div>
						</div>
				</div>
			
		)
	}
}