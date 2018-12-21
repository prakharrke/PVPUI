export function generateColumnName(oldColName) {

	return oldColName.replace(new RegExp('\\[', 'g'), '').replace(new RegExp('\\]', 'g'), '').replace(new RegExp(' ', 'g'), '_').replace(new RegExp('\\)', 'g'), '_').replace(new RegExp('\\(', 'g'), '_').replace(new RegExp('\\+', 'g'), '_').replace(new RegExp('\\-', 'g'), '_').replace(new RegExp('\\*', 'g'), '_').replace(new RegExp('\\/', 'g'), '_').replace(new RegExp('\\%', 'g'), '_').replace(new RegExp('\\\\', 'g'), '_').replace(new RegExp('\\.', 'g'), '_').trim()

}

export function getFilters(type) {
	console.log("HERE")
	console.log(type)
	switch (type) {
		case 12:
			return [{name:"equalTo",value:'='},{name:"notEqualTo",value:'<>'},{name:"LIKE",value:'LIKE'},{name:"IN",value:'IN'},{name:"NOTLIKE",value:'NOT LIKE'},{name:"NOTIN",value:'NOT IN'}];
			break;
		
		case 4:
			return [{name:"equalTo",value:'='},{name:"lessThan",value:'<'},{name:"greaterThan",value:'>'},{name:"lessThanEqualTo",value:'<='},{name:"greaterThanEqualTo",value:'>='},{name:"IN",value:'IN'},{name:"NOTIN",value:'NOT IN'}]
			break;
		
		case 2:
			return [{name:"equalTo",value:'='},{name:"lessThan",value:'<'},{name:"greaterThan",value:'>'},{name:"lessThanEqualTo",value:'<='},{name:"greaterThanEqualTo",value:'>='},{name:"IN",value:'IN'},{name:"NOTIN",value:'NOT IN'}]
			break;
		
		case 8:
			return [{name:"equalTo",value:'='},{name:"lessThan",value:'<'},{name:"greaterThan",value:'>'},{name:"lessThanEqualTo",value:'<='},{name:"greaterThanEqualTo",value:'>='},{name:"IN",value:'IN'},{name:"NOTIN",value:'NOT IN'}]
			break;
		
		case 6:
			return [{name:"equalTo",value:'='},{name:"lessThan",value:'<'},{name:"greaterThan",value:'>'},{name:"lessThanEqualTo",value:'<='},{name:"greaterThanEqualTo",value:'>='},{name:"IN",value:'IN'},{name:"NOTIN",value:'NOT IN'}]
			break;
		
		case 91:
			return [{name:"equalTo",value:'='},{name:"lessThan",value:'<'},{name:"greaterThan",value:'>'},{name:"lessThanEqualTo",value:'<='},{name:"greaterThanEqualTo",value:'>='},{name:"BETWEEN",value:'BETWEEN'}]
			break;
		
		case 93:
			return [{name:"equalTo",value:'='},{name:"lessThan",value:'<'},{name:"greaterThan",value:'>'},{name:"lessThanEqualTo",value:'<='},{name:"greaterThanEqualTo",value:'>='},{name:"BETWEEN",value:'BETWEEN'}]
			break;
		
		default:
			// code...
			break;
	}

}