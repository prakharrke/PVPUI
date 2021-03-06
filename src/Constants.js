exports.Constants = {

	MLVFunctions : ['SUM','AVG','MAX','MIN','COUNT'],
	MLVWhereClauseFunctions : [],
	MLVOperators : [],
	
}

exports.explicitRelationOperators = ['>=', '<=', '<>', '<', '>', '=', 'AND', 'OR', 'IN']
exports.CacheTypes = ['USE SITE SETTING', 'APPLICATION', 'CACHE', 'HYBRID', 'INGNORE APP SECURITY'] 
exports.dataTypes = [{dataType : "String",type:12,id:0},{dataType : "Integer",type:4,id:1},{dataType : "Number",type:2,id:2},{dataType : "Date",type:91,id:3},{dataType : "Time Stamp",type:93,id:4},{dataType : "Double",type:8,id:5},{dataType : "Float",type:6,id:6}]
exports.PLM = ['Agile','Aras','Enovia','IFS','Metaphase','Simatic','TC','windchill', 'TEAMCENTER'];
exports.ALM = ['clearcase','clearquest','doors','primavera'];
exports.DB = ['Cassandra','jdbc','oracle','orientdb','hana','sql','db2'];
exports.ERP = ['t4s','sap'];
exports.activityTypes = ['Insert', 'Update', 'Delete', 'Select', 'Stored Procedure', 'Bulk Insert', 'Bulk Update'];
exports.mlvObjects = ['MLVLEFTOBJ','MLVRIGHTOBJ'];
exports.eQAttributes = ['eQBusinessRule','LEVELIDENTIFIER','LEVELROWNUM','EQMLVDEPTH','EQUBENONE','STOP_RECURSION_CONDITION'];
exports.url = '';
exports.ifExistsOperations = [{procedureName : 'CONTINUE', procedureSignature : 'CONTINUE', isProcedure : false},{procedureName : 'EXIT', procedureSignature : 'EXIT', isProcedure : false}, {procedureName : 'IGNORE', procedureSignature : 'IGNORE', isProcedure : false},{procedureName : 'SKIPLEVEL', procedureSignature : 'SKIPLEVEL', isProcedure : false},{procedureName : 'UPDATE_CURRENT_ROW', procedureSignature : 'UPDATE_CURRENT_ROW', isProcedure : false}]
exports.onErrorOperations = ['EQACTION', 'CONTINUE', 'ERRORCODE', 'ERRORDESC', 'EXIT', 'IGNORE', 'SKIPLEVEL'];
