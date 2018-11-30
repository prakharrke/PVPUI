export function generateColumnName(oldColName){

	return oldColName.replace(new RegExp('\\[', 'g'), '').replace(new RegExp('\\]', 'g'), '').replace(new RegExp(' ', 'g'), '_').replace(new RegExp('\\)', 'g'), '_').replace(new RegExp('\\(', 'g'), '_')

}