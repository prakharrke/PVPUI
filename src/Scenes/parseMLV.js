import React, { Component } from 'react';

export default class ParseMLV extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mlv: ""
		}
	}
	sourceRegex = new RegExp(/(?<=src\s*?=)(.*?)(?=;)/);
	
	parseMLV(event) {
		var mlv = event.target.value.replace('Level', "Level".fontcolor("red"));
		if (event.target.value != '') {
			var mlvDetailsString = event.target.value.split('Level')[0].trim();
			var attributeNames = mlvDetailsString.split('attributes')[1].trim().split('=')[1].trim().split(';')[0].split(',')
			var levelStringsArray = event.target.value.split('Level')
			levelStringsArray.splice(0, 1)
			//var index = this.findClosingBracket(levelStringsArray[0].trim(),levelStringsArray[0].trim().indexOf('{'))
			levelStringsArray.map(level => {
				// * THIS IS ENTIRE LEVEL STRING. FETCH INDEX OF LAST CLOSING CURLY BRACE AND GET SUBSTRING FROM THE OPENING AND CLOSING CURLY BRACES FOR LEVEL DETAILS
				var levelString = level.substring(
					level.indexOf('{') + 1, this.findClosingBracket(level, level.indexOf('{'))
				)

				//console.log(levelString)
				// * FETCH SOURCE_NAME FROM THE LEVEL STRING
				var source = levelString.match(this.sourceRegex)[0].trim();
				console.log(source)
				
			})

		}

		this.setState({
			mlv: mlv
		})
	}


	findClosingBracket(str, pos) {
		var rExp = /\{|\}/g;
		rExp.lastIndex = pos + 1;
		var deep = 1;
		while ((pos = rExp.exec(str))) {
			if (!(deep += str[pos.index] === "{" ? 1 : -1)) { return pos.index }
		}
	}

	render() {

		return (
			<div>
				<textarea
					value={this.state.mlv}
					onChange={this.parseMLV.bind(this)}
				>

				</textarea>



			</div>
		)
	}
}